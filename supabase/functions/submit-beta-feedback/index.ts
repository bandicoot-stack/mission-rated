import { createClient } from 'npm:@supabase/supabase-js@2.95.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2.95.0/cors'

const allowedTypes = new Set(['general','data_issue'])
const allowedHelpful = new Set(['yes','partly','no',''])
const allowedCategories = new Set(['general','schools','military_discount','business','base_intel','missing_info','bug','other',''])
const MAX_PER_HOUR = 12

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const headers = { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  if (req.method !== 'POST') return new Response(JSON.stringify({ ok:false }), { status:405, headers })

  try {
    const body = await req.json()
    if (String(body.website || '').trim()) return new Response(JSON.stringify({ ok:true }), { status:200, headers })

    const feedback_type = clean(body.feedback_type, 20)
    const helpful = clean(body.helpful, 12)
    const category = clean(body.category, 40)
    const message = clean(body.message, 1200)
    const page_path = clean(body.page_path, 240)
    const item_name = clean(body.item_name, 160)
    const contact_email = clean(body.contact_email, 180).toLowerCase()
    const device_id = clean(body.device_id, 120)

    if (!allowedTypes.has(feedback_type) || !allowedHelpful.has(helpful) || !allowedCategories.has(category)) {
      return new Response(JSON.stringify({ ok:false, error:'invalid_input' }), { status:400, headers })
    }
    if (message.length < 2) return new Response(JSON.stringify({ ok:false, error:'message_required' }), { status:400, headers })
    if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
      return new Response(JSON.stringify({ ok:false, error:'invalid_email' }), { status:400, headers })
    }

    const secrets = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
    const secret = secrets.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!secret) throw new Error('Missing Supabase secret key')
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, secret, { auth: { persistSession:false } })

    if (device_id) {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: recent, error: recentError } = await supabase.from('beta_feedback').select('id').eq('device_id', device_id).gte('created_at', hourAgo).limit(MAX_PER_HOUR)
      if (recentError) throw recentError
      if ((recent || []).length >= MAX_PER_HOUR) return new Response(JSON.stringify({ ok:false, error:'rate_limited' }), { status:429, headers })
    }

    const user_agent = clean(req.headers.get('user-agent') || '', 240)
    const { data, error } = await supabase.from('beta_feedback').insert({
      feedback_type,
      helpful: helpful || null,
      category: category || null,
      message,
      page_path: page_path || null,
      item_name: item_name || null,
      contact_email: contact_email || null,
      device_id: device_id || null,
      user_agent: user_agent || null,
      stars_awarded: 0,
      status: 'new'
    }).select('id').single()
    if (error) throw error

    if (device_id) {
      await supabase.from('mission_contributors').upsert({ device_id, contact_email: contact_email || null, updated_at: new Date().toISOString() }, { onConflict:'device_id' })
    }

    return new Response(JSON.stringify({ ok:true, pending_stars:1, feedback_id:String(data?.id ?? '') }), { status:200, headers })
  } catch (error) {
    console.error('submit-beta-feedback failed', error instanceof Error ? error.message : String(error))
    return new Response(JSON.stringify({ ok:false, error:'server_error' }), { status:500, headers })
  }
})

function clean(value: unknown, max: number) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max)
}
