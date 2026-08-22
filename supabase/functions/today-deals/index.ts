import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'

const TZ='America/New_York'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const headers={...corsHeaders,'Content-Type':'application/json','Cache-Control':'public, max-age=300'}
  if (req.method !== 'GET') return new Response(JSON.stringify({ok:false}),{status:405,headers})
  try {
    const secrets=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}')
    const secret=secrets.default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if(!secret) throw new Error('Missing Supabase secret key')
    const db=createClient(Deno.env.get('SUPABASE_URL')!,secret,{auth:{persistSession:false}})
    const now=new Date()
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'long',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now)
    const pick=(t:string)=>parts.find(p=>p.type===t)?.value||''
    const weekday=pick('weekday')
    const isoDay=({Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5,Saturday:6,Sunday:7} as Record<string,number>)[weekday]
    const localDate=`${pick('year')}-${pick('month')}-${pick('day')}`
    const {data,error}=await db.from('deals').select('id,business_id,title,description,offer_type,offer_value_text,terms,source_url,starts_at,ends_at,verified_at,recurrence_days,recurrence_label,businesses(id,name,category,city,state,website_url)').eq('active',true).order('verified_at',{ascending:false}).limit(300)
    if(error) throw error
    const valid=(data||[]).filter((d:any)=>{
      if(d.starts_at && new Date(d.starts_at)>now) return false
      if(d.ends_at && new Date(d.ends_at)<now) return false
      return true
    })
    const recurring=valid.filter((d:any)=>Array.isArray(d.recurrence_days)&&d.recurrence_days.length>0)
    const scheduled=recurring.filter((d:any)=>d.recurrence_days.includes(isoDay))
    const everyday=valid.filter((d:any)=>!Array.isArray(d.recurrence_days)||d.recurrence_days.length===0)
    const score=(d:any)=>{
      const text=`${d.offer_value_text||''} ${d.title||''}`.toLowerCase()
      let s=0
      if(d.offer_type==='free_item'||text.includes('free')||text.includes('complimentary')) s+=100
      const pct=text.match(/(\d{1,2})%/); if(pct) s+=Number(pct[1])
      const dollars=text.match(/\$(\d+)/); if(dollars) s+=Math.min(50,Number(dollars[1]))
      if(d.source_url) s+=5
      return s
    }
    const shape=(d:any)=>({id:d.id,title:d.title,description:d.description,offer_type:d.offer_type,offer_value_text:d.offer_value_text,terms:d.terms,source_url:d.source_url,verified_at:d.verified_at,recurrence_days:d.recurrence_days,recurrence_label:d.recurrence_label,business:d.businesses||null})
    scheduled.sort((a:any,b:any)=>score(b)-score(a))
    everyday.sort((a:any,b:any)=>score(b)-score(a))
    recurring.sort((a:any,b:any)=>score(b)-score(a))
    return new Response(JSON.stringify({ok:true,timezone:TZ,date:localDate,weekday,today_specific:scheduled.slice(0,10).map(shape),weekly_specials:recurring.slice(0,20).map(shape),everyday:everyday.slice(0,10).map(shape)}),{status:200,headers})
  } catch(e) {
    console.error('today-deals failed',e instanceof Error?e.message:String(e))
    return new Response(JSON.stringify({ok:false,error:'server_error'}),{status:500,headers})
  }
})
