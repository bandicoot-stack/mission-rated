# Tasks: Featured Partner Logo Workflow

1. Add shared featured-partner data with canonical logo fields.
2. Add shared partner-logo renderer and fallback styling/behavior.
3. Create `assets/partners/yorktown-tools/logo.webp` from the approved Yorktown logo asset.
4. Update homepage Featured rendering to read Yorktown data/logo through the shared data + renderer.
5. Update `featured.html` to render Yorktown through the same shared data + renderer.
6. Ensure build copies shared partner modules and recursively publishes all partner assets.
7. Add `qa-partner-logos.mjs` and include it in `npm run qa`.
8. Update production browser QA to verify partner logo decode/render at mobile and desktop widths.
9. Run `npm run qa` and inspect resulting source/build behavior.
10. Open PR using `.github/PULL_REQUEST_TEMPLATE.md`.
11. Merge only after required checks pass.
12. Verify production behavior and update `specs/current/core-platform.md` to document the shipped featured-partner logo contract.
