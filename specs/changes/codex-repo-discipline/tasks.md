# Tasks

- [x] Reconcile current `main` and open PRs before creating replacement work.
- [x] Inspect the existing stale `fix/codex-repo-discipline` branch and avoid silently overwriting its divergent history.
- [x] Confirm Growth ingestion uses request-scoped `getVercelOidcToken()` on current `main`.
- [x] Extend `AGENTS.md` with read-before-write, verify-before-guessing, minimal-change, test-integrity, planning, finish-check, and concise-communication rules.
- [x] Extend Codex discipline QA to regression-check the new durable guardrails.
- [x] Keep the change scoped to agent discipline/spec/QA with no product runtime behavior change.
- [ ] Run Mission Rated QA and Integration QA on the exact PR head.
- [ ] Merge only if required checks are green.
- [ ] Reconcile post-merge main/release state and update durable state/queue only if operational truth materially changes.
