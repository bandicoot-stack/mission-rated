# Proposal: AI Governance Evidence Gate

## Problem
Mission Rated increasingly uses agents and automation for growth product work, deal research, distribution, QA, analytics, and data enrichment. Existing constitutional trust rules are strong, but the system needs one explicit rule that prevents uncertain automation output from silently becoming production truth or a business KPI.

Recent examples of the risk class include treating a form submission as a confirmed subscriber, an outbound merchant click as a redemption/savings event, or merged code as production-live before deployment verification.

## Decision
Adopt the 10-principle AI/agent governance model tracked in issue #84 and add an explicit Mission Rated principle: **Evidence Before Automation**.

Automation authority is bounded by evidence quality:

1. **Verified evidence** — automation may act within its approved scope and preserve provenance/audit history.
2. **Supported but uncertain evidence** — automation may assist or present the result only with visible confidence/provenance; it may not promote the result into a definitive trust or KPI state.
3. **Missing/contradictory evidence** — fail closed. Do not infer verification, exclusivity, redemption, savings, subscriber success, ranking authority, or production health.
4. **Human commitment/policy required** — automation prepares evidence and a recommendation; a human approves the commitment or policy decision.

## Applies to
- exclusive-offer verification and status;
- savings calculations and the savings ledger;
- deal claims, outbound intent, redemption and confirmed redemption;
- Weekend Brief signup attempt vs confirmed subscription;
- share/referral attribution;
- rankings/recommendations and sponsor separation;
- researched business/deal facts and provenance;
- deployment/release health;
- agent-generated actions that affect external parties, money, trust, privacy, authorization, or irreversible state.

## Required state separation
Growth measurement must not collapse intent into outcome. At minimum, systems must preserve distinct states where relevant:

`view → intent/action attempt → accepted/recorded → externally or authoritatively confirmed → KPI-eligible outcome`

Examples:
- `signup_attempt` is not `confirmed_subscriber`.
- `merchant_outbound` is not `redemption`.
- `claim` is not `confirmed_redemption`.
- `estimated/potential savings` is not `documented_savings`.
- `merged` is not `production_verified`.

## Human approval boundaries
Human approval remains required for external partner commitments/outreach unless pre-authorized, exclusive-deal confirmation when evidence is ambiguous, spend or paid-plan changes, major ranking/scoring policy, disputed trust decisions, destructive/irreversible production actions, and any broadening of consent semantics.

## Growth scorecard rule
A growth KPI is reportable as authoritative only when its source event/state satisfies the evidence gate. Measurement health must be visible alongside growth. If attribution, subscriber confirmation, redemption evidence, or savings calculation is unhealthy, affected KPI values must be marked unavailable/unconfirmed rather than silently reported.

## Acceptance criteria
- Repository governance documentation defines the 10 principles and Evidence Before Automation.
- Active growth workflows can be mapped to evidence inputs, authoritative outcome, failure behavior, and human approval boundary.
- QA has an explicit check that intent/attempt events are not counted as confirmed outcomes.
- Savings reported as documented savings require defensible source inputs and a qualifying outcome state.
- Paid/sponsored status cannot affect ratings, Mission Score, verification, review treatment, or organic rank.
- Production status is not considered healthy until user-facing production behavior is verified.
- The governance addition creates no paid dependency and does not broaden collection of personal data.

## Non-goals
- Building a separate governance application or dashboard in this change.
- Introducing a new AI vendor/model.
- Changing user-facing ranking, rating, verification, or deal policy beyond making existing evidence boundaries explicit.
- Treating governance paperwork as a substitute for tests, observability, or production verification.
