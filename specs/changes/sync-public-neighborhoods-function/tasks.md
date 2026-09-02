# Tasks — Sync deployed public-neighborhoods function source

- [x] Reconcile GitHub main/open PRs, release audit, Vercel production, Supabase health, and durable agent state.
- [x] Confirm no overlapping branch or PR owns this function-source sync.
- [x] Read the active Supabase `public-neighborhoods` function source and verify it contains environment lookups rather than embedded secret values.
- [ ] Add the exact active v2 `index.ts` source under `supabase/functions/public-neighborhoods/`.
- [ ] Run Mission Rated QA and Mission Rated Integration QA on the exact PR head.
- [ ] Stop at a green reviewable PR; do not merge or deploy from the overnight run.
