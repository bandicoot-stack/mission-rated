# Tasks: Sync quick-rank-vote Edge Function Source

- [x] Reconcile current GitHub `main`, open PRs/branches, release audit, Vercel production, Supabase health, and durable agent state.
- [x] Confirm no existing PR/branch owns `quick-rank-vote` source synchronization.
- [x] Read active Supabase `quick-rank-vote` v3 source and confirm it contains environment-variable credential lookups rather than credential values.
- [x] Add the active source verbatim under `supabase/functions/quick-rank-vote/index.ts`.
- [x] Document scope, safety, rollback, and release discipline.
- [ ] Confirm Mission Rated QA succeeds on the exact PR head.
- [ ] Confirm Mission Rated Integration QA succeeds on the exact PR head.
- [ ] Leave the PR open for normal review; do not merge or deploy from the overnight run.