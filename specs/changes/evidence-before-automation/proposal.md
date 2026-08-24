# Proposal: Evidence Before Automation

## Intent

Apply the founder-approved AI governance model directly to the active Growth MVP so automated growth work cannot turn weak signals into claims, conversions, savings, exclusivity, or partner commitments.

## Decision rule

Automation authority must never exceed evidence quality.

- **Verified evidence:** automation may act within the approved product/spec boundary.
- **Uncertain evidence:** automation may collect, classify, or surface the signal with provenance/confidence, but may not upgrade it into a verified claim.
- **Missing evidence:** do not infer or publish the claim.
- **Business commitment required:** human/founder approval is required before representing a partnership, exclusive offer, negotiated discount, or contractual commitment.
- **Trust/reputation policy:** founder approval is required for material changes to ratings, Mission Score, verification, sponsorship separation, organic ranking, or review treatment.
- **Spend/contract:** founder approval is required.

## Growth MVP evidence ladder

Growth metrics must preserve distinct states rather than collapsing intent into outcomes:

1. impression/view
2. click/outbound intent
3. claim/redemption intent
4. provider/business-confirmed redemption
5. documented savings

A lower state must never be counted as a higher state.

### Exclusive offers

`Mission Rated Exclusive` may appear only when a business/partner has explicitly confirmed the offer is exclusive to Mission Rated or has supplied terms that unambiguously establish exclusivity. Featured/sponsored placement is separate and cannot imply exclusivity.

### Savings

Documented savings require defensible calculation inputs tied to a confirmed redemption or equivalent authoritative transaction evidence. Generic merchant outbound clicks, deal views, and claim intent contribute $0 to the documented-savings ledger.

### Weekend Brief

Form submission is an attempt. Subscriber conversion is counted only after the authoritative signup provider/server confirms success. Duplicate, failed, or rejected submissions do not count as subscribers.

### Referral/share

A share action records distribution intent. Referral acquisition requires a resulting attributed visit. Referral conversion requires a downstream confirmed conversion. Sender identity must not be exposed in shared URLs.

## Accountability

- Growth Product builds only approved, evidence-preserving behavior.
- Deals/Partnerships may research and prepare opportunities but cannot represent unconfirmed partner commitments as real.
- Distribution may prepare acquisition assets and experiments but cannot fabricate testimonials, savings, popularity, or partner status.
- Growth QA independently verifies evidence boundaries and blocks metrics/releases that overstate outcomes.
- Founder retains authority over business commitments, spend/contracts, trust policy, and material reputation decisions.

## Observability and auditability

Growth events must remain attributable to their event type and source. The system should be able to explain why a metric is counted, what evidence supports it, and which code/spec version produced it. Missing or broken measurement must be reported as unavailable rather than estimated.

## Acceptance criteria

- Growth specs explicitly distinguish intent events from confirmed outcomes.
- No documented-savings metric can be incremented by a view, outbound click, or unconfirmed claim alone.
- Weekend Brief attempts and confirmed subscriptions remain separate.
- Exclusive status requires explicit evidence and is independent of sponsorship.
- Referral share, visit, and conversion remain separate states.
- Agent instructions preserve founder approval for commitments, spend/contracts, and material trust policy.
- QA treats unsupported promotion of an evidence state as a release blocker.
