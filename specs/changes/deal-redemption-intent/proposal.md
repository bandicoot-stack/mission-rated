# Change Proposal: Deal Redemption Intent Instrumentation

## Problem
Growth analytics currently measure deal clicks but do not distinguish a user explicitly choosing a redemption action from a general deal/merchant click. This prevents a defensible funnel from offer discovery toward redemption without claiming that a discount was actually redeemed.

## Scope
Add a `deal_redemption_intent` browser event for explicit redemption/use actions. This is an intent signal only and must never be counted as confirmed redemption or dollars saved.

## Acceptance criteria
- Explicit controls marked `data-deal-action="redeem"` emit `deal_redemption_intent` with existing deal/business target context and deal source when available.
- The same-origin analytics endpoint accepts and sanitizes the new event.
- Existing `get-deal` clicks remain `deal_click` and are not reclassified.
- No automatic event is emitted from page view, outbound navigation, or offer text alone.
- No savings, redemption, verification, exclusivity, rating, ranking, or partner claim is inferred from the event.
- Existing analytics opt-out and same-origin ingestion protections remain unchanged.
