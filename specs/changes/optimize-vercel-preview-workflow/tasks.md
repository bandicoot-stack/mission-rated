# Tasks: Optimize Vercel Preview Workflow

1. Add `scripts/vercel-ignore-build.mjs` with conservative build/ignore logic.
2. Add `ignoreCommand` to `vercel.json`.
3. Add automated QA for production, marker, docs-only, runtime, and fail-safe cases.
4. Include deployment-policy QA in `npm run qa`.
5. Document preview batching and `[skip preview]` in `AGENTS.md` and `DEPLOYMENT.md`.
6. Run Mission Rated QA and Integration QA.
7. Open PR using `.github/PULL_REQUEST_TEMPLATE.md`.
8. Merge only after checks pass.
9. Verify production still deploys from `main` and exact-SHA production verification remains healthy.
10. Update living spec after production verification.
