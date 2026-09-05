import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.95.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2.95.0/cors";

const allowedTypes = new Set(['restaurant','realtor','business','review','discount','other']);
const MAX_PER_HOUR = 8;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(JSON.stringify({ ok:true }), { headers:corsHeaders });
  const headers = { ...corsHeaders, 'content-type':'application/json', 'cache-control':'no-store' };
  if (req.method !== 'POST') return new Response(JSON.stringify({ error:'method_not_allowed' }), { status:405, headers });

  try {
    const body = await req.json();
    if (String(body.website || '').trim()) return new Response(JSON.stringify({ ok:true }), { status:200, headers });

    const type = clean(body.contribution_type,30);
    const businessName = clean(body.business_name,180);
    const deviceId = clean(body.device_id,120);
    const contactEmail = clean(body.contact_email,180).toLowerCase();
    if (!allowedTypes.has(type) || businessName.length < 2 || deviceId.length < 12) return new Response(JSON.stringify({ error:'invalid_input' }), { status:400, headers });
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return new Response(JSON.stringify({ error:'invalid_email' }), { status:400, headers });

    const secrets = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
    const secret = secrets.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!secret) throw new Error('missing_secret');
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, secret, { auth:{ persistSession:false } });

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recent, error: recentError } = await supabase.from('mission_contributions').select('id').eq('device_id', deviceId).gte('created_at', hourAgo).limit(MAX_PER_HOUR);
    if (recentError) throw recentError;
    if ((recent || []).length >= MAX_PER_HOUR) return new Response(JSON.stringify({ error:'rate_limited' }), { status:429, headers });

    const { data: rule, error: ruleError } = await supabase.from('mission_star_rules').select('stars').eq('contribution_type',type).single();
    if (ruleError) throw ruleError;

    const payload = {
      contribution_type:type,
      business_name:businessName,
      category:clean(body.category,100) || null,
      city:clean(body.city,120) || null,
      website_url:clean(body.website_url,500) || null,
      review_rating:Number(body.review_rating)>=1 && Number(body.review_rating)<=5 ? Number(body.review_rating) : null,
      review_text:clean(body.review_text,1500) || null,
      contributor_name:clean(body.contributor_name,120) || null,
      contact_email:contactEmail || null,
      device_id:deviceId,
      stars_awarded:0,
      status:'pending'
    };

    const { error: insertError } = await supabase.from('mission_contributions').insert(payload);
    if (insertError) throw insertError;
    await supabase.from('mission_contributors').upsert({ device_id:deviceId, display_name:payload.contributor_name, contact_email:payload.contact_email, updated_at:new Date().toISOString() }, { onConflict:'device_id' });

    return new Response(JSON.stringify({ ok:true, pending_stars:Number(rule?.stars || 0), status:'pending' }), { status:200, headers });
  } catch (error) {
    console.error('submit-contribution failed', error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error:'submit_failed' }), { status:500, headers });
  }
});

function clean(value:unknown,max:number){return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max)}
