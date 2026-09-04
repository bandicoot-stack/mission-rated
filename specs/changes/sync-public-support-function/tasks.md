# Tasks — Sync deployed public-support function source

- [x] Reconcile current GitHub main, open PRs, production release audit, Vercel deployment state, Supabase health, and durable agent state.
- [x] Confirm no open PR already owns `public-support` source synchronization.
- [x] Read the active Supabase `public-support` v1 source and verify it contains environment-variable credential lookups rather than embedded credential values.
- [x] Add the exact deployed source under `supabase/functions/public-support/index.ts`.
- [ ] Confirm Mission Rated QA passes on the exact PR head.
- [ ] Confirm Mission Rated Integration QA passes on the exact PR head.
- [ ] Review through normal release discipline; do not merge or deploy solely from this overnight run.
