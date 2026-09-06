# Codex repository discipline

## Problem

Mission Rated has accumulated branch and release churn even when local QA is green. The recurring failure mode is process drift: parallel duplicate attempts, stale durable state, runtime-only identity failures that are discovered after deployment, and avoidable coding mistakes caused by agents guessing at APIs/paths, inventing duplicate helpers, broadening scope, or declaring success without executing the relevant checks.

The current Growth ingestion implementation correctly obtains Vercel OIDC identity with `getVercelOidcToken()` inside the request handler, but the repo needs durable guardrails that also make read-first, verify-first, minimal-change execution explicit and regression-tested.

## Desired outcome

Make disciplined agent behavior executable rather than advisory:

1. Require an equivalent-work preflight before material branch/PR creation.
2. Enforce one intent -> one active branch/PR and require reuse/rebase instead of replacement attempts.
3. Require durable queue/state reconciliation when operational truth materially changes.
4. Add QA that rejects direct `VERCEL_OIDC_TOKEN` access and verifies request-scoped `getVercelOidcToken()` usage for Growth ingestion.
5. Require coding agents to read existing code/patterns before writing, verify APIs/paths/config from source, reuse existing helpers, and make the smallest coherent change.
6. Prohibit weakening/deleting/skipping tests to make CI pass and require the actual relevant test/build/QA to be run before completion claims.
7. Require a short execution plan for multi-file, cross-system, or materially ambiguous changes.
8. Require an explicit anti-dumb-mistake finish check covering overlap, assumptions, helpers, edge cases, style, trust semantics, debug residue, and exact-SHA production evidence.
9. Require concise factual completion communication with uncertainty and assumptions surfaced explicitly.
10. Keep this change separate from unrelated product/runtime work.

## In scope

- Root `AGENTS.md` workflow and execution discipline.
- Codex discipline QA wired into `npm run qa`.
- Existing codex-repo-discipline spec/task extension.
- Growth OIDC regression checks already owned by this discipline area.

## Out of scope

- Product features.
- Growth event schema/analytics semantics.
- Authenticated command-center work (`MR-CMD-002`).
- Rewriting durable-state snapshot semantics owned elsewhere.
- Destructive deletion of historical remote branches.
- Runtime behavior changes solely to support this directive.

## Acceptance criteria

- `npm run qa` executes `scripts/qa-codex-discipline.mjs`.
- QA fails if repository source reads `process.env.VERCEL_OIDC_TOKEN` directly.
- QA requires Growth ingestion to import and await `getVercelOidcToken()` inside the request handler and use the returned token for the outbound Bearer header.
- `AGENTS.md` requires an equivalent-work preflight and one-intent/one-active-branch behavior.
- `AGENTS.md` requires read-before-write, verified API/path/config assumptions, existing-helper reuse, and minimal scoped changes.
- `AGENTS.md` prohibits weakening tests to satisfy CI and requires relevant executable checks before completion claims.
- `AGENTS.md` requires a 2–3 line plan for multi-file/cross-system/materially ambiguous changes.
- `AGENTS.md` contains an explicit anti-dumb-mistake finish checklist and concise completion-status format.
- `scripts/qa-codex-discipline.mjs` regression-checks the durable presence of those guardrails.
- No product or production runtime behavior changes.

## Constitutional checks

- No secrets or credentials are introduced.
- Native systems remain authoritative for live state.
- This change narrows autonomous behavior by making branch/PR duplication and unverified execution explicitly fail-disciplined.
- Trust, consent, savings, rating, verification, and authorization semantics are not changed.
