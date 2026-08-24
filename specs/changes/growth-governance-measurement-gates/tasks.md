# Tasks: Growth Governance Measurement Gates

- [x] Inventory current Growth MVP event names, server allowlists, subscriber success handling, referral parameters, claim/redemption states, and savings inputs. Current browser/server contract distinguishes `weekend_brief_signup_attempt` from `weekend_brief_signup_confirmed`; referral URLs use pseudonymous `mr_ref`; server accepts/sanitizes `share_action`, `referral_visit`, `deal_click`, and `claim_action`; no generic outbound event is treated as redemption or documented savings.
- [x] Define canonical event/state names that preserve attempt vs confirmed-outcome semantics for the currently instrumented browser funnel: `deal_click` = outbound/deal intent, `share_action` = completed share/copy action, `referral_visit` = referred landing session, `claim_action` = claim intent, `weekend_brief_signup_attempt` = form attempt, `weekend_brief_signup_confirmed` = authoritative signup success. Redemption and documented-savings events remain intentionally undefined until a defensible confirmation source exists.
- [x] Update Weekend Brief instrumentation so confirmed subscriber KPI is emitted/derived only after authoritative success. `analytics.js` exposes `mrConfirmWeekendBriefSignup()` for the authoritative subscription integration and records form submission separately as an attempt.
- [x] Update analytics endpoint allowlist and sanitized metadata for share/referral/deal events. `/api/event` now accepts the Growth MVP event set, validates UUID-shaped referral/session/visitor identifiers, bounds numeric metadata, and requires same-origin browser requests.
- [ ] Separate share action, referred session, and referral conversion reporting.
- [x] Ensure generic merchant outbound clicks cannot increment redemption or documented savings. The browser/server event contract currently has no redemption or savings event derived from `deal_click` or merchant website clicks.
- [ ] Require explicit exclusivity confirmation provenance independent of featured/sponsored status.
- [ ] Add measurement-health status for subscriber, referral, redemption, and savings KPIs.
- [ ] Add negative tests for invalid promotion of proxy events to confirmed outcomes.
- [ ] Run Mission Rated QA and Integration QA.
- [ ] Verify mobile flow and production event behavior after deployment.
- [ ] Update `specs/current/` only after shipped behavior matches this change.

## Inventory note

The current instrumentation intentionally stops short of defining `redemption_confirmed`, `documented_savings`, or `referral_conversion` events. Those states require an authoritative outcome source and must not be inferred from browser clicks, shares, claims, or referred sessions. This is a deliberate fail-closed measurement boundary, not a missing analytics shortcut.
