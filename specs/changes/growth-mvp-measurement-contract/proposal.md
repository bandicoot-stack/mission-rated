# Growth MVP measurement contract

## Why
Mission Rated's growth loop depends on metrics that must remain more trustworthy than the marketing they enable. Browser intent must not silently become a confirmed subscriber, redemption, exclusive relationship, or documented savings claim.

## North star
**Documented dollars saved for military families** — counted only when the underlying offer/pricing evidence and attributable user action support the amount.

## Funnel states
Keep these states distinct in storage, analytics, reporting, and UI:

1. `deal_view` — user saw a deal surface.
2. `deal_outbound` — user followed a merchant/source action.
3. `deal_claim_intent` — user explicitly attempted to claim/redeem where a claim mechanism exists.
4. `redemption_confirmed` — authoritative merchant/provider/server evidence confirms redemption.
5. `savings_documented` — a confirmed attributable redemption has defensible pricing inputs sufficient to calculate dollars saved.

A lower state must never be promoted to a higher state merely for reporting convenience.

## Weekend Brief contract
- Form submission is `weekend_brief_signup_attempt` only.
- `weekend_brief_signup_confirmed` may be emitted only after the authoritative signup provider/server confirms success.
- Growth scorecards use confirmed subscriptions, never raw submit events.
- Duplicate/already-subscribed responses must follow the provider's real semantics and must not fabricate a new subscriber.

## Share/referral contract
- Count `share_action` only after a native share resolves successfully or a copy operation succeeds.
- Referral tokens are pseudonymous and may decorate Mission Rated URLs only.
- Never append visitor IDs, referral tokens, affiliation, email, or other user data to merchant/source URLs.
- A referred session is attributable only when the inbound Mission Rated request contains a valid sanitized referral token/campaign tag.

## Exclusive-offer contract
`Mission Rated Exclusive` requires direct merchant/partner confirmation with provenance and a verification timestamp. Sponsorship, featured placement, outreach status, or a strong existing military discount does not establish exclusivity.

## Savings contract
A dollar value may enter the community savings ledger only when all are true:
- the offer terms are current and source-backed;
- a normal/reference price or other defensible calculation input exists;
- the qualifying user action is attributable;
- the event meets the product's confirmed-redemption standard;
- the calculation is reproducible from retained non-sensitive inputs.

Generic merchant homepage clicks, source clicks, page views, free public events, estimated basket sizes, and unconfirmed claims contribute **$0** to documented savings.

## Growth scorecard
Primary metrics:
- qualified Hampton Roads users
- returning users
- confirmed Weekend Brief subscribers
- verified active offers
- directly confirmed Mission Rated Exclusives
- participating businesses
- confirmed redemptions
- documented dollars saved
- successful shares
- attributable referred sessions

Measurement-health indicators must appear alongside growth metrics:
- production release health
- analytics ingestion health
- subscriber-confirmation health
- referral-attribution health
- savings-ledger integrity
- deal freshness/provenance health

A degraded health indicator must prevent the affected metric from being presented as authoritative.

## Governance / safe failure
- Evidence before automation: unknown or unsupported states remain unknown/unavailable.
- Paid status never affects ratings, Mission Score, verification, review treatment, or organic rank.
- High-impact trust/policy changes and exclusive-deal confirmation retain human approval.
- Failed deployment is not live behavior; production verification remains required.
- Missing measurement evidence fails closed rather than being estimated.

## Acceptance criteria
- Product and QA can map every Growth MVP event to one of the funnel states above.
- Confirmed subscribers cannot be derived from form submits alone.
- Merchant/source clicks cannot create documented savings.
- Exclusive labels cannot be derived from sponsorship/featured status.
- Referral data cannot leak onto external URLs.
- Scorecards distinguish measurement health from growth performance.
- Any future savings total can be audited back to defensible calculation inputs and qualifying attributable actions.