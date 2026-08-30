# Proposal: Authoritative Growth Event Persistence

## Problem
Production browser analytics post accepted, sanitized Growth MVP events to same-origin `/api/event`, but that endpoint currently logs and returns `204` without writing to `public.product_events`. The Growth scorecard therefore cannot treat Supabase as a current authoritative event store.

## Change
Persist only the already-accepted and already-sanitized `/api/event` payload to `public.product_events` from the Vercel server function using the existing server-side Supabase service credential convention. Return success only after the durable write succeeds.

## Scope
- Preserve the existing same-origin browser boundary and event allowlist.
- Preserve all current field sanitization and pseudonymous UUID validation.
- Write only Growth-event data; never write or derive `verified_savings`.
- Do not add browser credentials or expose service-role material.
- Do not change ratings, Mission Score, verification, exclusivity, ranking, partner claims, or consent semantics.

## Acceptance criteria
1. Accepted `/api/event` requests are persisted to `public.product_events` using server-side credentials only.
2. The endpoint returns `204` only after Supabase accepts the write; unavailable configuration or failed writes fail closed with a non-2xx response.
3. The existing same-origin protection, event allowlist, sanitizers, and referral UUID constraints remain intact.
4. Stored columns map only to the existing `product_events` schema; additional sanitized event context is contained in `event_metadata`.
5. Growth QA explicitly guards durable persistence and the separation between analytics and `verified_savings`.
6. Normal QA, Integration QA, preview, production verification, and an independent store-freshness check must pass before issue #141 can be closed.
