# Tasks: Sync public-quick-rank-votes Edge Function source

- [x] Reconcile current GitHub `main`, open PRs/branches, release-audit evidence, Vercel production/runtime health, Supabase project/advisors, and durable agent state.
- [x] Confirm no overlapping open PR or branch already owns `public-quick-rank-votes` source synchronization.
- [x] Retrieve the active Supabase `public-quick-rank-votes` v2 source and verify it contains environment credential lookups rather than credential values.
- [x] Add the active source verbatim under `supabase/functions/public-quick-rank-votes/index.ts`.
- [x] Record bounded scope, acceptance criteria, risk, and rollback.
- [ ] Run Mission Rated QA on the exact PR head.
- [ ] Run Mission Rated Integration QA on the exact PR head.
- [ ] Confirm PR remains non-draft, mergeable, and reviewable after checks complete.
- [ ] Merge/deploy only through established release discipline; do not merge or deploy from this overnight slice.
