# Proposal: Homepage deal trust CTA

## Problem

The homepage is the highest-traffic Mission Rated surface, but current Today’s Deals cards use a generic `Use this deal` action that does not tell users whether they are opening the actual source used to verify the offer or only the business website. This weakens trust presentation and makes the primary conversion action ambiguous.

Recent product-event data shows substantially more homepage sessions than downstream deal/navigation activity, so the highest-value bounded frontend improvement is to make deal actions clearer rather than add more content.

## Proposed change

On homepage deal cards:

- distinguish a source-backed offer from a business-site-only fallback;
- label the source action `Verify & use deal` when a stored HTTPS source is available;
- expose the official business website separately when it differs from the offer source;
- use `Visit business` only when no offer source is available;
- attach the existing deal-conversion analytics hook to source-backed primary actions;
- preserve existing deal data, ranking, eligibility, verification, and backend behavior.

## Acceptance criteria

- A deal with a stored HTTPS source shows `SOURCE-BACKED` and a `Verify & use deal` primary action.
- If the business website differs from the stored deal source, it is shown as a distinct `Official website` action.
- A deal without a stored HTTPS source does not imply source verification and may show `Visit business` when a business website exists.
- Existing analytics records source-backed primary actions through the current `mrDealAction`/`data-deal-action` contract.
- No unsupported deal, rating, verification, source, or metric is introduced.
- Mission Rated QA and Integration QA pass before merge.
- Production behavior is verified after deployment.

## Out of scope

- changing deal data or source requirements;
- changing the Today Deals API;
- changing ranking or expiry logic;
- backend authorization, schema, or consent changes.
