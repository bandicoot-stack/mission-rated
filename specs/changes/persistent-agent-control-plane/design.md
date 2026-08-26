# Design: Persistent Agent Control Plane

## Architecture
`AGENTS.md` becomes the bootloader. It points agents to `agent-system/README.md`, which defines recovery order and authority boundaries. Durable operational state is split into small files rather than one monolithic context document.

## State model
- `registry.json`: logical roles, responsibilities, prohibited actions.
- `state.json`: small current checkpoint and active focus.
- `work-queue.json`: stable task IDs, status, role owner, timestamps, next action, evidence.
- `decisions.md`: durable product/operational decisions and unresolved questions.
- `HANDOFF_TEMPLATE.md`: required handoff contract.
- `skills/*.md`: reusable workflow procedures.

## Recovery protocol
1. Read constitution and project context.
2. Read `agent-system/README.md`.
3. Read `state.json` and `work-queue.json`.
4. Read only the relevant current/change specs and skill files.
5. Verify external/native state in its system of record before acting.
6. Update durable state before yielding or handing off.

## External-state boundary
Git stores references and safe summaries only. Gmail remains authoritative for messages/drafts, GitHub for code/issues/PRs, Vercel for deployments, and scheduled automation state for recurring tasks. Never copy credentials, private connector IDs, or full private correspondence into the repo.

## Approval gates
The registry marks actions that require explicit founder approval, including sending outreach when review is requested, public partnership claims not yet confirmed, rating/verification policy changes, destructive data operations, and production changes outside the established PR/release path.

## Validation
A Node QA script parses the JSON files, validates required keys/enums/IDs/timestamps/references, checks all required control-plane documents exist, and confirms `AGENTS.md` routes new agents through the control plane.