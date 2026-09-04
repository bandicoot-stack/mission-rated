import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// CORS: this browser-write endpoint restricts browser cross-origin access to Mission Rated origins; Origin/CORS is not authentication or proof of subscriber consent.
const allowedOrigins = new Set([
  "https://www.missionratedhq.com",
  "https://missionratedhq.com",
  "http://localhost:3000",
  "http://localhost:8080"
]);

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const buckets = new Map<string, { count: number; resetAt: number }>();
const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function clientKey(req: Request) {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function rateLimited(req: Request) {
  const now = Date.now();
  const key = clientKey(req);
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  if (buckets.size > 5000) {
    for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }
  return current.count > MAX_REQUESTS;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") || "";
  const corsOrigin = allowedOrigins.has(origin) ? origin : "https://www.missionratedhq.com";
  const headers = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Cache-Control": "no-store",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405, headers);
  if (!origin || !allowedOrigins.has(origin)) return json({ ok: false, error: "origin_not_allowed" }, 403, headers);
  if (rateLimited(req)) return json({ ok: false, error: "rate_limited" }, 429, { ...headers, "Retry-After": "60" });

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400, headers); }

  if (String(body.company || "").trim()) return json({ ok: true }, 200, headers);

  const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
  if (!emailPattern.test(email)) return json({ ok: false, error: "invalid_email" }, 400, headers);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ ok: false, error: "server_config" }, 500, headers);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // Consent is sticky: a public signup must never silently reactivate an address
  // that was explicitly unsubscribed. Active duplicates remain idempotent.
  const { data: existing, error: lookupError } = await supabase
    .from("weekend_brief_subscribers")
    .select("status")
    .eq("email_normalized", email)
    .maybeSingle();

  if (lookupError) {
    console.error("weekend_brief_signup_lookup_failed", { code: lookupError.code });
    return json({ ok: false, error: "signup_failed" }, 500, headers);
  }

  if (existing?.status === "unsubscribed") {
    return json({ ok: false, error: "resubscribe_required" }, 409, headers);
  }

  if (existing?.status === "active") {
    return json({ ok: true, already_subscribed: true }, 200, headers);
  }

  // An allowlisted Origin is a CORS control, not proof that the owner of this
  // email address consented. Until an inbox-control confirmation flow exists,
  // fail closed rather than manufacture an authoritative active subscriber.
  // This intentionally performs no insert and sets no consent timestamp.
  return json({ ok: false, error: "confirmation_required" }, 503, headers);
});

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), { status, headers });
}
