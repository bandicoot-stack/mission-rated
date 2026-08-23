# Design: Centralize Supabase config

## Current behavior

Mission Rated browser scripts are loaded as classic deferred scripts. Multiple files independently embed the public Supabase project URL or `functions/v1` base URL and then call individual Edge Function endpoints with `fetch()`.

The release build copies those browser files directly into `dist/`. There is no shared browser configuration module today.

## Proposed behavior

Add `lib/config.js` as a small ES module exporting:

- `SUPABASE_PROJECT_URL = 'https://vquwdypidgjmxnhhdbol.supabase.co'`
- `SUPABASE_FUNCTIONS_BASE = `${SUPABASE_PROJECT_URL}/functions/v1``
- `SUPABASE_FUNCTIONS_ROOT = `${SUPABASE_FUNCTIONS_BASE}/`` for callers that currently concatenate endpoint names to a trailing-slash root.

Affected classic browser scripts will preserve their current script tags and IIFE structure. Where an endpoint constant is needed, the IIFE will become async and obtain the shared constants with native dynamic `await import('/lib/config.js')`. Endpoint names and all `fetch()` options remain unchanged.

This deliberately avoids converting existing `<script defer>` tags to `type="module"`, which would alter script execution semantics and expand the refactor beyond configuration centralization.

`lib/config.js` will be copied into `dist/lib/config.js` by the existing build pipeline. The build will create `dist/lib/` before copying the file; no other build behavior changes in this change.

## Components affected

- Frontend: browser JS files that currently hardcode the Supabase project/function URL; new `lib/config.js`.
- API / Edge Function: no server or Edge Function code changes.
- Database / storage: none.
- External services: existing Supabase project only; same project and endpoint paths as before.
- CI/CD / deployment: build copy list gains `lib/config.js` and ensures `dist/lib/` exists. Existing QA and production workflows remain unchanged.

## Data and consent semantics

No state transitions, storage behavior, request bodies, identities, consent semantics, analytics semantics, or data retention change. The same browser requests continue to reach the same public Edge Function URLs.

## Security considerations

The centralized values are already public browser endpoints, not secrets. No Supabase keys, tokens, service credentials, or private identifiers are added to client code. Dynamic import is same-origin (`/lib/config.js`), and the existing request trust boundaries remain unchanged.

A failed config-module load will prevent the affected script from starting rather than falling back to a duplicated endpoint literal. This keeps the configuration single-sourced and makes deployment/configuration failures visible to existing QA rather than silently reintroducing drift.

## Migration / rollback

No data migration is required. The change is deploy-compatible with the current backend because generated endpoint URLs are byte-for-byte the same strings used today.

Rollback is a normal revert of this PR: restore endpoint constants in callers, remove `lib/config.js`, and remove the build copy/directory addition.

## Verification plan

- Audit repository `*.js` files and confirm the Supabase hostname appears only in `lib/config.js` after implementation.
- Build and confirm `dist/lib/config.js` exists.
- Run `npm run qa` through Mission Rated QA without weakening checks.
- Run Mission Rated Integration QA.
- Review the PR diff to confirm endpoint suffixes, request methods/options, DOM/content/style code, and page-loading declarations are otherwise unchanged.
- After merge, require `Mission Rated Production Verification` to converge to the merged SHA, pass route smoke tests, and pass the existing Playwright checks at mobile and desktop viewports.
