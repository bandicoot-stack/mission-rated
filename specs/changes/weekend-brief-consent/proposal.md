# Change Proposal: Weekend Brief Consent Safety

## Problem / opportunity

The public Weekend Brief signup endpoint can currently reactivate an explicitly unsubscribed/inactive subscriber because signup upsert behavior writes the subscriber back to active status. That makes the visible unsubscribe promise weaker than the backend semantics.

Related: GitHub issue #28.

## Desired outcome

Public signup remains simple for new and already-active subscribers while preserving explicit unsubscribe state. Re-subscription becomes a deliberate, separately defined action rather than an accidental side effect of another public signup POST.

## In scope

- Prevent silent reactivation of unsubscribed/inactive rows.
- Preserve historical consent/unsubscribe timestamps appropriately.
- Keep active duplicate submissions idempotent.
- Define backend response semantics that allow the homepage to distinguish accepted active signup from a re-subscribe-required state.
- Add automated coverage for the affected state transitions and existing abuse controls.

## Out of scope

- Designing or launching a full newsletter campaign system.
- Sending marketing email to unsubscribed addresses.
- Modifying production subscriber data except isolated test records used for verification.

## User stories

- As a new subscriber, I want to sign up once and get a clear success state.
- As an active subscriber, I want duplicate signup attempts to be harmless.
- As someone who unsubscribed, I want that choice preserved unless I deliberately confirm re-subscription.

## Acceptance criteria

- [ ] A public signup POST does not silently reactivate a row explicitly marked unsubscribed/inactive.
- [ ] Historical consent and unsubscribe timestamps are not overwritten as though a new first-time consent occurred.
- [ ] Already-active duplicate submissions remain idempotent.
- [ ] Re-subscription requires an explicit confirmation mechanism or separately verified action.
- [ ] Existing honeypot, allowed-origin checks, email validation, no-store behavior, and server-only service-role secret handling remain intact.
- [ ] Automated tests cover new signup, active duplicate, unsubscribed attempt, invalid email, disallowed origin, and honeypot behavior.
- [ ] The homepage reports “You’re in” only when the backend has accepted a valid active subscription.

## Constitutional checks

- [x] Trust implications reviewed: unsubscribe promises must match backend behavior.
- [x] Provenance implications: not applicable.
- [x] Mobile/accessibility: success/error/re-subscribe states must remain understandable on mobile and assistive technology.
- [x] SEO/AI discovery: not materially affected.
- [x] Privacy/consent: primary reason for this change.
- [x] Security: public endpoint abuse controls must be preserved.
- [x] QA/production verification defined in tasks/design.

## Open questions

- Choose the explicit re-subscribe mechanism before implementation: confirmation email/double opt-in, a distinct verified re-subscribe endpoint, or another deliberate confirmation pattern.

## References

- GitHub issue #28
- `specs/current/weekend-brief.md`
- `MISSION_RATED_CONSTITUTION.md`