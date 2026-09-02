# Design: Withdraw Public Founder Status Snapshot

## Decision

Treat `status.html` and `mission-control-metrics.json` as repository-only operational artifacts until Mission Rated has an authenticated server-side founder authorization boundary. The release build is the enforcement point: neither artifact is copied to `dist/`.

## Why this approach

The existing `scripts/qa-operational-exposure.mjs` already defines `dist/mission-control-metrics.json` as forbidden. Removing the release-copy entries restores alignment between the build and the security contract without inventing a new auth mechanism during an incident fix.

## Security properties

- No client-side password or hidden URL is introduced.
- No secrets or tokens are added.
- No authorization is weakened.
- Source remains available in Git for later authenticated implementation.
- The existing fail-closed `mission-control-metrics` Edge Function remains unchanged.

## Deployment impact

After merge through the normal release path, `/status.html` and `/mission-control-metrics.json` should no longer be present in the production release. Production verification should confirm the public metrics path is unavailable.