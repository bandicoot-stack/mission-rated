# Mission Rated Savings Ledger Policy

## Purpose

Mission Rated may publish savings only when the amount is supported by evidence. This policy separates catalog value from savings actually attributable to Mission Rated.

## Required states

### Available catalog savings
A deal may contribute to available catalog savings only when all of the following are known:
- the active deal and eligibility terms;
- a current, citable source for the normal retail price or explicit dollar benefit;
- the military price, discount amount, or free benefit;
- the quantity used in the calculation;
- the valuation date.

Formula: `max(0, normal retail total - eligible military total)`.

Percentage-only offers with no defensible purchase amount contribute **$0** until a purchase amount is known. Offers free to the general public contribute **$0** in military savings. Mutually exclusive offers must not be stacked. Maximum-family or maximum-ticket values must be labeled as maximum available value, not typical savings.

### Verified realized savings
A deal may contribute to `verified_savings` only after an authoritative redemption/purchase confirmation supplies enough evidence to calculate the actual savings. A click, share, referral visit, claim attempt, outbound merchant visit, or newsletter signup is never a redemption and must never create realized savings.

Formula: `max(0, documented normal price - documented paid price)`.

If either price is unknown, realized savings remains unverified and contributes **$0**.

## Attribution

`Saved through Mission Rated` requires both a verified realized savings record and defensible Mission Rated attribution. Referral parameters, click events, or session presence may support attribution context but are not independently sufficient proof of redemption.

## Trust rules

- Never infer exclusivity from a public military offer.
- Never infer verification from a source link alone; verification status must come from the product's verification process.
- Never turn modeled, maximum, estimated, or available value into a claim that users actually saved that amount.
- Never let paid partner status affect savings calculations, verification, Mission Score, ratings, or organic rank.
- Never count the same economic benefit twice.

## Public metric labels

Use explicit labels:
- `Verified savings available` for evidence-backed catalog value.
- `Maximum available value` when using maximum eligible quantities.
- `Saved through Mission Rated` only for verified realized savings with attribution.

Do not use an unlabeled `Dollars saved` total when it mixes these states.
