# Growth scorecard event contract

## Goal
Make Growth MVP reporting defensible by defining which browser events may count as funnel evidence and which must not be treated as realized savings.

## Funnel events already emitted
- `deal_click`: intent to visit/redeem an offer; not a redemption and not savings.
- `claim_action`: business/listing claim intent; not a deal claim.
- `weekend_brief_signup_attempt`: form attempt only; never a subscriber conversion.
- `weekend_brief_signup_confirmed`: authoritative signup success only.
- `referral_visit`: attributed inbound visit; not a successful referral conversion by itself.
- `page_view`, `return_visit`, `internal_navigation`: engagement only.

## Scorecard rules
1. Never derive dollars saved from `deal_click`, page views, referral visits, or signup events.
2. Realized savings require a redemption/transaction record with a defensible amount and provenance. Until that exists, report realized savings as unavailable rather than estimated.
3. Offer counts may use only records whose verification state is supported by source/partner evidence. `featured` or paid placement never implies verification or exclusivity.
4. Exclusive-offer counts require explicit exclusivity evidence; a directly confirmed discount alone is not exclusive.
5. Weekend Brief conversion = confirmed signups / signup attempts for the same reporting window; keep attempts and confirmed signups visible separately.
6. Referral performance must distinguish visits from downstream conversions.
7. Partner/deal reporting must preserve stable deal or partner identifiers; display names alone are insufficient attribution keys.

## Next bounded implementation
Add stable partner/deal identifiers to Featured Partner deal-click instrumentation so Yorktown Tools and Compass Rose traffic can be separated without changing offer presentation or ranking.

## Trust boundary
No metric in this scorecard may alter ratings, Mission Score, verification state, or organic rank.