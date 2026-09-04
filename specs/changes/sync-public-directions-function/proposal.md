# Sync public-directions Edge Function source

## Why
The active Supabase `public-directions` function is not represented in Git, leaving deployed behavior outside normal review and audit workflows.

## Change
Track the currently deployed v1 source verbatim at `supabase/functions/public-directions/index.ts`.

## Scope
Repository-only source synchronization. No Supabase deployment, schema mutation, authorization change, ratings/trust change, consent change, analytics change, or user-facing behavior change.

## Safety
The deployed source references environment-provided Supabase credentials and contains no credential values. Rollback is a normal Git revert.
