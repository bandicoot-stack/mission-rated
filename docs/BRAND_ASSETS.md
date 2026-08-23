# Mission Rated Brand Asset Workflow

## Website logo source of truth

The canonical website logo is:

`assets/mission-rated-logo.svg`

Do not add page-specific copies of the Mission Rated logo and do not hard-code alternate logo image paths into individual pages.

## Update the logo

1. Replace `assets/mission-rated-logo.svg` with the approved SVG while keeping the same filename and a transparent background.
2. Keep the SVG viewBox/aspect ratio suitable for a horizontal website header. The shared renderer caps display height and mobile width automatically.
3. Run `npm run qa`.
4. Open the normal Mission Rated PR and let release/integration checks pass.
5. Verify the production header on mobile and desktop after deployment.

No build-script edit or per-page HTML edit is required.

## How it works

- `scripts/build-all.mjs` recursively publishes everything under `assets/` to `dist/assets/`.
- `brand.js` upgrades existing `.brand` fallback text to `/assets/mission-rated-logo.svg`.
- The build injects `/brand.js` into every top-level release HTML page.
- `scripts/qa-brand.mjs` blocks the standard QA suite if the source logo, built logo, shared renderer, or page wiring is missing.

## Fallback behavior

Source HTML keeps readable `MISSION RATED` text. If JavaScript is disabled or the enhancement fails, the site still identifies the brand instead of showing an empty header.
