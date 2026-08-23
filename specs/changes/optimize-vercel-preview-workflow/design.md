# Design: Optimize Vercel Preview Workflow

## Approach

Use Vercel's supported `ignoreCommand` in `vercel.json`. The command delegates to `scripts/vercel-ignore-build.mjs`, which exits with Vercel semantics: `0` means ignore this build; `1` means continue building.

The decision order is intentionally conservative:

1. If the environment is production or the Git ref is `main`, build.
2. If the latest commit message contains `[skip preview]`, ignore the preview.
3. Resolve the comparison base from `VERCEL_GIT_PREVIOUS_SHA`, falling back to `HEAD^` only when valid.
4. If Git context cannot be resolved, build.
5. If every changed file is non-runtime metadata/documentation, ignore the preview.
6. Otherwise build.

## Non-runtime paths

The initial safe-to-ignore set is deliberately narrow:

- `specs/**`
- `docs/**`
- `.github/**`
- repository Markdown files (`*.md` anywhere)

Changes to runtime source, assets, package/build configuration, `vercel.json`, scripts, HTML, JS, JSON data, or unknown paths build by default.

## Engineering convention

Intermediate runtime commits may include `[skip preview]` when browser review is not yet useful. The final review-ready commit must omit that marker so Vercel creates a preview. GitHub QA remains independent of this Vercel decision.

## Safety

Production is never intentionally ignored. Unknown state prefers a build. Existing production-release exact-SHA and browser QA remains the release authority.
