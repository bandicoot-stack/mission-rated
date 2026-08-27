# Design: Defensible Savings Ledger

## Valuation contract
Each valued offer must retain: `deal_id`, `valuation_method`, `retail_value_cents`, `military_price_cents` when applicable, `savings_value_cents`, `valuation_source_url`, `valued_at`, and `confidence`.

Allowed methods:
- `fixed_discount`: published dollar discount; savings equals published amount.
- `price_difference`: published standard price minus published eligible military price.
- `free_item`: published normal retail price of the exact free entitlement.
- `percentage_with_baseline`: published percentage applied only to a documented, contemporaneous baseline.

Unpublished, variable, or assumption-dependent values remain unvalued rather than estimated.

## Family and quantity benefits
A published entitlement covering multiple people/items may expose both per-unit value and maximum published entitlement value. Public aggregate reporting must state which basis is used. Maximum quantities must not be treated as realized savings absent redemption evidence.

## Exclusivity and overlap
Mutually exclusive offers share an overlap group. Aggregate available value must choose at most one offer per overlap group using the highest defensible value, while realized savings records the actual redeemed offer only.

## Realized ledger
A realized entry requires an attributable redemption or partner/user confirmation and stores the amount actually saved. Outbound clicks and deal claims are intent signals only and cannot create ledger dollars.

## Presentation
Public copy must distinguish `available to save` from `saved by military families`. A rounded conservative public anchor may be lower than the underlying verified catalog total.