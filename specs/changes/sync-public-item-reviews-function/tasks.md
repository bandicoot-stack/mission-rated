# Tasks: Track public-item-reviews Edge Function Source

- [x] Reconcile current GitHub main, open PRs, release audit, Vercel production/runtime health, Supabase health, and durable agent state.
- [x] Confirm no overlapping `public-item-reviews` branch or PR exists.
- [x] Retrieve active Supabase `public-item-reviews` v3 source and inspect it for embedded credential values.
- [x] Add the active source to `supabase/functions/public-item-reviews/index.ts` without runtime changes.
- [ ] Run Mission Rated QA and Mission Rated Integration QA on the exact PR head.
- [ ] Stop at a green, reviewable PR; do not merge or deploy from overnight engineering.
