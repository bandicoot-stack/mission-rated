# Tasks: Track deployed submit-item-review Edge Function source

- [x] Reconcile current GitHub `main`, open PRs, release-audit state, Vercel production/runtime health, Supabase health, and durable agent state.
- [x] Confirm no existing PR or branch overlaps `submit-item-review` source synchronization.
- [x] Retrieve the active Supabase `submit-item-review` v2 source and confirm no credential values are embedded.
- [x] Add the deployed source under `supabase/functions/submit-item-review/index.ts` without modifying runtime behavior.
- [x] Record scope, safety constraints, and rollback path.
- [ ] Run exact-head Mission Rated QA and Mission Rated Integration QA through the normal PR checks.
- [ ] Do not merge or deploy from this overnight change unless the established release path and independent QA evidence permit it.
