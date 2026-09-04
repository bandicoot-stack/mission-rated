# Sync public-support-resources Edge Function source

## Why

The deployed `public-support-resources` Supabase Edge Function is active in production but its source is not represented on `main`. That leaves deployed behavior harder to review, audit, and reproduce from the repository.

## Change

Track the active version 1 source at `supabase/functions/public-support-resources/index.ts` exactly as deployed.

This is repository synchronization only. It does not deploy or reconfigure the function, change schema, alter authorization, modify ratings/trust behavior, or change public UX.

## Safety

The deployed source uses environment lookups for Supabase credentials and contains no credential values. Rollback is a normal Git revert.

## Acceptance

- Tracked source matches active Supabase version 1.
- No secret values are introduced.
- Existing Mission Rated QA and Integration QA remain green.
- No Supabase or Vercel production mutation occurs as part of this change.
