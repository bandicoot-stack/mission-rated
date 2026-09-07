# Proposal: Add a share loop to Savings cards

## Problem
The Savings surface supports discovery and outbound deal intent but does not give users a direct way to share a useful business/deal context from the card they just found. Issue #128 calls for a lightweight share loop after useful deal interactions.

## Proposed change
Add a small Savings-only share decorator that appends a Share button to each rendered business card, reuses the existing Mission Rated `mrDealShare` helper, and shares an internal `/savings.html?q=<business>` deep link.

The shared URL stays on Mission Rated, so referral attribution remains inside the existing privacy boundary. Merchant/source URLs are never decorated with referral identifiers.

## Measurement semantics
- the existing shared analytics listener records `share_action` as click-level intent;
- `mrDealShare` records `share_completed` only after native share resolves or copy succeeds;
- target context is the public business listing ID;
- neither event proves downstream delivery, referral conversion, redemption, realized savings, partnership, or user identity.

## Acceptance criteria
- Savings cards expose a Share control without changing deal/outbound behavior.
- Shared links return to Mission Rated Savings prefiltered to the selected business name.
- Share intent and completed-operation evidence reuse the existing supported Growth event contract.
- External merchant/source URLs receive no Mission Rated referral token.
- No new exclusivity, savings, verification, partner, rating, review, subscriber, redemption, or conversion claims are created.
- Mission Rated QA and Integration QA pass on the exact branch head before merge.

## Risk / rollback
Low and reversible. The change adds one bounded browser decorator, release wiring, and regression coverage. Rollback is a normal Git revert.
