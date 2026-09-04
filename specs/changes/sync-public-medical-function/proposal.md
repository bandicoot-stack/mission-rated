# Proposal — Sync public-medical Edge Function Source

## Problem
The deployed Supabase `public-medical` Edge Function is active in production but its source is not tracked under `supabase/functions/` in Git. That makes the live behavior harder to review, audit, reproduce, and maintain.

## Proposed change
Track the currently deployed `public-medical` v2 source verbatim in the repository.

This is a source-control synchronization only. It must not deploy or reconfigure the function, alter database schema, change ratings or trust policy, change authorization, or change public UX.

## Acceptance criteria
- `supabase/functions/public-medical/index.ts` matches the active Supabase v2 source retrieved from the native Supabase project.
- No credential values or secrets are introduced; the function continues to reference environment-provided Supabase credentials.
- No Supabase deployment or schema mutation occurs as part of this change.
- Mission Rated QA and Mission Rated Integration QA pass on the exact PR head before merge.

## Risk / rollback
Low. This adds repository visibility for already-deployed code. Rollback is a normal Git revert and does not change the live Supabase function.