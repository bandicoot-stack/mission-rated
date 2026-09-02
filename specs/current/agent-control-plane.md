# Current Spec: Agent Control Plane

## Purpose
Mission Rated agents must be able to recover durable product and operational context from the repository without depending on a prior chat context window.

## Boot contract
`AGENTS.md` is the repository bootloader. Material work begins by reading the constitution, project context, `agent-system/README.md`, durable state/queue, and then only the relevant current/change specs and skills.

## Operating model
Mission Rated uses an Operator-as-manager pattern with logical specialist roles defined in `agent-system/registry.json`: Operator, Scout, Partner, Product, Builder, and QA. A single capable model may perform multiple logical roles, but authority boundaries and approval gates remain enforced.

## Durable state contract
- `agent-system/state.json` provides a compact durable checkpoint.
- Reconciliation data inside `state.json` is a timestamped **external-state snapshot**, not live authority. A commit that updates the checkpoint necessarily changes repository state after the observation was made, so volatile fields use `observed_*` names and remain valid as historical evidence rather than pretending to be current.
- Before material work, agents must reread the relevant native systems and reconcile from that fresh evidence. They must not treat a prior checkpoint SHA, PR count, deployment state, or service-health observation as current without re-verification.
- `agent-system/work-queue.json` provides stable task IDs, status, role ownership, timestamps, next action, evidence, and approval gates.
- `agent-system/decisions.md` distinguishes settled decisions from unresolved questions.
- `agent-system/HANDOFF_TEMPLATE.md` defines the minimum durable handoff.
- `agent-system/skills/*` contains reusable procedures for repeated workflows.

## External-state contract
Private/native state remains in its authoritative system. GitHub owns code/PR/check state, Gmail owns messages/drafts, Vercel owns deployment state, Supabase owns live database/function health, and scheduled task infrastructure owns automation state. Repository checkpoints may record what was observed and when, but they do not supersede those native systems. The public repository must not store secrets, private email bodies, personal data, tokens, or private connector identifiers.

## Approval contract
Approval gates survive context compaction, model changes, and handoffs. Preparation or drafting is not approval. Agents may not infer permission for consequential side effects because a previous agent staged or discussed them.

## QA contract
`npm run qa` includes `scripts/qa-agent-system.mjs`, which validates required control-plane files, role registry fields, queue schema/statuses/owners/timestamps, bootloader references, and explicit external-state snapshot semantics so volatile native state cannot be mislabeled as live repository truth.
