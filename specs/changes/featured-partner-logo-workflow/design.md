# Design: Featured Partner Logo Workflow

## Approach

Keep the implementation incremental and browser-native.

### Canonical partner data

Introduce a shared browser data module (`featured-partners.js`) that owns featured-partner presentation data. Each partner record contains:

```js
{
  slug: 'yorktown-tools',
  name: 'Yorktown Tools',
  logo: '/assets/partners/yorktown-tools/logo.webp',
  logoAlt: 'Yorktown Tools logo',
  offer: '10% OFF',
  offerLabel: 'Military Discount',
  businessUrl: 'https://yorktowntools.com/',
  profileUrl: '/business.html?id=...'
}
```

This is the current source of truth for featured-partner UI presentation. It avoids duplicating logo URLs across homepage and featured pages. Existing backend business/deal records remain unchanged by this refactor.

### Canonical partner assets

Canonical partner logos live at:

`assets/partners/<partner-slug>/logo.<supported-extension>`

Supported extensions: `.svg`, `.webp`, `.png`.

The original partner-supplied file may be retained separately outside the canonical path if useful, but featured UI reads only the canonical `logo` field.

### Shared renderer

Introduce `partner-logo.js` with a small shared renderer that:

- creates the image element from partner data;
- applies consistent container/image classes;
- preserves aspect ratio with `object-fit: contain`;
- supports mobile/desktop sizing;
- provides accessible alt text;
- hides broken image UI and replaces it with a styled business-name fallback when loading/decoding fails;
- exposes a stable data attribute used by QA (`data-partner-logo`).

The helper will be used by both the homepage Featured surface and `featured.html`.

### Build

The existing build now recursively copies `assets/` to `dist/assets`, which satisfies the requirement that partner asset additions do not require build-manifest edits. The new shared root JS files will be copied by the build as stable application code; onboarding a new partner will not require changing that list.

### QA

Add `scripts/qa-partner-logos.mjs` to inspect source partner data and canonical asset paths. It will fail on:

- unsupported extensions;
- noncanonical path shape;
- missing files;
- zero-byte files;
- duplicate canonical logo files for a slug;
- missing slug/name/logoAlt;
- hard-coded Yorktown logo URLs in featured surfaces;
- missing shared renderer hooks.

Add this QA to `npm run qa`.

Production visual QA will assert actual image decode/render state, not only HTTP status. Browser assertions will check `img.complete`, `naturalWidth > 0`, `naturalHeight > 0`, and a non-zero rendered bounding box at mobile and desktop widths.

## Failure behavior

If a logo cannot load, the renderer swaps to a business-name placeholder. The featured partner remains usable and the offer/action links remain available.

## Compatibility

No database migration is required. No Mission Rated brand-logo behavior is changed. Existing featured content, deal text, badges, and destination URLs remain materially the same.
