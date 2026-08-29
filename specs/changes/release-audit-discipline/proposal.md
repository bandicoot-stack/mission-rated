# Production Release Audit Discipline

## Problem
Mission Rated has accumulated operational drift across branches, pull requests, agent state, and status notifications. Chat history is not a reliable release ledger, and future agents need durable evidence of what actually reached production and how it was verified.

## Change
After every successful production verification run, write an immutable Markdown release report to the dedicated `release-audit` branch under `reports/YYYY-MM-DD/<git-sha>.md`.

The report is written only after:
1. production `/release.json` converges to the exact GitHub SHA;
2. required production routes return HTTP 200;
3. mobile and desktop visual QA pass.

The audit branch is separate from `main` so recording release evidence does not cause another production deployment.

## Agent discipline
All capable agents must reconcile fast-changing native state before material work. Before release-sensitive work, review the latest `release-audit` report and current GitHub/Vercel state. Stale PRs or durable queue entries must not be treated as current merely because they exist.

## Acceptance criteria
- Production verification has contents-write permission solely to record audit evidence.
- A successful verification creates one report for the verified SHA on `release-audit`.
- Re-running verification for the same SHA is idempotent and does not create duplicate reports.
- Failed production verification never writes a success report.
- `AGENTS.md` requires release-audit review and stale-state reconciliation.
- The audit write itself does not trigger a production deployment.
