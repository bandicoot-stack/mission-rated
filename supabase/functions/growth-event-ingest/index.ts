import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.1.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const ISSUER = "https://oidc.vercel.com/mission-rated";
const AUDIENCE = "https://vercel.com/mission-rated";
const SUBJECT = "owner:mission-rated:project:mission-rated-beta:environment:production";
const PROJECT_ID = "prj_mk9F2l6zlQ1oqWEh8DfluKKqMBQO";
const OWNER_ID = "team_keaLn1aS3rp2RW0ewC2SwKJV";
const JWKS = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks`));

const ALLOWED_EVENTS = new Set([
  'page_view','search','installation_change','source_click','feedback_open','data_report_open','beta_invite_share',
  'referral_visit','return_visit','deal_click','deal_outbound_click','share_action','claim_action','weekend_brief_signup_attempt','weekend_brief_signup_confirmed',
  'family_pass_cta_clicked','family_pass_cta_dismissed',
  'directions_click','review_action','feedback_action','offer_source_click','official_website_click','internal_navigation'
]);

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ ok: false }, 405);

  const token = bearer(req.headers.get('authorization'));
  if (!token) return json({ ok: false }, 401);

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: ISSUER,
      audience: AUDIENCE,
      subject: SUBJECT,
    });
    if (payload.project_id !== PROJECT_ID || payload.owner_id !== OWNER_ID || payload.environment !== 'production') {
      return json({ ok: false }, 403);
    }
  } catch {
    return json({ ok: false }, 401);
  }

  const raw = await req.json().catch(() => ({}));
  const eventName = clean(raw.event_name, 60);
  if (!ALLOWED_EVENTS.has(eventName)) return json({ ok: false }, 400);

  const row = {
    event_name: eventName,
    path: clean(raw.path, 200) || '/',
    target_type: nullable(clean(raw.target_type, 40)),
    target_id: nullable(clean(raw.target_id, 120)),
    session_id: cleanUuid(raw.session_id),
    visitor_id: cleanUuid(raw.visitor_id),
    referrer_host: nullable(cleanHost(raw.referrer_host)),
    utm_source: nullable(clean(raw.utm_source, 80)),
    utm_medium: nullable(clean(raw.utm_medium, 80)),
    utm_campaign: nullable(clean(raw.utm_campaign, 120)),
    destination: nullable(clean(raw.destination, 160)),
    event_metadata: {
      item: nullable(clean(raw.event_metadata?.item, 120)),
      deal_source: nullable(clean(raw.event_metadata?.deal_source, 80)),
      share_method: nullable(clean(raw.event_metadata?.share_method, 20)),
      signup_surface: nullable(clean(raw.event_metadata?.signup_surface, 80)),
      referral_code: cleanUuid(raw.event_metadata?.referral_code),
      days_since_last: boundedNumber(raw.event_metadata?.days_since_last, 0, 3650),
      ingestion: 'vercel_oidc_v1'
    }
  };

  const url = Deno.env.get('SUPABASE_URL');
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceRole) return json({ ok: false }, 503);

  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });
  const { error } = await supabase.from('product_events').insert(row);
  if (error) {
    console.error('growth_event_insert_failed', error.code || 'unknown');
    return json({ ok: false }, 503);
  }

  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
});

function bearer(value: string | null) {
  const match = String(value || '').match(/^Bearer\s+(.+)$/i);
  return match?.[1] || '';
}
function clean(value: unknown, max: number) {
  return String(value || '').replace(/[\r\n\t]/g, ' ').slice(0, max);
}
function nullable(value: string) { return value || null; }
function cleanUuid(value: unknown) {
  const v = String(value || '').toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v) ? v : null;
}
function cleanHost(value: unknown) {
  const v = String(value || '').trim().toLowerCase().replace(/^www\./,'');
  return /^[a-z0-9.-]{1,253}$/.test(v) ? v : '';
}
function boundedNumber(value: unknown, min: number, max: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
}
function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
