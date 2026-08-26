# Proposal: Persistent Agent Control Plane

## Problem

Mission Rated already has strong durable product context in `PROJECT_CONTEXT.md`, governance in `MISSION_RATED_CONSTITUTION.md`, engineering rules in `AGENTS.md`, and living specs. However, active work, agent ownership, cross-agent handoffs, and recovery state can still live primarily inside an individual chat context.

When a context window ends or a different model/agent takes over, the incoming agent can reconstruct product intent but may not reliably know:

- what is actively being worked;
- which agent role owns the next action;
- what evidence has already been gathered;
- what decisions are settled versus unresolved;
- what external side effects have already happened;
- what must never be repeated without approval;
- how to resume safely after interruption.

## Goal

Create a repository-native agent control plane that lets a capable incoming agent recover Mission Rated operational state from durable files without access to previous chat history.

## Principles

1. Repository state is the durable source of truth for product and engineering work.
2. Context windows are execution caches, not permanent memory.
3. Every material handoff must leave a durable checkpoint.
4. Agent roles have explicit authority boundaries.
5. External side effects such as sending email, publishing content, or changing production require the same human-approval rules regardless of which model performs the work.
6. The public repository must never store secrets, private email contents, personal data, tokens, or sensitive connector identifiers.
7. Machine-readable state should complement human-readable rationale.
8. Stale operational state is dangerous; checkpoints must carry timestamps and status.

## Proposed system

Add an `agent-system/` control-plane directory containing:

- an architecture and boot protocol;
- a machine-readable agent registry;
- a durable current-state checkpoint;
- a work queue;
- a decision ledger;
- a handoff contract/template;
- explicit external-state boundaries;
- automated QA that validates the control-plane contract.

Update `AGENTS.md` so every agent boots through the control plane before starting material work.

## Agent roles

The first registry will define six operational roles:

- **Operator** — triage, queue ownership, routine orchestration, recovery, and handoffs.
- **Scout** — public research, freshness, entity/deal discovery, and provenance collection.
- **Partner** — partnership pipeline, outreach preparation, reply triage, and CRM-like state; sending remains approval-gated.
- **Product** — founder intent to proposal/spec/acceptance criteria.
- **Builder** — architecture and implementation within approved scope.
- **QA** — independent verification, release checks, and production verification.

These are logical roles, not assumptions about a specific LLM vendor or runtime.

## Acceptance criteria

- [ ] A new agent can identify the required boot sequence from one obvious entry point.
- [ ] Current priorities and active work can be recovered without prior chat history.
- [ ] Queue items have stable IDs, status, role ownership, timestamps, next action, and evidence references.
- [ ] Settled decisions and unresolved decisions are distinguishable.
- [ ] Handoffs record completed work, remaining work, evidence, side effects, and approval gates.
- [ ] Connector/private state is referenced only by safe descriptions, never copied into the public repository.
- [ ] Agent roles and authority boundaries are explicit.
- [ ] Automated QA fails when required control-plane files or required machine-readable fields are missing/invalid.
- [ ] Existing Mission Rated constitution/spec workflow remains authoritative and is not replaced by the control plane.

## Non-goals

- Building an autonomous multi-agent runtime in this change.
- Storing Gmail message bodies, contact lists, credentials, tokens, or private connector IDs in Git.
- Replacing GitHub, Gmail, Vercel, or scheduled automations as systems of record for their native data.
- Letting agents silently approve their own high-impact external side effects.

## Success condition

An unfamiliar capable model should be able to open the repository, follow the boot protocol, explain what Mission Rated is doing now, select a valid next task, and continue safely without asking the founder to restate prior context.