# Current Spec: Weekend Brief

## Purpose

Weekend Brief is Mission Rated’s email signup experience for bringing useful local weekend information directly to subscribers.

## Current user promise

The signup experience collects an email address and communicates that subscribers can unsubscribe.

## Current backend contract

- The signup endpoint is public and unauthenticated by design.
- Requests are subject to origin checks, email validation, honeypot protection, and rate limiting.
- New valid signups can become active.
- Duplicate submissions for already-active subscribers are idempotent.
- Explicitly unsubscribed/inactive subscribers are not silently reactivated by the public signup flow.
- Re-subscription requires a deliberate flow rather than an implicit public-signup upsert.
- Historical consent and unsubscribe state must be preserved appropriately.
- Service-role credentials remain server-side.
- Responses should not be cached.

## Trust and consent semantics

A successful public signup response means the backend accepted an active subscription. Mission Rated must not report a subscriber as active when the backend rejected or withheld activation.

The consent-safety defect previously tracked in GitHub issue #28 is resolved. This spec records the shipped contract so future growth work does not regress unsubscribe semantics while optimizing Weekend Brief conversion.
