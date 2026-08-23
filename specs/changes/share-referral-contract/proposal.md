# Proposal: Trustworthy Share + Referral Contract

## Problem

Mission Rated's Growth MVP needs deal sharing and referral attribution, but growth metrics are only useful if a share action, referred visit, claim, redemption, and documented savings remain distinct. A copied or shared URL must never be treated as a redemption or savings event.

## Scope

Define the minimum product contract for share/referral instrumentation before runtime implementation.

### Required funnel states

1. `deal_view` — a user viewed a deal surface.
2. `share_action` — a user invoked copy/native share for a deal.
3. `referral_visit` — a new session arrived through a Mission Rated referral token/parameter.
4. `deal_outbound` — a user followed a merchant/source action.
5. `deal_claim` — only when Mission Rated has an explicit claim interaction with defined semantics.
6. `confirmed_redemption` — only when a defensible redemption signal exists.
7. `documented_savings` — only when the redemption and savings inputs are defensible.

No earlier state may be silently promoted into a later state.

## Attribution contract

- Referral URLs use a first-party Mission Rated URL and a non-sensitive referral/campaign value.
- Do not place email addresses, names, auth identifiers, or other private user data in referral URLs or analytics payloads.
- A referred visit may attribute source/campaign context, but does not prove the recipient is a new user, subscriber, claimant, or purchaser.
- Duplicate visits and repeated shares must not be represented as unique people unless an authoritative unique-user method exists.

## Trust contract

- `share_action`, `referral_visit`, and `deal_outbound` contribute $0 to the savings ledger.
- `deal_claim` contributes $0 unless the approved claim semantics explicitly include a defensible redeemed value.
- Only `documented_savings` may increment the public dollars-saved total.
- Exclusive, verified, and sponsored states remain independent of sharing and attribution.

## User experience

- Deal surfaces may offer `Share` / `Send to spouse or friend` using native share where supported and copy-link fallback elsewhere.
- Sharing must work without requiring account creation.
- The shared destination must preserve the canonical deal experience and not create a misleading endorsement or exclusivity claim.
- Controls must be keyboard accessible, mobile usable, and have clear success/failure feedback.

## Acceptance criteria

- A shared deal URL can be attributed to a referral source without exposing private user data.
- Share and referral events are distinguishable from outbound, claim, redemption, and savings events.
- Share/referral/outbound activity cannot increment documented savings.
- Unsupported or malformed referral values are ignored or sanitized rather than trusted.
- Existing deal discovery remains usable when referral parameters are absent or stripped.
- Mobile native share and copy-link fallback semantics are specified for implementation.
- QA can reconcile the public savings counter exclusively to authoritative documented-savings records.

## Out of scope

- Referral rewards or incentives.
- Paid acquisition.
- Identity verification.
- Cross-device identity stitching.
- Inferring completed purchases from merchant homepage clicks.
