# Proposal: Sync quick-rank-vote Edge Function Source

## Problem
The active Supabase `quick-rank-vote` Edge Function is deployed in production but its source is not tracked in the repository. That leaves production vote-write behavior outside normal code review, release audit, and maintenance workflows.

## Change
Track the currently active `quick-rank-vote` v3 source verbatim at `supabase/functions/quick-rank-vote/index.ts`.

This is source-control synchronization only. It does not deploy or reconfigure the function and does not alter schema, authorization, voting semantics, ratings/trust policy, consent, analytics, partner state, or public UX.

## Safety
- No credential values are added; the source references environment-provided Supabase credentials only.
- Existing validation, voter-key constraints, upsert behavior, and aggregate response semantics are unchanged.
- No Supabase deployment or database mutation is part of this change.
- Rollback is a normal Git revert.

## Acceptance
- Repository source matches the active Supabase v3 function source.
- Mission Rated QA passes on the exact PR head.
- Mission Rated Integration QA passes on the exact PR head.
- PR remains review-only; no merge or deployment from overnight engineering.