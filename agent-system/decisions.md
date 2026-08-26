# Mission Rated Agent Decision Ledger

## Settled

### 2026-08-26 — Operator-managed architecture
Mission Rated will use an Operator-as-manager pattern with bounded specialist roles rather than a loose autonomous swarm. Specialists return structured evidence; the Operator owns queue state, recovery, and handoffs.

### 2026-08-26 — Context windows are not durable memory
Chat context is an execution cache. Durable operational truth that another agent needs must be written to repository checkpoints, specs, issues/PRs, or remain in the authoritative external system.

### 2026-08-26 — Native systems remain authoritative
GitHub owns code/PR/check truth, Gmail owns email/draft truth, Vercel owns deployment truth, and scheduled-task infrastructure owns automation truth. The public repo stores only safe summaries and references.

### 2026-08-26 — Human approval survives model changes
Changing models, tools, or context windows never removes an approval gate. An agent cannot infer approval because a previous agent drafted or prepared an action.

## Unresolved

- Whether future control-plane queue state should remain JSON-in-Git or move to a database once concurrent agent writes become common.
- Whether specialist roles should eventually become separate runtime agents or remain logical roles executed by one capable Operator for most work.
- Which additional workflows deserve reusable skills after usage data shows repeated effort.