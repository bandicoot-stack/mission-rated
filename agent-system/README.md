# Mission Rated Agent Control Plane

This directory is the durable operational memory for agents. It exists so a new capable model can recover work safely without prior chat history.

## Boot sequence
1. Read `MISSION_RATED_CONSTITUTION.md`.
2. Read `PROJECT_CONTEXT.md`.
3. Read `AGENTS.md`.
4. Read this file.
5. Read `state.json` and `work-queue.json`.
6. Read only the relevant `specs/current/*`, active change spec, and skill file(s).
7. Verify external state in its native system before taking side effects.

## Authority order
1. Safety, legality, privacy, security, consent.
2. Mission Rated Constitution.
3. Explicit founder intent.
4. Approved specs and current repository truth.
5. Durable control-plane state.
6. Agent inference.

If these conflict, stop and surface the conflict. Never silently convert an inference into product policy.

## Operator pattern
Mission Rated uses an Operator-as-manager model. The Operator owns triage, queue state, recovery, and handoffs. Specialists perform bounded work and return evidence:
- Scout — research and provenance.
- Partner — partnerships and outreach preparation.
- Product — requirements/specs.
- Builder — implementation.
- QA — independent verification/release evidence.

A role can be performed by the same model in a small task; role boundaries still apply.

## Durable checkpoint rule
Before yielding, switching models, ending a long task, or handing off, update durable state when the operational truth changed. A good checkpoint records: objective, status, next action, settled decisions, evidence, external side effects already performed, and approval gates still pending.

## Native systems of record
Do not duplicate private/native state into Git. GitHub is authoritative for code/PRs/issues, Gmail for messages/drafts, Vercel for deployments, and scheduled task infrastructure for recurring automations. Store only safe summaries and references needed to resume work.

## Staleness
Treat `state.json` and queue entries as hints if their timestamps are old. Re-verify fast-changing external facts before acting.

## Handoffs
Use `HANDOFF_TEMPLATE.md`. A receiving agent should be able to resume from the handoff plus repo/native evidence without the previous conversation.

## Skills
Use `skills/` for repeated procedures. Skills are playbooks, not policy. If a skill conflicts with the constitution, current spec, or explicit founder instruction, the higher authority wins.