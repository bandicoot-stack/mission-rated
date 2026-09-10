# Tasks

- [x] Reconcile current `main`, open PRs, release audit, Vercel production/runtime health, Supabase health/advisories, and durable agent state.
- [x] Confirm no overlapping open PR owns the Node 24 runtime upgrade.
- [x] Capture current Vercel build evidence showing Node 20 deprecation and the 2026-10-01 failure boundary.
- [x] Align `package.json` and `.nvmrc` to Node 24.
- [x] Update the existing Vercel runtime QA guard to enforce Node 24 alignment.
- [ ] Run fresh Mission Rated QA and Integration QA on the exact PR head.
- [ ] Obtain preview/build evidence on the exact PR head if the release path creates it.
- [ ] Merge/deploy only through the established release path after independent QA is green.
