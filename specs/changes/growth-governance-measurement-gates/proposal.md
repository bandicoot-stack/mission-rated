# Proposal: Growth Governance Measurement Gates

## Problem
Mission Rated's Growth MVP depends on subscriber, referral, claim, exclusivity, and documented-savings metrics. Browser intent events or incomplete attribution can be mistaken for authoritative outcomes, creating false growth and trust claims.

## Founder intent
Adopt practical AI/agent governance that prevents costly failures without adding bureaucracy. For Growth MVP measurement, evidence must precede automation and public claims.

## Requirements
1. Separate intent/attempt events from confirmed outcomes.
2. A Weekend Brief form submission is not a confirmed subscriber until the authoritative subscription workflow succeeds.
3. A merchant outbound click is not a redemption and contributes $0 to documented savings.
4. A share event is not a referred session; a referred session is not a conversion.
5. Exclusive status requires explicit partner confirmation and provenance.
6. Documented savings require a confirmed redemption/outcome plus defensible pricing or fixed-savings inputs.
7. Growth scorecards must expose measurement-health state and must not silently substitute lower-confidence proxy events.
8. Analytics failures fail closed for reporting: unavailable/incomplete metrics are labeled unavailable/incomplete rather than estimated.
9. Sponsorship/payment remains separate from ratings, Mission Score, verification, exclusivity evidence, and organic rank.
10. Growth Product may implement bounded reversible changes; Growth QA independently validates measurement semantics before production truth.

## Evidence ladder
- Observed intent: view, click, form attempt, share action.
- Confirmed system outcome: successful subscription, accepted claim, attributed referred session.
- Confirmed partner/user outcome: redemption or other evidence-backed completion.
- Documented savings: confirmed outcome plus defensible savings inputs.

Higher levels may not be inferred solely from lower levels.

## Acceptance criteria
- Growth event names and reporting semantics distinguish attempts/intents from confirmed outcomes.
- The savings ledger cannot increment from generic outbound clicks, page views, or unconfirmed claims.
- The subscriber KPI cannot increment solely from client-side form submission.
- Referral KPIs distinguish share actions, referred sessions, and downstream conversions.
- Exclusive offers retain confirmation provenance.
- Growth scorecard surfaces measurement-health status for subscriber, referral, claim/redemption, and savings metrics.
- QA includes negative tests proving proxy events do not become confirmed outcomes.
