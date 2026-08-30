# Tasks: Authoritative Growth Event Persistence

- [x] Reconcile current main, open PRs, release audit, Vercel production, Supabase health, and durable state.
- [x] Confirm no overlapping open Growth persistence PR/branch exists.
- [x] Confirm `product_events` schema accepts the active Growth event names.
- [ ] Update `api/event.js` to persist sanitized accepted events to Supabase with server-only credentials.
- [ ] Add Growth QA regression coverage for durable persistence and savings separation.
- [ ] Run/obtain green Mission Rated QA and Integration QA.
- [ ] Verify READY preview on the exact PR head.
- [ ] Merge only if checks are green.
- [ ] Verify production release audit and independent Supabase freshness before considering #141 resolved.
- [ ] Reconcile durable state after production verification.
