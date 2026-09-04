# Tasks: track deployed `submit-beta-feedback` source

- [x] Reconcile current GitHub `main`, open PRs, latest release audit, Vercel production/runtime status, Supabase health, and durable agent state.
- [x] Search for overlapping `submit-beta-feedback` branches/PRs; none found.
- [x] Retrieve active Supabase `submit-beta-feedback` v3 source.
- [x] Confirm no credential values are present in the retrieved source.
- [x] Add the active source to `supabase/functions/submit-beta-feedback/index.ts` without runtime changes.
- [x] Record scope, safety boundaries, and rollback expectations in the proposal.
- [ ] Confirm Mission Rated QA passes on the exact PR head.
- [ ] Confirm Mission Rated Integration QA passes on the exact PR head.
- [ ] Leave the work as an open, reviewable PR; do not merge or deploy from this run.
