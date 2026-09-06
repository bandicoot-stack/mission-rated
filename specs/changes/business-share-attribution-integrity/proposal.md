# Change Proposal: Business Share Attribution Integrity

## Problem
The public Business Share Kit currently lets an operator enter an arbitrary business/source slug and writes that value into `utm_campaign`. Because the kit is unauthenticated, that value is self-entered and cannot be treated as verified per-business attribution in the Growth scorecard.

## Scope
Keep the Business Share Kit useful for distribution while making its persisted attribution semantics defensible: generated links retain the neutral `utm_source=business` and `utm_medium=business-share` channel labels, but use a fixed `utm_campaign=business-distribution` rather than a user-supplied business identity. Business name remains presentation copy only.

## Acceptance criteria
- Generated Business Share Kit URLs remain restricted to HTTPS Mission Rated production domains.
- Generated URLs use `utm_source=business`, `utm_medium=business-share`, and fixed `utm_campaign=business-distribution`.
- User-entered business names or slugs are not encoded into persisted Growth attribution fields.
- The UI explains that the business name is share-copy presentation only, not verified attribution or partnership evidence.
- Existing trust language remains neutral and does not imply partnership, sponsorship, verification, endorsement, or featured placement.
- No ratings, Mission Score, verification, savings, review, redemption, subscriber, or partner state changes.

## Risk / rollback
Low and reversible. This narrows attribution claims while preserving the distribution tool and valid Mission Rated destinations. Rollback is a normal Git revert.
