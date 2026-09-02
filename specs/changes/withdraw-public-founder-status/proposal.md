# Proposal: Withdraw Public Founder Status Snapshot

## Problem

Current `main` copies `status.html` and `mission-control-metrics.json` into the production build. The repository's operational-exposure QA explicitly forbids `dist/mission-control-metrics.json` until an authenticated server-side authorization boundary exists, and live production currently serves that snapshot publicly. This violates the established founder/internal surface boundary and causes `npm run qa` to fail on a clean current-main-based PR.

## Scope

Stop publishing the read-only founder status page and its metrics snapshot by removing both files from the release copy list. Keep the source files repository-only for future authenticated work. Do not alter the metrics, Supabase function, authentication policy, public product pages, ratings, trust logic, or data.

## Acceptance criteria

- `dist/status.html` is not produced by the release build.
- `dist/mission-control-metrics.json` is not produced by the release build.
- Repository source files may remain for future authenticated implementation.
- `npm run qa` / Mission Rated QA passes, including `qa-operational-exposure.mjs`.
- Mission Rated Integration QA passes on the exact PR head.
- No Supabase deployment or database mutation occurs.

## Risk and rollback

Risk is limited to removal of an internal/noindex status surface from the public deployment. Rollback is restoring the two release-copy entries only after an authenticated server-side boundary is established and specified.