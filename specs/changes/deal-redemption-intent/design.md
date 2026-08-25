# Design: Deal Redemption Intent Instrumentation

Use the existing browser analytics pipeline and `/api/event` ingestion boundary. Add one allowlisted event name, `deal_redemption_intent`, and trigger it only from an explicit element carrying `data-deal-action="redeem"`.

The payload reuses the existing target context and `deal_source` fields. No new identifiers, storage, cookies, network destinations, or authorization behavior are introduced. The event name intentionally says `intent`: a click cannot prove redemption or savings, and downstream scorecards must not treat it as either.
