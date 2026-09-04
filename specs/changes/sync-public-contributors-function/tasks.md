# Tasks — Sync public-contributors Edge Function Source

- [x] Reconcile current GitHub `main`, open PRs, release-audit, Vercel production/runtime health, Supabase health, and durable agent state.
- [x] Search for overlapping PRs/branches for `public-contributors` source synchronization.
- [x] Retrieve the active Supabase `public-contributors` v1 source and verify it contains environment-variable credential lookups rather than credential values.
- [x] Add the deployed source under `supabase/functions/public-contributors/index.ts` without runtime edits.
- [ ] Run/observe Mission Rated QA on the exact PR head.
- [ ] Run/observe Mission Rated Integration QA on the exact PR head.
- [ ] Stop at a green, reviewable PR; do not merge or deploy from this overnight run.