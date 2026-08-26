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

`PROJECT_CONTEXT.md` explains durable founder intent and strategy. `specs/current/*` remains authoritative for shipped product behavior. The control plane preserves operational state between agents and context windows; it does not replace the constitution or specs.

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

## Required engineering workflow

For material repository changes:

1. Read the boot sequence above.
2. Create or update `specs/changes/<change-name>/proposal.md`.
3. Add `design.md` if architecture/data/security/consent changes.
4. Create `tasks.md`.
5. Implement on a non-`main` branch.
6. Run relevant tests and QA workflows.
7. Open a PR using `.github/PULL_REQUEST_TEMPLATE.md`.
8. Merge only after required checks and review conditions are met.
9. Verify production after deployment when production behavior changes.
10. Update `specs/current/` and durable agent state to match shipped reality.

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