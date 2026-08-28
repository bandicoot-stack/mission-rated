# Current Spec: Savings Accounting

## Purpose
Mission Rated measures economic value without overstating impact. Savings claims must distinguish benefits that are available from dollars that users demonstrably saved.

## Definitions

### Catalog value / available savings
A modeled estimate of the value represented by an available offer. It may be shown only with language that makes clear the value is available or modeled, not already realized by Mission Rated users.

### Realized savings
A dollar amount attributable to a completed user redemption/use with a defensible comparison baseline. Realized savings is the value used for claims such as `saved by military families`.

## Realized-savings rules
- Default to $0 when a completed use, attributable user action, or defensible savings amount is absent.
- Percentage discounts require an actual or otherwise defensible eligible purchase baseline before realized dollars are calculated.
- Free benefits require a defensible normal retail price for the same eligible item/admission/service.
- Unpublished discount amounts contribute $0 until the amount is established.
- Mutually exclusive benefits may not be stacked or double-counted for one redemption.
- A single redemption must not be counted more than once because it appears in multiple journeys, cards, campaigns, referrals, or analytics events.
- Refunds, reversals, invalid claims, or corrected attribution must be reversible in the ledger.

## Evidence and provenance
Each realized savings record must preserve enough information to audit the claim, including:
- canonical deal/business identity;
- savings amount in integer cents;
- redemption/use count when greater than one;
- evidence/source class describing why attribution is defensible;
- verification timestamp;
- notes where needed to explain a non-obvious calculation.

A click, page view, share, referral, outbound navigation, or deal claim alone is not proof of realized savings unless a later verified event establishes completed use and amount.

## Attribution
Mission Rated may count realized savings only when there is a defensible basis to attribute the completed use to Mission Rated. Unknown attribution contributes $0 to the `saved through Mission Rated` metric even if the underlying military benefit is real.

## Independence
Partner, exclusive, sponsored, affiliate, or paid status must never increase the calculated savings amount or alter ratings, Mission Score, verification, or organic rank.

## Public claims
- `Available savings`, `catalog value`, or equivalent language may use defensible modeled offer value.
- `Saved`, `dollars saved`, or `saved through Mission Rated` must use realized savings only.
- Public totals should be conservative and must not imply precision beyond the underlying evidence.
