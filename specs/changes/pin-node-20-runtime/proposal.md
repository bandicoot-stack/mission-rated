# Pin production Node runtime to 20.x

## Problem

`package.json` currently declares `engines.node` as `>=20`. Vercel warns during production builds that this range will automatically move to a future Node major version when available, creating avoidable runtime drift without a reviewed repository change.

## Change

Pin the supported runtime family to `20.x` in `package.json`.

## Scope

- no application behavior change
- no dependency change
- no Vercel project-setting mutation
- no Supabase, auth, trust, ratings, analytics, partner, or user-data change
- no production deployment outside the established Git release path

## Expected outcome

Future builds stay on Node 20 until Mission Rated deliberately reviews and changes the repository runtime declaration.

## Rollback

Revert the single `package.json` engine-range change.
