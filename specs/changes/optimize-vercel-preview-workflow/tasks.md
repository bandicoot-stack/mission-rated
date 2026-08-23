# Tasks: Optimize Vercel Preview Workflow

1. [x] Add `scripts/vercel-ignore-build.mjs` with conservative build/ignore logic.
2. [x] Add `ignoreCommand` to `vercel.json`.
3. [x] Add automated QA for production, marker, docs-only, runtime, and fail-safe cases.
4. [x] Include deployment-policy QA in `npm run qa`.
5. [x] Document preview batching and `[skip preview]` in `AGENTS.md` and `DEPLOYMENT.md`.
6. [ ] Run Mission Rated QA and Integration QA.
7. [ ] Open PR using `.github/PULL_REQUEST_TEMPLATE.md`.
8. [ ] Merge only after checks pass.
9. [ ] Verify production still deploys from `main` and exact-SHA production verification remains healthy.
10. [ ] Update living spec after production verification.
