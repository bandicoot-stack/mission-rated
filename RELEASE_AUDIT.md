# Mission Rated Production Release Audit

This branch is the append-only audit trail for verified Mission Rated production releases.

Each successful `Mission Rated Production Verification` run writes one Markdown report to `reports/YYYY-MM-DD/<git-sha>.md` after production has converged to the exact GitHub SHA and all required smoke/visual checks have passed.

Future operators, reviewers, Claude, and other capable agents should use this branch to verify release discipline rather than infer production state from chat history.

A release report records the exact production Git SHA, GitHub Actions run, verification timestamp, production release marker convergence, route smoke tests, mobile/desktop visual QA, and an explicit declaration that the report was written only after all production verification steps passed.

This branch is intentionally separate from `main` so recording audit evidence cannot trigger another production deployment.
