import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://www.missionratedhq.com",
  "https://missionratedhq.com",
  "http://localhost:3000",
  "http://localhost:8080"
]);

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

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
  if (origin && !allowedOrigins.has(origin)) return json({ ok: false, error: "origin_not_allowed" }, 403, headers);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400, headers); }

  if (String(body.company || "").trim()) return json({ ok: true }, 200, headers);

  const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
  const source = String(body.source || "homepage").trim().slice(0, 80) || "homepage";
  const installation = String(body.installation || "").trim().slice(0, 120) || null;
  if (!emailPattern.test(email)) return json({ ok: false, error: "invalid_email" }, 400, headers);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ ok: false, error: "server_config" }, 500, headers);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { error } = await supabase.from("weekend_brief_subscribers").upsert({
    email,
    source,
    installation,
    status: "active",
    consented_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: "email_normalized" });

  if (error) {
    console.error("weekend_brief_signup_failed", { code: error.code });
    return json({ ok: false, error: "signup_failed" }, 500, headers);
  }

  return json({ ok: true }, 200, headers);
});

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), { status, headers });
}
