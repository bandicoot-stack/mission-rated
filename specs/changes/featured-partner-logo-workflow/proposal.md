# Proposal: Featured Partner Logo Workflow

## Problem

Featured partner logos are currently handled through page-specific markup and ad-hoc asset paths. This has caused broken images, inconsistent rendering, repeated page edits, and false-positive production checks where an asset returned HTTP 200 but the browser could not decode it.

This change applies only to logos supplied by Mission Rated featured partners. It is separate from the Mission Rated website brand-logo system.

## Goal

Create one reliable path:

partner provides logo → logo is normalized/enhanced → canonical partner asset is created → partner data references it → build publishes it automatically → QA verifies it → featured surfaces render it consistently.

## Scope

- Add a canonical partner asset convention at `assets/partners/<partner-slug>/logo.<ext>`.
- Add one shared featured-partner data source with a canonical `logo` field.
- Add one shared partner-logo renderer/helper used by featured partner surfaces.
- Migrate Yorktown Tools to the canonical workflow.
- Make the release build publish partner assets recursively without per-file build edits.
- Add automated QA for partner logo references and browser-oriented render contracts.
- Extend production visual QA so a featured logo must actually decode/render at mobile and desktop widths.

## Out of scope

- Redesigning or changing the Mission Rated brand logo architecture.
- Recoloring or materially redesigning partner trademarks.
- Changing ratings, rankings, verification, sponsorship policy, or other unrelated user-facing behavior.

## Acceptance criteria

1. A featured partner record contains a stable slug, business name, canonical logo URL, alt text/accessibility name, offer data, and destination links; page-specific HTML does not own the logo URL.
2. Canonical partner logos live under `assets/partners/<slug>/logo.svg`, `.webp`, or `.png` and use supported non-zero-byte assets.
3. Featured partner surfaces render logos through one shared helper that provides responsive containment, consistent sizing, accessible alt text, transparent/light-background handling, and a business-name fallback when the asset is missing or fails to decode.
4. A missing or invalid logo never displays a broken-image icon and does not block partner onboarding.
5. The build publishes the entire `assets/` tree recursively; adding a new partner logo requires no build-manifest edit.
6. QA fails when a partner record references a missing file, unsupported format, zero-byte asset, mismatched/noncanonical partner path, duplicate/conflicting canonical logo files, or missing accessible partner name/alt text.
7. QA verifies that featured card/page markup uses the shared renderer/data source rather than hard-coded partner logo URLs.
8. Production browser QA verifies that the active Featured view renders its partner logo successfully (`complete === true`, positive natural dimensions, visible layout box) at both mobile and desktop sizes.
9. Updating a partner logo at the same canonical path requires no individual page changes.
10. Yorktown Tools is migrated to the canonical partner asset/data path and renders without a broken image.

## Trust/accessibility considerations

Featured status remains clearly labeled and independent of Mission Rated ratings/rankings. Partner logos receive useful accessible labeling, preserve their original aspect ratio, and have a non-image fallback.
