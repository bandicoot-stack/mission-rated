# Military auto-buying intelligence — 2026-08-12

Authoritative sources to support Mission Rated **Buy a Car** trust features.

## Military Consumer — Vehicle Financing
Source: https://www.militaryconsumer.gov/spend/car-shopping/vehicle-financing

Product signals worth encoding:
- Encourage financing preapproval before contacting a dealer.
- Capture whether a dealer will provide an **out-the-door price in writing before arrival**.
- Compare financing on APR, not monthly payment alone.
- Contract check should surface APR, finance charge, amount financed, total of payments, payment amount/count/due dates.
- Never represent a dealer as trusted merely because it advertises military friendliness.

## Military Consumer — Buying a Car
Source: https://www.militaryconsumer.gov/spend/car-shopping/buying-car

Product signals worth encoding:
- Research and comparison before visiting a lot.
- Separate advertised deal claims from verified final pricing.
- Track exchange/overseas purchase programs separately from ordinary local dealer offers.

## CFPB — Servicemembers Civil Relief Act
Source: https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/the-servicemembers-civil-relief-act-scra/

Important scope note:
- SCRA can cap eligible **pre-service** debt interest at 6% and includes vehicle repossession protections in qualifying circumstances.
- Do not imply every auto loan taken while serving receives a 6% cap.

## CFPB — Military Lending Act
Source: https://www.consumerfinance.gov/consumer-tools/military-financial-lifecycle/military-lending-act-mla/

Important scope note:
- Auto loans secured by the vehicle being purchased are generally outside the MLA rules described by CFPB.
- Mission Rated should not label a normal secured auto loan as MLA-protected without a fact-specific basis.

## Recommended dealer trust fields
These should be evidence-backed and independently displayed, not collapsed into an MR score until enough Mission Rated evidence exists:
- out_the_door_quote_available
- accepts_outside_financing
- outside_financing_notes
- mandatory_addons_disclosed
- dealer_fee_disclosed
- military_offer_verified
- military_offer_terms_url
- named_salesperson_mentions
- public_rating + source + observed_at
- MR review count + verification mix
- complaint / pressure flags from attributable sources
- evidence freshness

## Ranking guardrail
Public review averages, manufacturer incentives, dealer claims, Reddit/community mentions, and Mission Rated reviews are different evidence classes. Keep them visibly separate. Do not convert them into a synthetic dealer score until methodology and minimum sample thresholds are defined and auditable.
