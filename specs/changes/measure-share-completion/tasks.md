# Tasks

- [x] Reconcile current main, open PRs, release audit, Vercel production, Supabase health, and durable agent state.
- [x] Search open/historical share work and reuse the existing `growth/share-confirmed-helper` branch rather than create duplicate work.
- [x] Keep `share_action` as intent and add `share_completed` as a separate evidence level.
- [x] Emit completion only after successful native share/copy operations; exclude cancellation/failure paths.
- [x] Keep generated referral URLs out of analytics payloads.
- [x] Add regression coverage to the existing acquisition QA gate.
- [ ] Verify Mission Rated QA and Integration QA on the exact PR head.
- [ ] Review through normal release discipline; do not merge/deploy failing checks.
