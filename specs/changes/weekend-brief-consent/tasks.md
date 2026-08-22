# Tasks: Weekend Brief Consent Safety

## Preparation

- [x] Read constitution and current Weekend Brief spec.
- [x] Document unsafe state transition and acceptance criteria.
- [x] Add design for consent-state semantics.
- [ ] Resolve the explicit re-subscribe mechanism product decision.

## Implementation

- [ ] Update backend signup logic to preserve unsubscribed/inactive state on ordinary public signup.
- [ ] Keep already-active duplicate signup idempotent.
- [ ] Preserve historical consent/unsubscribe timestamps.
- [ ] Return a distinct backend state when explicit re-subscribe is required.
- [ ] Update homepage handling so success is shown only for an accepted active subscription.
- [ ] Add automated tests for all acceptance cases.

## Verification

- [ ] Run Mission Rated QA.
- [ ] Run Mission Rated Integration QA.
- [ ] Verify mobile signup states.
- [ ] Verify accessible success/error/re-subscribe messaging.
- [ ] Verify origin, honeypot, validation, no-store, and secret-handling behavior.
- [ ] Verify with isolated production test records only after deployment.

## Closeout

- [ ] Update `specs/current/weekend-brief.md` to remove the known-gap language and describe shipped re-subscribe semantics.
- [ ] Link implementation PR and production verification evidence.
- [ ] Close GitHub issue #28 only after production behavior is verified.