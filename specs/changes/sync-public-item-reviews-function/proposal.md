# Proposal: Track public-item-reviews Edge Function Source

## Intent
Bring the currently deployed Supabase `public-item-reviews` function under repository review so production behavior is reproducible and auditable from Git.

## Scope
- Add the active `public-item-reviews` v3 source verbatim under `supabase/functions/public-item-reviews/index.ts`.
- Record the synchronization and verification steps in this change spec.

## Non-goals
- No Supabase deployment or reconfiguration.
- No schema or migration changes.
- No ratings, trust, verification, authorization, consent, analytics, partner-state, or public UX changes.
- No changes to which review fields are published; current production behavior remains authoritative.

## Safety
The deployed source uses environment-provided Supabase credential material and contains no credential values. This repository-only sync is reversible with a normal Git revert.
