# Design: Authoritative Growth Event Persistence

## Architecture
`analytics.js` continues to send browser events only to same-origin `/api/event`. The Vercel server function remains the trust boundary: it rejects non-same-origin requests, allowlists event names, sanitizes every accepted field, then writes a mapped row to Supabase REST using `SUPABASE_SERVICE_ROLE_KEY` held only in the server environment.

No browser code receives a Supabase key. No direct anonymous insert policy is added to `product_events`.

## Stored mapping
- `event_name` ← sanitized allowed event
- `path` ← sanitized path, falling back to `/` when blank
- `target_type`, `target_id`, `destination`, UTM fields, `referrer_host` ← existing sanitized fields
- `session_id`, `visitor_id` ← existing UUID-only sanitizers
- `event_metadata` ← sanitized `item`, `deal_source`, `share_method`, `signup_surface`, `referral_code`, and bounded `days_since_last`

The database `created_at` timestamp remains authoritative; the browser/client timestamp is not stored as an event-time claim.

## Failure behavior
If the service key is absent, return `503` and do not claim ingestion success. If Supabase rejects the insert or is unavailable, log a bounded server error and return `503`. Client analytics failures must remain non-blocking to the user journey.

## Trust boundary
This change does not convert intent events into confirmations. `weekend_brief_signup_confirmed` still requires authoritative signup success; share/claim/click/referral events remain intent/outcome semantics only. No analytics event writes or modifies `verified_savings`.

## Rollback
Revert the server persistence commit to restore log-only behavior. No destructive schema change is required because the prerequisite event-name constraint migration is already deployed and backward compatible.
