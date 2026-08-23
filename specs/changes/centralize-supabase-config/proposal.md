# Change Proposal: Centralize Supabase config

## Problem / opportunity

Browser JavaScript currently repeats the Mission Rated Supabase project URL and Edge Function base URL across many files. This creates unnecessary configuration drift risk and makes future project or endpoint-base changes harder to review safely.

## Desired outcome

Mission Rated has one source of truth for the public Supabase project URL and Edge Function base path, while all existing requests resolve to the exact same URLs and user-facing behavior, content, ordering, timing expectations, and visual output remain unchanged.

## In scope

- Add `lib/config.js` as the single public configuration module for the Supabase project URL and function base path.
- Replace hardcoded `https://vquwdypidgjmxnhhdbol.supabase.co/...` strings in repository `*.js` browser files with values derived from `lib/config.js`.
- Include `lib/config.js` in the production build output.
- Preserve all existing endpoint names, request options, failure behavior, content, DOM output, styling, and navigation.

## Out of scope

- Changing the Supabase project, Edge Functions, schemas, authentication, secrets, request payloads, or response handling.
- Converting the existing classic browser-script graph to static ES modules.
- Refactoring shared DOM helpers, fetch wrappers, rendering, polling, sorting, or script injection; those are separate changes.
- Any user-facing copy, layout, visual, accessibility, SEO, provenance, consent, or ranking changes.

## User stories

- As a maintainer, I want Supabase public endpoint configuration defined once so that configuration changes cannot silently drift across browser files.
- As a Mission Rated user, I want this maintenance refactor to be invisible so that the site behaves exactly as it did before.

## Acceptance criteria

- [ ] `lib/config.js` exports the Supabase project URL and Edge Function base path.
- [ ] No repository `*.js` browser file contains a hardcoded `https://vquwdypidgjmxnhhdbol.supabase.co/...` string outside `lib/config.js`.
- [ ] Every existing Supabase request resolves to the same URL as before.
- [ ] Existing classic `<script>` loading remains intact; this change does not convert the site to module script tags.
- [ ] `lib/config.js` is present in `dist/` after the normal build.
- [ ] `npm run qa` passes without weakening any check.
- [ ] Existing integration QA passes.
- [ ] Production release verification, including the Playwright mobile and desktop checks in `production-release.yml`, passes after merge.
- [ ] No user-facing behavior, page content, ranking, DOM output, or visual output changes.

## Constitutional checks

- [x] Trust / sponsorship / ratings implications reviewed: no rating, sponsorship, or ranking semantics change.
- [x] Provenance and factual-source implications reviewed: source/provenance behavior is unchanged.
- [x] Mobile and accessibility behavior defined where relevant: no UI behavior changes; existing production checks remain required.
- [x] SEO / AI discovery implications reviewed where relevant: no public content, metadata, routes, or indexability changes.
- [x] Privacy, consent, and data-retention implications reviewed where relevant: no data collection, consent, or retention change.
- [x] Security implications reviewed where relevant: only the already-public Supabase project/function base URL is centralized; no secrets are introduced.
- [x] Required QA and production verification identified: `npm run qa`, integration QA, and `production-release.yml` after merge.

## Open questions

- None. To preserve classic-script loading semantics, affected IIFEs will load the shared ES module with native dynamic `import('/lib/config.js')` rather than changing existing script tags to `type="module"`.

## References

- `AGENTS.md`
- `MISSION_RATED_CONSTITUTION.md`
- `specs/current/core-platform.md`
- `.github/workflows/qa.yml`
- `.github/workflows/production-release.yml`
