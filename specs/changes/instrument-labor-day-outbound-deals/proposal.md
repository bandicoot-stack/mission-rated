# Proposal: Instrument Labor Day outbound deal intent

## Problem
The 50 Labor Day offer cards use `Verify ↗` links that currently do not opt into Mission Rated's supported `deal_outbound_click` analytics contract. This leaves a high-value seasonal deal surface without outbound-intent measurement even though equivalent homepage deal CTAs are instrumented.

## Proposed change
Decorate only the Labor Day source links with the existing `data-deal-action="get-deal"` contract after the seasonal deal section renders, and identify their analytics provenance as `data-deal-source="seasonal-source-link"`.

`seasonal-source-link` is intentionally narrower than `verified-source`: it describes the interaction surface only and does not assert that Mission Rated independently verified the merchant, offer, redemption, or realized savings.

## Acceptance criteria
- Every `#mrLocalLaborDeals .mrDealVerify` link is marked as a supported get-deal outbound action.
- The existing analytics listener records `deal_outbound_click` with `deal_source=seasonal-source-link` when those links are clicked.
- Seasonal instrumentation must not emit `deal_source=verified-source` without independent verification evidence.
- No claim, redemption, realized savings, exclusivity, partnership, verification, rating, consent, or attribution evidence is fabricated.
- No external merchant URL receives a Mission Rated referral token or visitor identifier.
- Existing offer copy, ordering, source URLs, and UI remain unchanged.
- Mission Rated QA and Integration QA pass on the exact branch head before merge.

## Risk / rollback
Low and reversible. The change only adds bounded analytics data attributes to an existing outbound CTA and explicitly avoids overstating verification provenance. Rollback is a normal Git revert.
