# Tasks: Centralize Supabase config

## Preparation

- [x] Read `MISSION_RATED_CONSTITUTION.md` and `specs/current/core-platform.md`.
- [x] Resolve open questions in `proposal.md`.
- [x] Add `design.md` for the shared browser configuration module and build-output implications.

## Implementation

- [ ] Add `lib/config.js` exporting the public Supabase project URL and function base paths.
- [ ] Update every browser `*.js` caller that hardcodes the Mission Rated Supabase hostname to consume `lib/config.js` while preserving endpoint suffixes and request options.
- [ ] Update the build copy plumbing so `dist/lib/config.js` is emitted.
- [ ] Audit all repository `*.js` files to confirm the hostname is centralized.
- [ ] Preserve provenance, trust, consent, accessibility, security, page content, DOM behavior, and visual output.

## Verification

- [ ] Run Mission Rated QA (`npm run qa`).
- [ ] Run Mission Rated Integration QA.
- [ ] Confirm no user-facing page/content/visual changes in the diff.
- [ ] Confirm endpoint URLs remain identical to pre-refactor values.
- [ ] Verify production behavior after deployment, including `production-release.yml` Playwright checks.

## Closeout

- [ ] Confirm `specs/current/` remains accurate; no product contract update is expected because behavior is unchanged.
- [ ] Link the release/PR from the change record.
- [ ] Record follow-on work rather than silently expanding scope.
