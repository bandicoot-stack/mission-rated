# Mission Rated current system state

Verified: 2026-08-10

This file is an operational snapshot for the Hampton Roads beta. Supabase, GitHub, and Vercel remain the sources of truth; update this snapshot when material counts or deployment architecture changes.

## Supabase beta data

- Businesses: 14
- External business signals: 10
- Hampton Roads installations: 5
- Installation signals: 14
- Mission Rated community reviews: 0
- Deals: 0
- Latest external business signal observed: 2026-08-10T01:27:55Z
- Latest installation signal observed: 2026-08-10T08:34:43Z
- Added official Navy MWR childcare operating-hour signals for Naval Station Norfolk (Willoughby CDC) and Naval Medical Center Portsmouth (Portsmouth CDC).

## Data integrity rules

- External/public ratings are signals, not Mission Rated scores.
- Mission Rated scores remain unpublished until sufficient first-party community data exists and a confidence threshold is defined.
- Business identity/location should use first-party provenance where practical.
- Imported signals retain source, source URL, observation time, scale/sample size where available, and confidence.
- Do not fabricate reviews, scores, deals, ownership claims, or discounts.

## Platform health

- Supabase security advisor: no current security lints.
- Supabase performance advisor: only informational unused-index notices at current beta traffic levels; no indexes removed.
- Vercel production project: `mission-rated-beta`.
- Current production deployment state checked as READY on 2026-08-10.
- Vercel runtime errors: none detected in the prior 24-hour window at verification time.

## Current product gaps

1. The front end should read source-backed business/install data from Supabase rather than requiring static redeploys for data refreshes.
2. Mobile/iPhone layout must remain part of deployment QA, including explicit horizontal-overflow checks.
3. Community review and Mission Score surfaces should remain empty-state-safe until real Mission Rated submissions exist.
4. Newsletter/signup capability is planned, but military members, veterans, spouses, and families should remain free users; no paid service should be introduced without founder approval.

## Repository privacy

Repository visibility was still public at verification time. The founder has requested private visibility; changing repository visibility remains an owner/admin settings action and should be verified after it is changed.
