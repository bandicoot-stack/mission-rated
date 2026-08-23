# Design: Centralized Logo / Brand Pipeline

## Approach

Keep the static-site architecture and add a small shared brand layer rather than editing every page header individually.

### Canonical asset

`assets/mission-rated-logo.svg` is the source of truth for the website wordmark. It uses a transparent background and preserves the existing Mission Rated visual language: strong white `MISSION`, cyan `RATED`, and a restrained gold accent.

### Asset publishing

`scripts/build.mjs` will recursively copy the full `assets/` directory into `dist/assets/`. This removes the current hand-maintained image copy list and means future brand or partner assets publish automatically.

### Shared rendering

`brand.js` is a small dependency-free script. In built pages it finds `.brand` elements and upgrades their fallback text to an image using `/assets/mission-rated-logo.svg`.

Behavior:

- Existing source text remains present before enhancement and when JavaScript is unavailable.
- If `.brand` is already an anchor, the script reuses it and points it home.
- Otherwise the script creates a home anchor inside the `.brand` container.
- The image has `alt="Mission Rated"`, explicit intrinsic dimensions, and responsive sizing capped for mobile headers.
- The operation is idempotent via a `data-mr-brand-logo` marker.

### Build wiring

`scripts/build-all.mjs` performs one final pass over top-level built HTML files and injects `/brand.js` before `</body>` when it is not already present. This covers the standard release pages and additional pages copied after `build.mjs` runs.

### QA

`scripts/qa.mjs` validates:

- source and built logo files exist;
- source and built `brand.js` exist;
- the enhancer references the canonical asset, accessibility label, and idempotency marker;
- every top-level built HTML page includes `/brand.js`.

## Tradeoffs

A runtime enhancement is intentionally used instead of rewriting all page templates because the repository is a static collection of independent HTML files without a shared templating system. This keeps the change reversible and small while making future logo replacement a single-file operation. The existing text fallback avoids a blank brand when scripting fails.

A future templating/component refactor could move the shared header to build time, but that is outside this change.
