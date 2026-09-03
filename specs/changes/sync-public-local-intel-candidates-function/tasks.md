# Tasks — Sync public-local-intel-candidates Edge Function Source

- [x] Reconcile current GitHub `main`, open PRs, release-audit evidence, Vercel production state, Supabase project health, and durable agent state.
- [x] Confirm no open PR or branch already owns `public-local-intel-candidates` source synchronization.
- [x] Retrieve the active Supabase `public-local-intel-candidates` v3 source from the native project.
- [x] Review the source for embedded credential values before tracking it publicly.
- [ ] Add the source under `supabase/functions/public-local-intel-candidates/index.ts` without runtime edits.
- [ ] Run Mission Rated QA and Mission Rated Integration QA on the exact PR head.
- [ ] Stop at a green, reviewable PR; do not merge or deploy from this overnight slice.