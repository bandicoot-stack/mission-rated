# Proposal: Defensible Savings Ledger

## Problem
Mission Rated needs a dollars-saved metric without implying that catalog value equals realized user savings. Existing offers include fixed-dollar, percentage, free-item, variable-price, and mutually exclusive benefits.

## Goal
Define a strict contract for calculating and reporting savings so growth metrics remain useful and defensible.

## Trust rules
- Never count a benefit that is free to the general public as military savings.
- Never convert a percentage discount to dollars without a documented retail baseline.
- Never report catalog value as realized user savings.
- Never count a redemption without evidence attributable to that redemption.
- Never double-count mutually exclusive offers or the same economic benefit.
- Preserve source URL and valuation timestamp for every computed amount.

## Metrics
1. `available_verified_savings`: sum of currently valid, independently quantifiable offer values under the valuation contract.
2. `realized_verified_savings`: sum of savings tied to documented redemptions in the verified savings ledger.
3. `valued_offer_coverage`: active offers with defensible dollar values / all active offers.

## Non-goals
This change does not fabricate historical redemptions, infer purchase amounts, change Mission Score/ranking, or assign monetary value to unquantifiable offers.