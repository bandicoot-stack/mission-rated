# Proposal: track deployed `submit-beta-feedback` source

## Why

The active Supabase `submit-beta-feedback` Edge Function is part of Mission Rated's production feedback intake path, but its deployed implementation is not currently represented in Git. That makes production behavior harder to audit, review, and recover.

## Change

Copy the currently active Supabase v3 `submit-beta-feedback` source into `supabase/functions/submit-beta-feedback/index.ts` without changing runtime behavior.

## Scope

- Repository source synchronization only.
- No Supabase deployment or schema mutation.
- No authorization, consent, ratings/trust, analytics, partner-state, or public UX change.
- No credential values are committed; the function continues to reference environment-provided Supabase credential material.

## Verification

- Confirm the tracked source matches the active Supabase function source retrieved during this run.
- Run the repository's required Mission Rated QA and Mission Rated Integration QA through the existing pull-request workflow.
- Stop at a green, reviewable PR; do not merge or deploy from the overnight run.

## Risk / rollback

Low. This adds source-control visibility for already deployed behavior. Rollback is a normal Git revert and has no production runtime effect unless a later release explicitly deploys it.
