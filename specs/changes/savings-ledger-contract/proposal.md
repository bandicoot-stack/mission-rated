# Proposal: Defensible Savings Ledger Contract

## Problem
Mission Rated's north-star impact metric is dollars saved, but catalog value and realized user savings are different claims. Without an explicit contract, future growth instrumentation could accidentally count theoretical offer value as money actually saved.

## Proposed change
Define a narrow savings-accounting contract before adding redemption instrumentation:

- `available/catalog savings` is modeled value of currently available benefits and must not be presented as realized savings;
- `realized savings` requires evidence of a user redemption or other attributable completed use;
- unknown purchase amounts, unpublished prices, percentage-only offers without a transaction baseline, and unverified attribution contribute zero realized dollars;
- mutually exclusive benefits may not be double-counted in a single redemption;
- every realized ledger entry retains deal identity, amount, count, source/evidence class, and verification time;
- partner, paid, sponsored, or exclusive status never changes the savings calculation.

## Acceptance criteria
1. Repository contains an authoritative current savings-accounting contract.
2. The contract distinguishes catalog value from realized savings.
3. Realized savings defaults to zero when evidence or a defensible amount is absent.
4. The contract explicitly prohibits fabricated attribution and double-counting.
5. No production data, UI, schema, ratings, rankings, verification, or partner state changes in this change.

## Scope
Documentation/specification only. This is intentionally reversible and zero-cost, and creates the trust boundary for later claim/redemption instrumentation.