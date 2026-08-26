# Proposal: Persistent Agent Control Plane

## Problem
Mission Rated has durable product context, governance, and specs, but active work, handoffs, decisions, and recovery state can still live inside a single chat context.

## Goal
Create a repository-native control plane so a capable incoming agent can recover current Mission Rated operational state without prior chat history.

## Principles
1. Repository state is durable; context windows are execution caches.
2. Every material handoff leaves a durable checkpoint.
3. Agent roles have explicit authority boundaries.
4. External side effects keep human-approval rules regardless of model/runtime.
5. Public Git must never store secrets, private email bodies, personal data, tokens, or connector identifiers.
6. Machine-readable state complements human-readable rationale.
7. Stale state is dangerous; checkpoints carry timestamps.

## Proposed system
Add `agent-system/` containing a boot protocol, role registry, current state, work queue, decision ledger, handoff template, reusable skills, and automated contract QA. Update `AGENTS.md` so agents boot through this control plane before material work.

## Agent model
Use an Operator-as-manager pattern with bounded specialists:
- Operator: triage, queue ownership, recovery, handoffs.
- Scout: public research, freshness, provenance.
- Partner: outreach preparation, reply triage, partnership pipeline; sending stays approval-gated.
- Product: founder intent to specs and acceptance criteria.
- Builder: implementation within approved scope.
- QA: independent verification and release evidence.

These are logical roles, not vendor-specific runtimes.

## Acceptance criteria
- [ ] One obvious boot entry point exists.
- [ ] Current priorities and active work are recoverable without chat history.
- [ ] Queue items have stable IDs, status, owner role, timestamps, next action, and evidence references.
- [ ] Settled and unresolved decisions are distinguishable.
- [ ] Handoffs capture completed work, remaining work, evidence, side effects, and approval gates.
- [ ] Private connector state is referenced only by safe descriptions.
- [ ] Role boundaries are explicit.
- [ ] Reusable skills exist for repeated workflows.
- [ ] Automated QA validates required files and machine-readable fields.
- [ ] Existing constitution/spec workflow remains authoritative.

## Non-goals
- Building a fully autonomous multi-agent runtime.
- Storing Gmail message bodies, credentials, tokens, or private connector IDs in Git.
- Replacing GitHub, Gmail, Vercel, or automations as native systems of record.
- Letting agents self-approve high-impact external side effects.

## Success condition
An unfamiliar capable model can open the repo, follow the boot protocol, explain current Mission Rated state, select a valid next task, and continue safely without asking the founder to restate prior context.