# Proposal: Optimize Vercel Preview Workflow

## Problem

Mission Rated currently allows Vercel to deploy every Git branch push. During active engineering this creates many preview deployments for spec-only, test-only, and intermediate commits, consuming deployment quota without adding useful review value.

## Goal

Reduce unnecessary Vercel preview deployments while preserving fast GitHub QA, deliberate browser previews, exact-SHA production releases, and production verification.

## Scope

- Add a repo-owned Vercel ignored-build decision command.
- Production/main deployments must never be skipped by this optimization.
- Preview commits explicitly marked `[skip preview]` are skipped.
- Preview commits containing only non-runtime files such as specs, docs, markdown, or GitHub workflow metadata are skipped automatically.
- Runtime-impacting preview changes continue to deploy unless explicitly marked `[skip preview]`.
- Document the engineering convention so agents batch work and reserve previews for review-ready milestones.
- Add QA for the ignored-build policy.

## Non-goals

- No change to Mission Rated user-facing behavior.
- No change to the Mission Rated brand or featured-partner rendering.
- No disabling of production Git deployments.
- No dependency on paid Vercel features or new secrets.

## Acceptance criteria

1. `main`/production always returns a build decision.
2. `[skip preview]` preview commits are ignored by Vercel.
3. Preview commits with only non-runtime files are ignored.
4. Preview commits with runtime-impacting changes continue to build by default.
5. The policy fails safe: uncertain/missing Git context builds instead of skipping.
6. `npm run qa` validates the deployment policy.
7. AGENTS/Deployment guidance tells engineering agents when to use `[skip preview]` and when a browser preview is required.
8. Existing exact-SHA production verification remains unchanged.
