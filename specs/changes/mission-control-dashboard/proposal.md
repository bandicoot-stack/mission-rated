# Change Proposal: Mission Rated Command Center

## Why
The founder currently has to infer Mission Rated's operational state through chat conversations and separate native tools. The persistent agent control plane already provides durable repository-backed state, but there is no visual operating surface for it.

## What changes
- Add a no-index founder-facing `mission-control.html` dashboard.
- Render the logical agent roster directly from `agent-system/registry.json`.
- Render current focus, active change, next action, settled decisions, and timestamps from `agent-system/state.json`.
- Render stable work items, owners, status, next action, and founder approval gates from `agent-system/work-queue.json`.
- Show external source-of-truth systems (GitHub, Vercel, Gmail, scheduled automations) as a distinct integration layer rather than copying private connector state into the public repository.
- Reserve a business cockpit for savings, audience, partner, and release-health telemetry as those sources are wired into a safe authenticated backend.

## Guardrails
- Do not add the dashboard to consumer navigation or sitemap.
- Keep `noindex,nofollow` metadata on the page.
- Do not place secrets, private email content, connector identifiers, or personal data in repository-backed dashboard JSON.
- Do not present external system status as live until it is actually sourced from the authoritative system.

## Success criteria
The founder can open one page and immediately answer: what Mission Rated is focused on, which agents own which domains, what work is active or blocked, and what requires founder approval.
