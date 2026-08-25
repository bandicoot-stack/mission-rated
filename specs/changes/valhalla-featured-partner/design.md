# Design: Valhalla Barbell Club Featured Partner

## Approach

Use the existing `window.MRFeaturedPartners` data source and `/featured` renderer. Add optional content fields to the partner record so richer founder-approved partner storytelling can render without creating a one-off standalone page or duplicating the Featured Partner UI.

## Data additions

Valhalla's record may define optional fields used by the shared renderer:

- `partnerSubheadline`
- `tagline`
- `intro`
- `services`
- `standard`
- `wolfLine`
- `closingHeading`
- `primaryCtaLabel`
- `contactName`

Existing partner records remain valid when these fields are absent.

## Rendering

The shared `/featured` renderer will conditionally render optional sections only when data is present. Existing generic fields remain the fallback for current partners. The military offer continues to use the shared offer/terms area and outbound CTA tracking.

## Logo handling

Do not hotlink the public Valhalla website logo. This release may use the existing accessible partner-name fallback until a canonical logo file is stored under `assets/partners/valhalla-barbell-club/` through the approved logo workflow. Missing logo must not block partner onboarding.

## Trust / provenance

- `directlyConfirmed` is true because Chris Jordan confirmed participation and the offer directly by email.
- `veteranOwned` is true and is also supported by the official Valhalla website.
- Featured placement remains independent of ratings/rankings and inherits the existing `/featured` trust disclosure.

## SEO / accessibility

Keep `/featured` indexable and semantically structured. Use headings for optional partner sections, preserve descriptive link labels, and retain keyboard/touch-friendly CTA behavior.
