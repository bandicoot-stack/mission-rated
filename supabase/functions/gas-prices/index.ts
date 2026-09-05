import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'

const fuels = new Set(['Regular','Midgrade','Premium','Diesel'])
const MAX_PER_HOUR = 8
const MARKET='Norfolk-Virginia Beach-Newport News'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const headers = { ...corsHeaders, 'Content-Type':'application/json', 'Cache-Control':'no-store' }
  try {
    const secrets = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
    const secret = secrets.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!secret) throw new Error('Missing Supabase secret key')
    const db = createClient(Deno.env.get('SUPABASE_URL')!, secret, { auth:{persistSession:false} })

    if (req.method === 'GET') {
      const url = new URL(req.url)
      const fuel = clean(url.searchParams.get('fuel'), 16) || 'Regular'
      const q = clean(url.searchParams.get('q'), 80)
      let query = db.from('gas_reports').select('id,station_name,location_text,fuel_type,price_per_gallon,source_type,created_at').eq('status','published').gte('created_at', new Date(Date.now()-72*60*60*1000).toISOString()).order('created_at',{ascending:false}).limit(250)
      if (fuel && fuels.has(fuel)) query = query.eq('fuel_type', fuel)
      const { data, error } = await query
      if (error) throw error
      const rows = (data || []).filter((r:any)=>!q || `${r.station_name} ${r.location_text}`.toLowerCase().includes(q.toLowerCase()))
      const prices = rows.map((r:any)=>Number(r.price_per_gallon)).filter((n:number)=>Number.isFinite(n))
      const community = prices.length ? {
        count: prices.length,
        average: prices.reduce((a:number,b:number)=>a+b,0)/prices.length,
        low: Math.min(...prices),
        high: Math.max(...prices),
        freshest_at: rows[0]?.created_at || null
      } : { count:0, average:null, low:null, high:null, freshest_at:null }
      const { data:benchmarks, error:be } = await db.from('gas_benchmarks').select('fuel_type,average_price,source_name,source_url,price_date,created_at').eq('market',MARKET).eq('fuel_type',fuel).order('price_date',{ascending:false}).limit(2)
      if (be) throw be
      const current=benchmarks?.[0]||null, previous=benchmarks?.[1]||null
      const benchmark=current?{...current,previous_average:previous?Number(previous.average_price):null,change:previous?Number(current.average_price)-Number(previous.average_price):null}:null
      return new Response(JSON.stringify({ok:true,market:MARKET,fuel,reports:rows,community,benchmark,server_time:new Date().toISOString()}),{status:200,headers})
    }

    if (req.method === 'POST') {
      const body = await req.json()
      if (clean(body.website,80)) return new Response(JSON.stringify({ok:true}),{status:200,headers})
      const station_name = clean(body.station_name,120)
      const location_text = clean(body.location_text,180)
      const fuel_type = clean(body.fuel_type,16)
      const price = Number(body.price_per_gallon)
      const device_id = clean(body.device_id,120)
      if (station_name.length < 2 || location_text.length < 2 || !fuels.has(fuel_type) || !Number.isFinite(price) || price < 1 || price > 10) return new Response(JSON.stringify({ok:false,error:'invalid_input'}),{status:400,headers})
      if (device_id) {
        const hourAgo = new Date(Date.now()-60*60*1000).toISOString()
        const { data: recent, error: re } = await db.from('gas_reports').select('id').eq('reporter_fingerprint',device_id).gte('created_at',hourAgo).limit(MAX_PER_HOUR)
        if (re) throw re
        if ((recent||[]).length >= MAX_PER_HOUR) return new Response(JSON.stringify({ok:false,error:'rate_limited'}),{status:429,headers})
      }
      const { data, error } = await db.from('gas_reports').insert({station_name,location_text,fuel_type,price_per_gallon:price,source_type:'community',status:'published',reporter_fingerprint:device_id||null}).select('id,created_at').single()
      if (error) throw error
      return new Response(JSON.stringify({ok:true,id:data?.id,created_at:data?.created_at}),{status:200,headers})
    }

    return new Response(JSON.stringify({ok:false}),{status:405,headers})
  } catch (e) {
    console.error('gas-prices failed', e instanceof Error ? e.message : String(e))
    return new Response(JSON.stringify({ok:false,error:'server_error'}),{status:500,headers})
  }
})

function clean(v:unknown,max:number){return String(v??'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max)}
