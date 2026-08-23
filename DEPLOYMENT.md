# Mission Rated deployment contract

## Source of truth
- Repository: `bandicoot-stack/mission-rated`
- Production branch: `main`
- Vercel project: `mission-rated-beta`
- Production URL: `https://mission-rated-beta.vercel.app`

## Required Vercel project setup
1. In Vercel → `mission-rated-beta` → Settings → Git, connect `bandicoot-stack/mission-rated`.
2. Set Production Branch to `main`.
3. Keep automatic Git deployments enabled.
4. Build command: `npm run build`.
5. Output directory: `dist`.

The repository `vercel.json` also declares the build/output contract so project settings and source control stay aligned.

## Preview deployment optimization

The repository owns its Vercel Ignored Build Step through `vercel.json` → `ignoreCommand` → `scripts/vercel-ignore-build.mjs`.

Preview behavior:
- `main` and Vercel production always build.
- Branch commits marked `[skip preview]` are ignored by Vercel so intermediate engineering work does not consume a preview deployment.
- Branch changes containing only `specs/**`, `docs/**`, `.github/**`, or Markdown files are ignored automatically.
- Runtime-impacting or unknown changes build by default.
- Missing/ambiguous Git comparison state fails safe by building.

Recommended engineering rhythm:

`edit → GitHub QA → batch/fix with [skip preview] as needed → review-ready commit → one useful Vercel preview → PR/merge → one production deploy → production verification`

Do not use `[skip preview]` to bypass browser review when the change's acceptance criteria require a preview. It is only for intermediate work where a preview adds no decision value.

## Release behavior
Every push to `main` should:
1. Run Mission Rated QA in GitHub Actions.
2. Trigger a native Vercel Git deployment.
3. Build a deterministic `dist/` artifact.
4. Publish `/release.json` containing `VERCEL_GIT_COMMIT_SHA`.
5. Run the Production Verification workflow, which waits for the canonical site to report the exact GitHub SHA and then smoke-tests `/`, `/military-value`, `/schools`, `/bases`, and `/release.json`.

A Vercel deployment being `READY` is not sufficient. A release is complete only when `/release.json` matches the intended GitHub SHA and all smoke-test routes return HTTP 200.

## If production does not converge
Check, in order:
1. Vercel Settings → Git still points to `bandicoot-stack/mission-rated`.
2. Production Branch is `main`.
3. The Vercel deployment contains Git metadata and the expected SHA.
4. Build logs show `npm run build` and the `dist` output.
5. GitHub Production Verification reports the live SHA mismatch or failing route.

Do not use ad-hoc direct file deployments for normal releases; they bypass Git metadata and can publish incomplete snapshots.
