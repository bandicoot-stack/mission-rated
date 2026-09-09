# Mission Rated Analytics — Product + Growth System

## Purpose
Turn Mission Rated's existing first-party `product_events` stream into a decision system for product engineering and growth. The goal is not vanity analytics. Every metric should answer one of four questions: Are people arriving? Are they finding value? Are they taking a useful action? Are they coming back?

## North-star scorecard
1. Qualified visitors — distinct first-party visitors excluding preview/embedded traffic.
2. Engaged sessions — sessions with 2+ page views or a value action.
3. Value actions — deal outbound, official website, directions, source verification, review, share, signup.
4. Return rate — visitors returning after the 20-hour return threshold.
5. Subscriber conversion — confirmed Weekend Brief signups / unique visitors.
6. Documented savings — verified redemptions and dollars saved only; never infer savings from clicks.

## Event taxonomy
### Acquisition
- page_view
- referral_visit
- internal_navigation
- search

### Discovery
- search
- internal_navigation
- installation_change
- source_click / offer_source_click

### Intent
- deal_outbound_click
- official_website_click
- directions_click
- claim_action
- review_action
- share_action

### Conversion
- weekend_brief_signup_confirmed
- share_completed (only after actual completion signal)
- verified redemption events when backed by authoritative server data

### Feedback
- feedback_open
- feedback_action
- data_report_open

## Required dimensions
Every event should preserve where available: path, session_id, visitor_id, referrer_host, UTM source/medium/campaign, target_type, target_id, destination, event-specific metadata, and timestamp. Do not collect raw IP, full URL query strings, email addresses, free-form form contents, or sensitive military/health/profile data in analytics events.

## Dashboard UX
Founder analytics should be private/authenticated and optimized for decisions, not public vanity metrics.

### Overview
- Visitors, sessions, page views, engaged sessions
- Return rate
- Value actions and action rate
- Confirmed subscribers and signup conversion
- Verified redemptions / documented dollars saved
- 7d / 28d comparisons

### Acquisition
- Referrer and UTM source/medium/campaign
- Landing pages
- Referral visits
- Visitor-to-value-action conversion by source

### Product
- Top pages
- Navigation paths
- Searches and zero-result searches
- Business/deal/school/installation engagement
- CTA action rates
- Feedback and data-quality reports

### Growth
- Visitor → engaged → value action → subscriber funnel
- Returning visitor cohorts
- Weekend Brief conversion by surface
- Share/referral loop
- Campaign conversion

### Engineering health
- Analytics ingestion failures
- Unknown/unmapped event names
- Missing visitor/session IDs
- Pages with traffic but no measurable actions
- Event volume anomalies

## Instrumentation gaps identified 2026-09-09
The event pipeline is successfully recording page views, visitor/session IDs and return visits, but the current 7-day event stream is overwhelmingly `page_view`. The UI contains many generic external links that do not match the narrow click selectors in `analytics.js`, so product intent can be invisible even when users click useful links.

Priority fixes:
1. Standardize CTA markup with `data-analytics-action`, `data-target-type`, and `data-target-id` rather than relying on button copy.
2. Add explicit events for `external_source_click`, `search_performed`, `search_zero_results`, `filter_applied`, `listing_opened`, and `cta_impression` where useful.
3. Track fall/source cards as identifiable targets so Fall Deals & Finds can report per-listing engagement.
4. Confirm Weekend Brief only after authoritative signup success.
5. Add an authenticated founder metrics endpoint/dashboard backed by aggregate queries; do not expose raw `product_events` publicly.
6. Add automated QA ensuring every primary CTA has analytics semantics and all emitted events exist in the server allowlist.

## Product-engineering feedback loop
Weekly review should produce a ranked list of: high-traffic/low-action pages, high-action sources, failed searches, top requested data fixes, high-value listings, retention changes, and instrumentation blind spots. Each item should map to a product experiment or engineering task with a measurable expected outcome.

## Privacy and integrity
First-party pseudonymous IDs only. Honor the existing `mr_analytics_optout`. Never claim a redemption or dollars saved from a click. Never use analytics to collect sensitive personal information. Keep raw event access server-side/private and publish only aggregates where necessary.
