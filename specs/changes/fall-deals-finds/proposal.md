# Proposal: Fall Deals & Finds

## Problem / opportunity

Mission Rated has an established Fall Deals & Finds seasonal experience, but the release build still publishes the now-expired Labor Day page, supporting scripts, and sitemap/SEO discovery after Labor Day 2026 has ended. That stale seasonal surface can confuse users, weaken trust, and compete with the active fall campaign.

## Desired outcome

Make Fall Deals & Finds the active Hampton Roads seasonal experience and retire Labor Day from the production site and public discovery surfaces while preserving source history in the repository.

## In scope

- Keep the public `fall.html` seasonal landing page and active homepage Fall Deals & Finds navigation.
- Stop publishing `labor-day.html` and Labor Day-only runtime scripts in the production build.
- Remove Labor Day from public sitemap and generated discovery metadata.
- Publish Fall Deals & Finds in sitemap and generated SEO/AI discovery metadata.
- Add QA coverage that prevents expired Labor Day assets from returning to the release build.
- Preserve source-backed Hampton Roads farms, pumpkin patches, hayrides, corn mazes, fall festivals, and related activities.

## Out of scope

- New database tables or APIs.
- Fabricated ratings, rankings, discounts, or military benefits.
- Deleting historical Labor Day source files from repository history.
- Automated scraping of farm websites.

## Acceptance criteria

- Homepage navigation includes `Fall Deals & Finds` in the active seasonal slot after Today’s Deals.
- Selecting the seasonal button opens `/fall.html`.
- Production no longer publishes `/labor-day` or the Labor Day-only JavaScript assets.
- Sitemap does not advertise `/labor-day` and does advertise `/fall`.
- Generated discovery metadata describes Fall Deals & Finds rather than Labor Day.
- The fall page remains mobile-friendly and centered on Hampton Roads activities.
- Each factual venue card links to an authoritative or first-party source.
- Time-sensitive claims carry a visible freshness signal and uncertain dates are not invented.
- Mission Rated QA guards seasonal navigation, source-backed content, build inclusion, and Labor Day retirement.

## Constitutional checks

- Trust: stale seasonal offers are removed from public production surfaces; no rating or verification claims are invented.
- Provenance: every featured fall venue retains a source action.
- Mobile/accessibility: responsive cards, semantic headings, focus-visible links.
- SEO/AI discovery: active seasonal metadata and sitemap point to Fall Deals & Finds.
- Privacy/consent: no new data collection.
- Security: no new backend or secret handling.

## Open questions

- None. Founder direction on September 8, 2026 is to remove the expired Labor Day deals from the site and keep production current with Fall Deals & Finds.
