# Tasks — Sync gas-prices Edge Function Source

- [x] Reconcile current GitHub `main`, open PRs, release-audit evidence, Vercel production state, Supabase project health, and durable agent state.
- [x] Confirm no open PR or branch already owns `gas-prices` source synchronization.
- [x] Retrieve the active Supabase `gas-prices` v3 source from the native project.
- [x] Review the source for embedded credential values before tracking it publicly.
- [x] Add the source under `supabase/functions/gas-prices/index.ts` without runtime edits.
- [ ] Run Mission Rated QA and Mission Rated Integration QA on the exact PR head.
- [ ] Stop at a green, reviewable PR; do not merge or deploy from this overnight slice.
