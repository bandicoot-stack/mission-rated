# Proposal: Disambiguate listing claims from deal claims

## Problem
The shared analytics click handler currently emits `claim_action` for any control whose text contains claim language. That includes business/listing ownership claims as well as deal claims, so the Growth event cannot be treated as defensible deal-claim intent.

## Proposed change
Restrict `claim_action` emission to interactions whose resolved target context is explicitly `target_type=deal`. A deal-target control may qualify through `data-deal-action="claim"` or claim text. Business/listing ownership controls remain user-facing behavior but do not emit the deal-claim Growth signal.

This is an analytics-classification change only. It does not create claim state, redemption state, verified savings, partner status, exclusivity, verification, ratings, or user evidence.

## Acceptance criteria
- `claim_action` is emitted only when `targetContext` resolves the interaction to a deal.
- Generic business/listing ownership claim controls do not emit `claim_action`.
- A deal-target claim remains intent evidence only and must not be represented as redemption or realized savings.
- Existing outbound-deal, share/referral, Weekend Brief, ratings, verification, and user-facing claim flows are unchanged.
- A regression QA check fails if the generic unscoped claim matcher returns.
- Mission Rated QA and Integration QA pass on the exact branch head before merge.

## Risk / rollback
Low and reversible. The change narrows one browser analytics classification and adds a release guard. Rollback is a normal Git revert.