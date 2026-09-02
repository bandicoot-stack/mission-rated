# Mission Rated Agent Operating Rules

`AGENTS.md` is the bootloader, not the full memory of the system.

## Required boot sequence

Before material work, every capable agent must:

1. Read `MISSION_RATED_CONSTITUTION.md`.
2. Read `PROJECT_CONTEXT.md`.
3. Read `agent-system/README.md`.
4. Read `agent-system/state.json` and `agent-system/work-queue.json`.
5. Read the relevant `specs/current/*`, active `specs/changes/*`, and only the skill files needed for the task.
6. Verify fast-changing external state in its native system of record before acting.
7. For release-sensitive, deployment, recovery, or reconciliation work, review the latest report(s) on the `release-audit` branch before treating durable state as current.

`PROJECT_CONTEXT.md` explains durable founder intent and strategy. `specs/current/*` remains authoritative for shipped product behavior. The control plane preserves operational state between agents and context windows; it does not replace the constitution or specs.

## Stale-state intolerance

Stale operational state is a defect. Do not treat an open PR, queue item, branch, deployment, email thread, or previous agent statement as current merely because it exists.

Before material work that depends on current state:

- reconcile GitHub PR/check/main status;
- reconcile Vercel production/preview status;
- reconcile Supabase/data state when relevant;
- reconcile Gmail/partner state when relevant;
- reconcile scheduled automation state when relevant;
- update `agent-system/state.json` and `agent-system/work-queue.json` when reality has materially changed.

Duplicate or divergent stale PRs should be closed or explicitly re-based into a current main-based change. Do not create replacement PRs without first checking for equivalent active work.

## Production release audit

Every successful production deployment must leave durable verification evidence on the dedicated `release-audit` branch.

- The `Mission Rated Production Verification` workflow is the release evidence authority.
- A success report is written only after production `/release.json` matches the exact GitHub SHA, required route smoke tests pass, and mobile/desktop visual QA pass.
- Reports live at `reports/YYYY-MM-DD/<git-sha>.md` on `release-audit`.
- Reports are immutable by SHA; reruns must not replace existing evidence.
- The audit branch is intentionally separate from `main` so evidence recording cannot trigger another production deployment.
- Before claiming a production release is complete, verify the corresponding release-audit report exists.
- Future agents, including Claude or other external reviewers, should use the audit trail plus native GitHub/Vercel state to evaluate release discipline instead of relying on chat history.

## Agent operating model

Mission Rated uses an Operator-as-manager pattern with bounded specialist roles defined in `agent-system/registry.json`.

- **Operator** — triage, queue ownership, recovery, routine orchestration, and handoffs.
- **Scout** — public research, freshness, entity/deal discovery, and provenance.
- **Partner** — partnership pipeline, outreach preparation, and reply triage; sending remains subject to approval gates.
- **Product** — founder intent to requirements, proposals, specs, and acceptance criteria.
- **Builder** — architecture, implementation, and tests within approved scope.
- **QA** — independent verification, release evidence, and production verification.

One model may perform multiple roles on a small task, but authority boundaries still apply. Do not let a Builder silently act as QA to waive failures or let a Partner infer approval to send.

## Durable state and handoffs

Context windows are execution caches, not permanent memory. When operational truth changes materially, update the durable control plane before yielding, switching models, or handing off.

Use `agent-system/HANDOFF_TEMPLATE.md` for material handoffs. Record completed work, exact next action, evidence, external side effects already performed, unresolved decisions, and approval gates still pending. Never copy secrets, private email bodies, personal data, tokens, or private connector identifiers into the public repository.

Native systems remain authoritative for their own state: GitHub for code/PR/checks, Gmail for messages/drafts, Vercel for deployments, and scheduled task infrastructure for automations. Re-verify native state before taking consequential action.

## Codex branch and intent discipline

Codex and every other coding agent must treat branch/PR creation as a controlled operation, not a disposable scratchpad.

### Equivalent-work preflight

Before creating a material branch, replacement branch, or PR:

1. Read current `main` and current open PRs in GitHub.
2. Search active branch names and relevant `specs/changes/*` for equivalent intent.
3. Check the durable work queue for an existing item that owns the task.
4. If equivalent work exists, resume, rebase, or update that work instead of creating a sibling attempt.
5. Record the preflight and any superseded branch/PR in the PR body.

A failed attempt is not permission to create another branch. Diagnose the failure on the existing line of work unless the branch is irrecoverable; if replacement is unavoidable, explicitly close/supersede the prior line first.

### One intent, one active branch

At any point, one material intent should map to one active implementation branch and at most one open PR. Parallel speculative implementation is prohibited unless the founder explicitly requests competing prototypes.

- Do not create timestamped, numbered, `-v2`, `-retry`, `-fix2`, or similar sibling branches for the same intent.
- Rebase the existing branch onto current `main` instead of cloning its intent into a new branch.
- If scope splits into genuinely independent work, create separate specs and queue items before splitting branches.
- State-only reconciliation must not compete with a branch that already owns the same reconciliation scope.

### Stop conditions

Stop implementation and reconcile before continuing when any of these become true:

- current `main` moved in a way that changes the task assumptions;
- another PR now owns the same intent;
- the durable queue contradicts native GitHub/Vercel/Supabase state;
- implementation reveals a new product, security, data, or consent decision;
- a release-sensitive change cannot be verified before production.

Do not respond to a stop condition by spawning a replacement branch.

## Required engineering workflow

For material repository changes:

1. Read the boot sequence above.
2. Complete the Equivalent-work preflight.
3. Create or update `specs/changes/<change-name>/proposal.md`.
4. Add `design.md` if architecture/data/security/consent changes.
5. Create `tasks.md`.
6. Implement on the single active non-`main` branch for that intent.
7. Run relevant tests and QA workflows.
8. Open or update one PR using `.github/PULL_REQUEST_TEMPLATE.md`.
9. Merge only after required checks and review conditions are met.
10. Verify production after deployment when production behavior changes.
11. Confirm the production release-audit report exists for the deployed SHA.
12. Update `specs/current/` and durable agent state to match shipped reality.

## Preview deployment discipline

Vercel previews are a review resource, not a substitute for iterative engineering checks.

- GitHub QA should run throughout implementation.
- Preview deployments are opt-in on non-production branches to preserve the Vercel build quota.
- Add `[preview]` to a commit message when a browser preview is intentionally required.
- Normal branch commits without `[preview]` are ignored by the repo-owned Vercel preview gate.
- `main`/production deployments always build and are never skipped by preview optimization.
- Never skip final production verification required by a change spec.

## Scope and approval discipline

If implementation reveals a new product decision, stop expanding scope and record it as unresolved. Never silently turn an implementation detail into permanent policy.

Approval gates in `agent-system/registry.json` survive model changes, context compaction, and handoffs. Preparation is not approval. A new agent must not infer permission from the fact that a previous agent drafted, staged, or discussed an external action.
