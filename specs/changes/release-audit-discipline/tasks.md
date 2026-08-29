# Tasks

- [ ] Create dedicated `release-audit` branch with durable audit instructions.
- [ ] Update production verification workflow to write a SHA-specific report only after all production checks pass.
- [ ] Make audit report creation idempotent for repeated verification of the same SHA.
- [ ] Update `AGENTS.md` boot/reconciliation rules to require release-audit review for release-sensitive work.
- [ ] Run Mission Rated QA and Integration QA.
- [ ] Merge only after checks pass.
- [ ] Verify the workflow writes the first production audit report after the merged release reaches production.
