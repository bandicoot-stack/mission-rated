# Proposal: Track deployed submit-item-review Edge Function source

## Summary
Add the currently deployed Supabase `submit-item-review` v2 source to repository control so production review-intake behavior is reviewable, auditable, and recoverable from Git.

## Why
The function is active in Supabase but absent from `supabase/functions` on `main`. Keeping deployed runtime source outside the repository weakens release auditability and makes future maintenance dependent on live-platform state.

## Scope
- Add `supabase/functions/submit-item-review/index.ts` matching the active deployed v2 source.
- Add proposal/task documentation for traceability.
- Do not deploy or reconfigure the function.
- Do not change review validation, moderation state, verification status, ratings/trust policy, schema, authorization, consent, analytics, partner state, or UX.

## Safety
The tracked source references environment-provided Supabase credential material and contains no credential values. Existing submissions remain `pending` and `unverified`; this change creates no reviews and changes no review evidence.

## Rollback
Normal Git revert. No production mutation is part of this change.
