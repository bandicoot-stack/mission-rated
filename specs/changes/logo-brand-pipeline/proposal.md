# Proposal: Centralized Logo / Brand Pipeline

## Problem

Mission Rated currently renders the primary brand as hard-coded `MISSION RATED` text in page headers and does not have a canonical site logo asset. The release build also copies a hand-maintained list of individual images into `dist/assets`, so adding a new logo file under `assets/` does not guarantee that it ships.

This makes logo enhancement and replacement fragile: a brand update can require touching page markup and build configuration in multiple places, and a missed step can leave production unchanged.

## Goal

Make logo updates a one-asset workflow while preserving a readable fallback and the current navigation structure.

## Scope

- Add one canonical Mission Rated SVG wordmark under `assets/`.
- Publish the entire `assets/` directory automatically during builds instead of maintaining an image allow-list.
- Add one shared brand enhancer that upgrades existing `.brand` fallback text to the canonical logo in built pages.
- Inject the enhancer into every top-level HTML release page from the build pipeline, including pages copied by `build-all.mjs`.
- Add QA checks that confirm the canonical source asset, built asset, shared enhancer, and built-page wiring are present.
- Document the one-file replacement workflow.

## Non-goals

- No navigation redesign.
- No change to ratings, provenance, consent, data APIs, or business logic.
- No removal of fallback brand text from source HTML.
- No broad component/framework rewrite.

## Acceptance criteria

1. `assets/mission-rated-logo.svg` is the single canonical website logo asset.
2. A normal `npm run build` copies the canonical logo to `dist/assets/mission-rated-logo.svg` without adding the filename to a manual copy list.
3. Every top-level built HTML page includes `/brand.js`.
4. On pages containing an existing `.brand` element, `brand.js` replaces its visual contents with the canonical logo while preserving a home link and accessible label.
5. Source HTML retains a text fallback for no-JavaScript/error scenarios.
6. `npm run qa` fails if the canonical logo asset or shared brand wiring disappears.
7. Logo replacement instructions require changing only `assets/mission-rated-logo.svg`, then running QA and the normal PR/release process.
8. Mobile sizing keeps the logo within the header without horizontal overflow.
