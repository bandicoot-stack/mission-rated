# Design: AI Governance Evidence Gate

## Approach
This is a governance/specification change, not a new runtime service. Integrate governance into the existing constitution/spec/QA model so every future implementation uses the same evidence semantics.

## Governance matrix

| Principle | Growth implementation | Failure behavior |
|---|---|---|
| Lineage/versioning | Git history for prompts/specs/code; provenance for source-backed facts | Do not publish untraceable material changes as verified truth |
| Accountability | One bounded role per workflow; founder owns policy/commitments | Stop at role boundary and surface evidence |
| Observability | Agent health, release health, event integrity, data freshness, KPI health | Mark affected metric/workflow unhealthy/unavailable |
| Cross-functional governance | Builder + independent Growth QA for trust/KPI behavior | Block release on unmet trust/evidence criteria |
| Fairness/bias | Sponsor/payment isolation; inspect ranking/category/geography effects | Remove/disable biased or payment-leaking ranking behavior |
| Safe failure | Truthful pending/unavailable states and rollback paths | Fail closed rather than fabricate/infer |
| SLO→KPI | Availability, freshness, subscriber confirmation, attribution, savings accuracy | Connect breach to affected user/business KPI |
| Data governance | Provenance, freshness, confidence, validation, minimization | Reject stale/unsupported inputs from authoritative state |
| Explainability/auditability | Explain source/status/calculation and preserve state history | Do not present opaque trust/KPI claims |
| Human in loop | Human gate for commitments, spend, policy, disputed trust, destructive actions | Agent recommends; human decides |
| Evidence Before Automation | Authority cannot exceed evidence quality | Downgrade to uncertain/pending or fail closed |

## Growth evidence contracts

### Exclusive offer
Authoritative state requires direct partner/business confirmation or another explicit, attributable source that supports exclusivity. A public military discount alone does not establish Mission Rated exclusivity.

### Savings ledger
`documented_savings` requires both defensible calculation inputs and a KPI-eligible outcome state. A percentage discount without transaction basis may describe the offer but cannot generate an arbitrary dollar-savings record.

### Deal funnel
Preserve `view`, `outbound`, `claim`, `redemption`, and `confirmed_redemption` as semantically different events/states. Only states explicitly approved by the metric definition contribute to documented savings.

### Weekend Brief
Preserve signup attempt separately from authoritative subscription success. The subscriber system/provider or authoritative subscriber store determines confirmed subscriber status.

### Share/referral
A share action may be counted when accepted by analytics. A referred visit/conversion requires independently observed referral attribution; creating a referral URL alone is not a referred session.

### Release health
CI pass, merge, deployment READY, and production verification are distinct states. Production-live/healthy claims require the final production verification required by the constitution.

## Privacy/security
Do not add personal data solely for governance. Prefer aggregate measurement health, opaque event IDs where needed, and existing authorization boundaries. Do not log secrets or private subscriber/business data into governance artifacts.

## Rollback
Because this change is documentation/governance only, rollback is a normal Git revert. Runtime implementations that follow it must define their own reversible migration/feature rollback where applicable.
