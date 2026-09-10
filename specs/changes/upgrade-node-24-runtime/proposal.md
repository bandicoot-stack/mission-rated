# Upgrade production Node runtime to 24.x

## Problem

Mission Rated currently pins `engines.node` to `20.x`. The current Vercel production build warns that Node 20 is deprecated and deployments created on or after 2026-10-01 will fail to build. Vercel project settings are already on Node 24, but the repository engine declaration overrides that setting.

## Change

Align the repository runtime contract with the supported Vercel project runtime by pinning production and local development to Node 24.

## Scope

- change `package.json` from Node `20.x` to `24.x`
- change `.nvmrc` from `20` to `24`
- update the existing Vercel runtime QA guard to require Node 24 alignment
- no application logic or user-facing behavior change
- no dependency, Supabase, auth, trust, ratings, analytics, partner, consent, or user-data change

## Expected outcome

Mission Rated production builds remain supported beyond 2026-10-01 and local/runtime selectors stay aligned with Vercel project settings.

## Rollback

Revert this change if Node 24 exposes an application compatibility issue before merge or production release.
