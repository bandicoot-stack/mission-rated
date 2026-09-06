# Mission Rated Production Release Report

- **Production SHA:** `eaa416ce2c0dc9fb82fa9beea49de5251b4eb0f4`
- **Verified at:** 2026-09-06T15:55:42Z
- **GitHub Actions run:** https://github.com/bandicoot-stack/mission-rated/actions/runs/34043785431
- **Commit:** https://github.com/bandicoot-stack/mission-rated/commit/eaa416ce2c0dc9fb82fa9beea49de5251b4eb0f4
- **Production:** https://www.missionratedhq.com
- **Workflow:** Mission Rated Production Verification
- **Trigger:** push
- **Actor:** bandicoot-stack

## Verification evidence

- [x] Production `/release.json` converged to the exact GitHub SHA.
- [x] Required production route smoke tests returned HTTP 200.
- [x] Mobile visual QA passed at 390x844.
- [x] Desktop visual QA passed at 1440x1000.
- [x] Production visual QA ran with Mission Rated analytics suppression active.
- [x] Yorktown Tools partner logo decoded and rendered on homepage and Featured page.
- [x] Hunt Club Farm rendered inside the Featured Partners landing surface.
- [x] Featured Partners remained the active production landing surface expected by the release test.

## Discipline declaration

This report was generated only after every preceding production-verification step in the same workflow job succeeded. A failed or incomplete production verification cannot produce this success report.

The audit is stored on the dedicated `release-audit` branch so recording evidence cannot trigger another production deployment from `main`.
