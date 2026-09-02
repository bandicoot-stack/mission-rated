import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const allowedOrigin = (origin: string | null) => {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return host === "missionratedhq.com" || host === "www.missionratedhq.com" || host.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

const headers = (origin: string | null) => ({
  "access-control-allow-origin": allowedOrigin(origin) ? origin! : "https://www.missionratedhq.com",
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type,authorization,apikey",
  "cache-control": "no-store, max-age=0",
  "content-type": "application/json; charset=utf-8",
  "vary": "Origin"
});

Deno.serve((req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: headers(origin) });
  }

  return new Response(
    JSON.stringify({ ok: false, error: "founder_authorization_not_configured" }),
    { status: 403, headers: headers(origin) }
  );
});