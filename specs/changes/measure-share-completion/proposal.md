# Proposal: Measure completed share operations

## Problem
Mission Rated currently has a defensible click-level `share_action` intent signal, but it cannot distinguish a share button click from a native share/copy operation that actually completed. Treating those as the same evidence level would overstate Growth performance.

## Proposed change
Keep `share_action` as intent. Add a separate `share_completed` event emitted only after `navigator.share()` resolves or a clipboard/copy operation succeeds.

## Evidence boundary
`share_completed` proves only that the client-side share/copy operation completed. It does not prove downstream delivery, recipient engagement, referral conversion, redemption, savings, partnership, or user identity.

## Acceptance criteria
- `share_action` remains click-level intent.
- Generic click analytics cannot emit `share_completed`.
- `share_completed` emits only on successful native share/copy operations.
- Cancelled or failed shares do not emit `share_completed`.
- Completed-share analytics include only target context and share method; generated referral URLs are not persisted.
- The existing same-origin/OIDC durable Growth ingestion boundary remains unchanged.
- Existing acquisition QA enforces the evidence separation.

## Risk / rollback
Low and reversible. This adds one bounded event type and one success-path emission without changing share UX, referral URL generation, auth, ratings, savings, or partner state. Rollback is a normal Git revert.
