const ALLOWED_EVENTS = new Set(['page_view','search','installation_change','source_click','feedback_open','data_report_open','beta_invite_share']);

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
  const event = String(body.event || '').slice(0, 60);
  if (!ALLOWED_EVENTS.has(event)) return res.status(400).json({ ok: false });

  const payload = {
    level: 'info',
    msg: 'mission_rated_beta_event',
    event,
    item: clean(body.item, 120),
    path: clean(body.path, 200),
    ts: new Date().toISOString()
  };

  console.log(JSON.stringify(payload));
  res.setHeader('Cache-Control', 'no-store');
  return res.status(204).end();
}

function isSameOriginBrowserRequest(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

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

function safeParse(value) {
  try { return JSON.parse(value); } catch { return {}; }
}
