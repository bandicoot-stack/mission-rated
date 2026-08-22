# Design: Weekend Brief Consent Safety

## Current behavior

The public signup path accepts a valid email and upserts subscriber state. The known unsafe case is an existing explicitly unsubscribed/inactive row being written back to active state during a normal public signup request.

## Proposed behavior

Treat subscriber status as a state machine rather than an unconditional upsert:

- No existing row + valid signup → create active subscriber and record initial consent time.
- Existing active row + valid signup → return idempotent active success without rewriting historical consent unnecessarily.
- Existing unsubscribed/inactive row + normal public signup → do not reactivate. Return a distinct response indicating explicit re-subscribe confirmation is required.
- Explicit verified re-subscribe action → may transition back to active and record a new re-subscribe/consent event while preserving prior unsubscribe history.

The final re-subscribe confirmation mechanism remains a product decision and must be resolved before implementation.

## Components affected

- Frontend: Weekend Brief signup success/error/state handling.
- API / Edge Function: `weekend-brief-signup` subscriber state transition logic.
- Database / storage: subscriber status and consent/unsubscribe history fields; schema changes only if needed to preserve state history cleanly.
- External services: confirmation email provider only if double opt-in is selected.
- CI/CD / deployment: existing QA and integration QA plus targeted tests.

## Data and consent semantics

- `active` is not a default overwrite for every request.
- Explicit unsubscribe/inactive state is sticky until deliberate re-subscribe confirmation.
- Original consent timestamps must not be rewritten to imply new first consent.
- If re-subscription occurs, record it separately from the historical unsubscribe event.
- Duplicate active signup must be idempotent.

## Security considerations

Preserve origin allowlisting, honeypot checks, email validation, no-store responses, and server-only handling of service-role credentials. A public request must not be sufficient to reverse an explicit opt-out state.

## Migration / rollback

Prefer a logic-only change if the existing schema can preserve the required history. If schema changes are required, make them additive and backward-compatible before switching the Edge Function behavior. Rollback must not reactivate opted-out users.

## Verification plan

Automated tests must cover:

1. new valid signup;
2. duplicate active signup;
3. unsubscribed/inactive signup attempt;
4. invalid email;
5. disallowed origin;
6. honeypot request;
7. frontend success state only after backend-confirmed active subscription.

Production verification must use clearly identified test records and must not alter real subscriber consent state.