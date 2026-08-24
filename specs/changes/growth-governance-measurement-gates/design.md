# Design: Growth Governance Measurement Gates

## Approach
Use an evidence ladder rather than a single overloaded conversion event. Existing analytics/storage may continue to capture low-risk intent events, but authoritative KPI queries and public counters must consume only the appropriate confirmed evidence level.

## Canonical semantics
| Metric | Minimum evidence | Invalid substitutes |
|---|---|---|
| Subscriber | authoritative subscribe success | submit/click/attempt |
| Share actions | successful invocation/copy action | page view |
| Referred session | inbound referral token/parameter observed and accepted | share action |
| Referral conversion | referred session + confirmed target outcome | referred session alone |
| Claim intent | explicit claim action | deal view/outbound click |
| Redemption | evidence-backed redemption confirmation | claim intent/outbound click |
| Documented savings | redemption + verified fixed savings or defensible price delta | estimated basket, outbound click, claim intent |
| Exclusive offer | explicit partner confirmation + provenance | featured/sponsored status |

## Measurement health
Each authoritative KPI should resolve to one of:
- `healthy`: required evidence path is operating and reconciled;
- `degraded`: some evidence is missing/delayed; do not extrapolate;
- `unavailable`: authoritative path is not implemented or broken.

Public counters must render only healthy, authoritative values. Internal scorecards may show degraded/unavailable with an explanation.

## Privacy/security
Referral identifiers must be non-secret, minimal, and must not encode private user data. Analytics endpoints must accept only allowlisted fields, preserve same-origin/write protections, and avoid logging secrets or sensitive profile data.

## Failure behavior
- Client analytics failure must not block the user journey.
- Reporting fails closed: missing confirmation never promotes an event to a higher evidence level.
- Deployment success alone does not mark measurement healthy; production QA must verify the event path.

## Rollback
This change is additive governance/specification. Implementations should preserve existing user-facing flows while tightening reporting semantics. If a new authoritative metric path fails, disable that metric/counter rather than falling back to proxy math.
