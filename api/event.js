const ALLOWED_EVENTS = new Set([
  'page_view','search','installation_change','source_click','feedback_open','data_report_open','beta_invite_share',
  'referral_visit','return_visit','deal_click','share_action','claim_action','weekend_brief_signup_attempt','weekend_brief_signup_confirmed',
  'directions_click','review_action','feedback_action','offer_source_click','official_website_click','internal_navigation'
]);

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  if (!isSameOriginBrowserRequest(req)) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(403).json({ ok: false });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const event = clean(body.event || body.event_name, 60);
  if (!ALLOWED_EVENTS.has(event)) return res.status(400).json({ ok: false });

  const payload = {
    level: 'info',
    msg: 'mission_rated_beta_event',
    event,
    item: clean(body.item, 120),
    path: clean(body.path, 200),
    target_type: clean(body.target_type, 40),
    target_id: clean(body.target_id, 120),
    deal_source: clean(body.deal_source, 80),
    share_method: clean(body.share_method, 20),
    signup_surface: clean(body.signup_surface, 80),
    destination: clean(body.destination, 160),
    utm_source: clean(body.utm_source, 80),
    utm_medium: clean(body.utm_medium, 80),
    utm_campaign: clean(body.utm_campaign, 120),
    // Referral links are generated from a pseudonymous UUID in analytics.js.
    // Accept only that shape so arbitrary query-string values cannot pollute
    // referral attribution or become free-form data in analytics logs.
    referral_code: cleanUuid(body.referral_code),
    session_id: cleanUuid(body.session_id),
    visitor_id: cleanUuid(body.visitor_id),
    referrer_host: cleanHost(body.referrer_host),
    days_since_last: boundedNumber(body.days_since_last, 0, 3650),
    ts: new Date().toISOString()
  };

  console.log(JSON.stringify(payload));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(204).end();
}

function isSameOriginBrowserRequest(req) {
  // Growth metrics are only accepted from the Mission Rated browser client.
  // Reject originless POSTs so curl/bots cannot trivially manufacture claims,
  // shares, referrals, or signup events in the growth scorecard. Any future
  // trusted server/provider confirmation path should use its own authenticated
  // endpoint rather than weakening this browser-ingestion boundary.
  const origin = req.headers.origin;
  if (!origin) return false;

  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase();
  if (!host) return false;

  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

function clean(value, max) {
  return String(value || '').replace(/[\r\n\t]/g, ' ').slice(0, max);
}

function cleanUuid(value) {
  const v = String(value || '').toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v) ? v : '';
}

function cleanHost(value) {
  const v = String(value || '').trim().toLowerCase().replace(/^www\./,'');
  return /^[a-z0-9.-]{1,253}$/.test(v) ? v : '';
}

function boundedNumber(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
}

function safeParse(value) {
  try { return JSON.parse(value); } catch { return {}; }
}