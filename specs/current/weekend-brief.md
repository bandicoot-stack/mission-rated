# Current Spec: Weekend Brief

## Purpose

Weekend Brief is Mission Rated’s email signup experience for bringing useful local weekend information directly to subscribers.

## Current user promise

The signup experience collects an email address and communicates that subscribers can unsubscribe.

## Current backend contract

- The signup endpoint is public and unauthenticated by design.
- Requests are subject to origin checks, email validation, and honeypot protection.
- Service-role credentials remain server-side.
- Responses should not be cached.

## Known gap

The current signup behavior may reactivate an explicitly unsubscribed/inactive address because a signup upsert writes the row back to active state and refreshes consent timing. This violates the desired consent-safety contract and is tracked in GitHub issue #28.

Until that issue is resolved, a public signup request must not be treated as a safe explicit re-subscribe flow.

## Required target semantics

- New valid signups can become active.
- Duplicate submissions for already-active subscribers are idempotent.
- Explicitly unsubscribed/inactive subscribers are not silently reactivated.
- Re-subscription requires a deliberate, separately defined confirmation flow.
- Historical consent and unsubscribe timestamps are preserved appropriately.