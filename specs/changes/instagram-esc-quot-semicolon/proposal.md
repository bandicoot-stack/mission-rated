# Instagram Connect quote escaping fix

## Problem
`instagram-connect-tool.js` emits `&quot` without the required trailing semicolon when escaping double quotes, unlike the other escaping helpers in the repository.

## Change
Correct the double-quote entity to `&quot;` only. No other behavior, UI, data, or policy changes.

## Acceptance criteria
- Double quotes escaped by `instagram-connect-tool.js` render as `&quot;`.
- No other escaping mappings change.
- Existing QA remains green.

## Risk / rollback
One-character, zero-cost, reversible typo fix. Roll back the single implementation commit if needed.
