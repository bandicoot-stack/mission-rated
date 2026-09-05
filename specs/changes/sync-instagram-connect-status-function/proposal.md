# Proposal: Track Instagram Connect Status Edge Function Source

## Summary

Track the currently deployed Supabase `instagram-connect-status` v1 source in Git so the production Instagram connection-status contract is reviewable and recoverable from the repository.

## Motivation

The active Edge Function exists in Supabase but is not represented on `main`. Keeping deployed function source outside Git weakens change review, incident recovery, and production-to-repository traceability.

## Scope

- Add the active `instagram-connect-status` v1 `index.ts` source verbatim under `supabase/functions/instagram-connect-status/`.
- Do not deploy or reconfigure the function.
- Do not change Instagram OAuth behavior, authorization, consent, analytics, ratings/trust policy, partner state, schema, or public UX.

## Safety

The source contains environment-variable lookups for Meta/Supabase configuration and no credential values. This change is repository-only and reversible by Git revert.

## Acceptance Criteria

- Repository source matches the active Supabase v1 function source.
- No secrets or credential values are introduced.
- Mission Rated QA and Integration QA pass on the exact PR head.
- No production deployment or Supabase mutation occurs as part of this change.
