# Sync `submit-contribution` Edge Function Source

## Summary
Track the currently deployed Supabase `submit-contribution` v3 source in Git so production contribution-intake behavior is reviewable, diffable, and recoverable from repository history.

## Scope
- Add the active `submit-contribution` source verbatim under `supabase/functions/submit-contribution/index.ts`.
- Do not deploy or reconfigure the function.
- Do not change schema, authorization, rate limiting, trust/rating policy, contribution semantics, analytics, consent, partner state, or public UX.

## Current production truth
- Supabase project is `ACTIVE_HEALTHY`.
- Active function version: `3`.
- Active source hash: `2e75b8e73fe8b6932c34ca314d1b555ff311ad6d8a908016f0d80780434cc0b6`.
- `verify_jwt` remains `false`; this change does not alter runtime authentication or deployment configuration.
- The source references environment-provided Supabase credential material and contains no credential values.

## Risk and rollback
Low. This is repository-only source synchronization of already-deployed behavior. Rollback is a normal Git revert. No production mutation is requested by this change.
