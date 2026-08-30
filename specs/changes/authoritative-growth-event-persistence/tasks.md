# Tasks: Authoritative Growth Event Persistence

- [x] Reconcile current main, open PRs, release audit, Vercel production, Supabase health, and durable state.
- [x] Confirm no overlapping open Growth persistence PR/branch exists.
- [x] Confirm `product_events` schema accepts the active Growth event names.
- [x] Implement and PR the server-side persistence path.
- [x] Add Growth QA regression coverage for durable persistence and savings separation.
- [x] PR #148 passed Mission Rated QA, Integration QA, and READY preview.
- [x] Production verification exposed a runtime blocker: `/api/event` returned 503 and Supabase received no new rows.
- [x] Stage rollback to the previously audited log-only ingestion behavior rather than weaken auth/RLS or expose a credential.
- [ ] Configure a usable server-only Supabase credential for the Vercel runtime through an approved secret-management path.
- [ ] Re-enable durable persistence only after exact-head preview and controlled store verification succeed.
- [ ] Verify production release audit and independent Supabase freshness before considering #141 resolved.
- [ ] Reconcile durable state after production verification.
