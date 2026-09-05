# Proposal: Instrument Labor Day outbound deal intent

## Problem
The 50 source-backed Labor Day offer cards use `Verify ↗` links that currently do not opt into Mission Rated's supported `deal_outbound_click` analytics contract. This leaves a high-value seasonal deal surface without outbound-intent measurement even though equivalent homepage deal CTAs are instrumented.

## Proposed change
Decorate only the Labor Day offer verification links with the existing `data-deal-action="get-deal"` and `data-deal-source="verified-source"` contract after the seasonal deal section renders.

## Acceptance criteria
- Every `#mrLocalLaborDeals .mrDealVerify` link is marked as a supported get-deal outbound action.
- The existing analytics listener records `deal_outbound_click` with `deal_source=verified-source` when those links are clicked.
- No claim, redemption, realized savings, exclusivity, partnership, verification, rating, consent, or attribution evidence is fabricated.
- No external merchant URL receives a Mission Rated referral token or visitor identifier.
- Existing offer copy, ordering, source URLs, and UI remain unchanged.
- Mission Rated QA and Integration QA pass on the exact branch head before merge.

## Risk / rollback
Low and reversible. The change only adds existing analytics data attributes to an existing outbound CTA. Rollback is a normal Git revert.