# Tasks

- [x] Reconcile current main, open PRs, release audit, Vercel production, Supabase health, and durable agent state.
- [x] Search open/historical share work and reuse the existing `growth/share-confirmed-helper` branch rather than create duplicate work.
- [x] Keep `share_action` as intent and add `share_completed` as a separate evidence level.
- [x] Emit completion only after successful native share/copy operations; exclude cancellation/failure paths.
- [x] Keep generated referral URLs out of analytics payloads.
- [x] Add regression coverage to the existing acquisition QA gate.
- [x] Verify Mission Rated QA and Integration QA on exact head `0d464dc3ddf3fb40b4926ce785c4cbdeb6fbee23`.
- [ ] Review through normal release discipline; do not merge/deploy failing checks.
