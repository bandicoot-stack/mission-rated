# Design

Use the same bounded in-memory IP bucket pattern already deployed in `mission-star-wallet`:

- 60 requests per 60-second window.
- Client key preference: `cf-connecting-ip`, then first `x-forwarded-for`, then `unknown`.
- Opportunistic cleanup when bucket count grows beyond 5,000 entries.

For POST requests, require `Origin` to be present and in the existing `allowedOrigins` set. OPTIONS remains available for browser preflight. CORS response headers continue to use the existing approved-origin behavior.

This is intentionally a lightweight abuse control, not a durable distributed rate limiter. Supabase edge instances may maintain separate in-memory buckets; the goal is to remove the unbounded public-write path without adding paid infrastructure.