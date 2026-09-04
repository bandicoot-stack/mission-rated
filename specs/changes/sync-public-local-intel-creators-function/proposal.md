# Sync Public Local Intel Creators Function Source

## Problem
The active Supabase `public-local-intel-creators` Edge Function is not tracked in the Mission Rated repository. That leaves deployed production behavior outside normal review, audit, and rollback visibility.

## Change
Track the exact active v1 source under `supabase/functions/public-local-intel-creators/index.ts`.

## Scope
- Source-control synchronization only.
- No Supabase deployment or reconfiguration.
- No schema, authorization, ratings/trust, consent, analytics, partner, or public UX change.
- No credential values are added; the function references environment-provided Supabase credentials.

## Verification
- Confirm source matches active Supabase v1 hash `177e9779a4e7687a75840c248f7a9b9997a82468dc464bf88a81783019e8f9ad`.
- Run Mission Rated QA and Integration QA on the exact PR head.

## Rollback
A normal Git revert removes the repository copy without affecting the already-deployed Supabase function.