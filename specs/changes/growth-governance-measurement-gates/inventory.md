# Growth Measurement Inventory

Observed on `main` 2026-08-24. This inventory records implementation reality; it does not promote any browser event to an authoritative business outcome.

## Browser instrumentation (`analytics.js`)

| Signal | Current event | Evidence level | Notes |
|---|---|---|---|
| Page load | `page_view` | observed intent/traffic | Sent only on configured production hosts and outside embedded mode. |
| Inbound referral | `referral_visit` | observed referred session | Triggered when `mr_ref`/`ref` is present. Referral value is a dedicated pseudonymous UUID, separate from visitor ID. |
| Return visit | `return_visit` | observed traffic | Browser-local heuristic after at least 20 hours; not an authenticated returning-user identity. |
| Deal action | `deal_click` | outbound/action intent | Must not be treated as redemption or documented savings. |
| Claim action | `claim_action` | claim intent | Text/action detection only; not redemption. |
| Weekend Brief submit | `weekend_brief_signup_attempt` | attempt | Emitted on form submission detection. Must not count as subscriber. |
| Weekend Brief confirmed | `weekend_brief_signup_confirmed` | confirmed system outcome only when correctly invoked | `window.mrConfirmWeekendBriefSignup(surface)` exists and is explicitly documented to be called only after authoritative provider/server success. Presence of this helper does not prove every signup integration invokes it correctly. |
| Share | `share_action` | observed action | Server accepts the event, but browser emission must be verified at each share implementation; analytics.js intentionally does not auto-count generic Share button clicks. |

## Server ingestion (`api/event.js`)

The same-origin endpoint currently allowlists the Growth MVP events needed for the evidence ladder, including `referral_visit`, `return_visit`, `deal_click`, `share_action`, `claim_action`, `weekend_brief_signup_attempt`, and `weekend_brief_signup_confirmed`.

Sanitized Growth metadata includes target/deal context, share method, signup surface, UTM values, referral UUID, session UUID, visitor UUID, referrer host, and bounded days-since-last. The endpoint rejects originless/cross-origin browser POSTs and invalid event names.

## Authoritative KPI status

| KPI | Status | Reason |
|---|---|---|
| Subscriber | `degraded` | Confirmed-success event exists, but each signup surface/provider callback still needs reconciliation/QA before scorecard truth. |
| Referral sessions | `degraded` | Inbound referral event and pseudonymous token exist; end-to-end share → inbound referral production validation is still required. |
| Referral conversion | `unavailable` | No authoritative join from referred session to confirmed target outcome has been verified here. |
| Claim intent | `degraded` | Browser intent event exists; production path/coverage still requires QA. |
| Redemption | `unavailable` | No evidence-backed redemption confirmation path identified in this inventory. |
| Documented savings | `unavailable` | No verified redemption + defensible savings-input ledger path identified in this inventory. Generic clicks/claims contribute $0. |
| Exclusive offer | `unavailable` for automation | Must remain explicit partner-confirmed provenance; featured/sponsored state is not evidence of exclusivity. |

## Fail-closed rules

1. `weekend_brief_signup_attempt` never increments subscriber KPI.
2. `deal_click` and `claim_action` never increment redemption or documented savings.
3. `share_action` never implies a referred session or referral conversion.
4. `referral_visit` never implies a downstream conversion.
5. Missing or unverified authoritative paths remain `degraded`/`unavailable`; do not estimate them.
6. Public savings counters must remain absent/disabled until a healthy redemption + savings evidence path exists.

## Next implementation slice

The highest-value next slice is an authoritative redemption/savings path with explicit evidence type and defensible fixed-savings or price-delta inputs. Until that exists, optimize and report deal intent separately from documented savings.
