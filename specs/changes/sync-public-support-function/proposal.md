# Proposal — Sync deployed public-support function source

## Why

The deployed `public-support` Supabase Edge Function is active in production but its source is not tracked under `supabase/functions/`. That creates avoidable configuration drift and makes repository review incomplete.

## Scope

Track the exact currently deployed `public-support` v1 `index.ts` source in Git. This is a repository-hardening change only; it does not deploy, modify, or reconfigure the live function.

## Acceptance criteria

- `supabase/functions/public-support/index.ts` matches the active Supabase v1 source observed during reconciliation.
- No secrets or private data values are committed; runtime credentials remain environment lookups only.
- No runtime, schema, rating, trust, authorization, or public UX behavior changes.
- Mission Rated QA and Mission Rated Integration QA pass on the exact PR head.
- Merge/deploy remains subject to normal release discipline.
