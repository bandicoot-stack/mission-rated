# Proposal: Fall Deals & Finds

## Problem / opportunity

Mission Rated has a prominent seasonal homepage slot currently dedicated to Labor Day. As fall approaches, military families need a simple local guide for pumpkin patches, farms, hayrides, corn mazes, festivals, and other family activities without adding another layer of homepage clutter.

## Desired outcome

Replace the active seasonal homepage slot with a source-backed Fall Deals & Finds experience focused on Hampton Roads farms and fall family activities.

## In scope

- Add a public `fall.html` seasonal landing page.
- Feature source-backed Hampton Roads farms, pumpkin patches, hayrides, corn mazes, and fall festivals.
- Replace the Labor Day homepage seasonal button with `Fall Deals & Finds` while leaving the Labor Day page available by direct URL.
- Preserve clear source links and freshness language for time-sensitive seasonal information.
- Add build/QA coverage for the new seasonal surface.

## Out of scope

- New database tables or APIs.
- Fabricated ratings, rankings, discounts, or military benefits.
- Removing the existing Labor Day page.
- Automated scraping of farm websites.

## Acceptance criteria

- Homepage navigation includes `Fall Deals & Finds` in the active seasonal slot after Today’s Deals.
- Selecting the seasonal button opens `/fall.html`.
- The fall page is mobile-friendly and includes farms/activities centered on Hampton Roads.
- Each factual venue card links to an authoritative or first-party source.
- Time-sensitive claims carry a visible last-checked/freshness signal and uncertain 2026 dates are not invented.
- Build output includes `fall.html`.
- Mission Rated QA includes a guard for the seasonal navigation, source-backed content, and build inclusion.

## Constitutional checks

- Trust: no rating or verification claims are invented.
- Provenance: every featured venue has a source action.
- Mobile/accessibility: responsive cards, semantic headings, focus-visible links.
- SEO/AI discovery: descriptive title/meta copy and semantic seasonal content.
- Privacy/consent: no new data collection.
- Security: no new backend or secret handling.

## Open questions

- None. Labor Day remains reachable directly while the homepage seasonal slot rotates to fall.
