# Tasks: Growth Governance Measurement Gates

- [ ] Inventory current Growth MVP event names, server allowlists, subscriber success handling, referral parameters, claim/redemption states, and savings inputs.
- [ ] Define canonical event/state names that preserve attempt vs confirmed-outcome semantics.
- [ ] Update Weekend Brief instrumentation so confirmed subscriber KPI is emitted/derived only after authoritative success.
- [ ] Update analytics endpoint allowlist and sanitized metadata for share/referral/deal events.
- [ ] Separate share action, referred session, and referral conversion reporting.
- [ ] Ensure generic merchant outbound clicks cannot increment redemption or documented savings.
- [ ] Require explicit exclusivity confirmation provenance independent of featured/sponsored status.
- [ ] Add measurement-health status for subscriber, referral, redemption, and savings KPIs.
- [ ] Add negative tests for invalid promotion of proxy events to confirmed outcomes.
- [ ] Run Mission Rated QA and Integration QA.
- [ ] Verify mobile flow and production event behavior after deployment.
- [ ] Update `specs/current/` only after shipped behavior matches this change.
