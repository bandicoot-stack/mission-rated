# Tasks: Fall Deals & Finds

## Preparation

- [x] Read the Mission Rated constitution and core platform spec.
- [x] Confirm the active seasonal homepage slot is Fall Deals & Finds.
- [x] Reconcile GitHub main, open PRs, and Vercel production before material work.
- [x] Confirm the stale Labor Day surface is still present in the release build/discovery configuration.

## Implementation

- [x] Keep the `fall.html` seasonal landing page and Fall Deals & Finds homepage route.
- [x] Stop copying Labor Day page and Labor Day-only scripts into the release build.
- [x] Remove Labor Day runtime injections from the homepage release build.
- [x] Rotate sitemap and generated discovery metadata to Fall Deals & Finds.
- [x] Add QA coverage that fails if Labor Day assets or sitemap discovery return.
- [x] Update the current core-platform contract for the active fall seasonal experience.
- [x] Refresh the Fall Deals & Finds surface on September 9 with verified Hampton Roads anchors: Naval Station Norfolk Fleet Fest and Military Aviation Museum Living History Event.
- [x] Replace generic Hunt Club military-offer language with the official coupon/valid-ID terms and avoid unsupported discount amounts.
- [x] Raise the curated Fall Deals & Finds inventory from 30 to 32 and update fall QA to guard the refreshed date, sources, anchors, and card count.

## Verification

- [ ] Run Mission Rated QA.
- [ ] Run Mission Rated Integration QA.
- [ ] Verify mobile behavior and keyboard focus states through the established release QA path.
- [x] Verify Fall source links and freshness language for the September 9 refresh.
- [ ] Verify `/fall` in production.
- [ ] Verify `/labor-day` and `/labor-day.html` are not publicly served after deployment.
- [ ] Verify production exact-SHA convergence and release audit evidence.

## Closeout

- [x] Update `specs/current/core-platform.md` to reflect Fall Deals & Finds as the active seasonal experience.
- [ ] Merge only after required checks pass.
- [ ] Verify production after deployment.
