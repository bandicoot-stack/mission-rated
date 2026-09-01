# Codex repository discipline

## Problem

Mission Rated has accumulated branch and release churn even when local QA is green. The recurring failure mode is process drift: parallel duplicate attempts, stale durable state, and runtime-only identity failures that are discovered after deployment.

The current Growth ingestion implementation correctly obtains Vercel OIDC identity with `getVercelOidcToken()` inside the request handler, but the repo has no automated regression guard preventing a future agent from reading `process.env.VERCEL_OIDC_TOKEN` directly again.

## Desired outcome

Make disciplined agent behavior executable rather than advisory:

1. Require an equivalent-work preflight before material branch/PR creation.
2. Enforce one intent -> one active branch/PR and require reuse/rebase instead of replacement attempts.
3. Require durable queue/state reconciliation when operational truth materially changes.
4. Add QA that rejects direct `VERCEL_OIDC_TOKEN` access and verifies request-scoped `getVercelOidcToken()` usage for Growth ingestion.
5. Keep this change separate from durable-state snapshot semantics already owned by PR #160.

## In scope

- Root `AGENTS.md` workflow discipline.
- Pull request checklist evidence for equivalent-work preflight and durable-state reconciliation.
- Codex discipline QA wired into `npm run qa`.
- Growth OIDC regression checks.

## Out of scope

- Product features.
- Growth event schema/analytics semantics.
- Authenticated command-center work (`MR-CMD-002`).
- Rewriting or competing with PR #160 durable-state snapshot semantics.
- Destructive deletion of historical remote branches in this PR.

## Acceptance criteria

- `npm run qa` executes `scripts/qa-codex-discipline.mjs`.
- QA fails if repository source reads `process.env.VERCEL_OIDC_TOKEN` directly.
- QA requires Growth ingestion to import and await `getVercelOidcToken()` inside the request handler and use the returned token for the outbound Bearer header.
- `AGENTS.md` requires an equivalent-work preflight and one-intent/one-active-branch behavior.
- PR template requires the author/agent to record equivalent-work preflight evidence and durable state/queue reconciliation.
- No production runtime behavior changes.

## Constitutional checks

- No secrets or credentials are introduced.
- Native systems remain authoritative for live state.
- This change narrows autonomous behavior by making branch/PR duplication explicitly fail-disciplined.
