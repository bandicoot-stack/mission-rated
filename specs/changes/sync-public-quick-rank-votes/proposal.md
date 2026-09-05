# Proposal: Sync public-quick-rank-votes Edge Function source

## Why

The active Supabase `public-quick-rank-votes` Edge Function is deployed but not represented in the repository. That weakens reviewability, incident response, and release traceability because production behavior cannot be compared directly with Git.

## Scope

Track the currently active `public-quick-rank-votes` v2 source at `supabase/functions/public-quick-rank-votes/index.ts` without deploying or changing runtime behavior.

## Acceptance criteria

- Repository source matches the active Supabase v2 source retrieved during reconciliation.
- No credential values or secrets are introduced; environment-variable lookups may remain exactly as deployed.
- No Supabase deployment, schema change, authorization change, ratings/trust policy change, consent change, analytics change, partner-state change, or public UX change occurs.
- Existing public aggregate vote response semantics remain unchanged.
- Mission Rated QA and Mission Rated Integration QA pass on the exact PR head before merge.

## Risk and rollback

Risk is low because this is repository-only synchronization of already-active code. Rollback is a normal Git revert. No production rollback is required because this change does not deploy the function.
