# Shared DOM Utility — Local Intel Slice

## Problem
Mission Rated repeats the same HTML escaping helper across multiple browser scripts. That duplication increases drift risk and makes small correctness fixes harder to apply consistently.

## Change
Introduce `shared/dom-utils.js` as the canonical browser-side HTML escaping utility, include it in release builds before dependent scripts execute, and migrate `local-intel-embeds.js` as the first bounded consumer.

## Scope
- Repository/build refactor only.
- No data, ratings, trust, authorization, consent, partner, or public-content policy changes.
- No Supabase or Vercel runtime configuration changes.
- Remaining duplicate consumers stay unchanged in this slice and can migrate independently after this pattern is proven green.

## Rollback
A normal Git revert restores the prior local helper and removes the shared build asset.
