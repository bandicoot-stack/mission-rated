# Decisions

## 001 — Next.js App Router and Server Components

Use App Router and load the initial homepage dataset on the server. Interactive filtering stays in a focused client component. This limits browser JavaScript while preserving a responsive experience.

## 002 — Defensive Supabase adapter

The live schema exists outside this repository and its exact column contract is not documented here. Fetch bounded table rows and normalize only known values. Missing or failed configuration produces an explicit preview state, never invented production activity.

## 003 — Public keys only

Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Service-role and secret keys are forbidden in the frontend and examples. Authorization remains enforced through production grants and RLS.

## 004 — Trust modeled independently from monetization

`missionScore`, `sponsored`, `verified`, and deal verification are separate UI fields. Sponsored placement is labeled and cannot enter score presentation logic.

## 005 — Minimal operating footprint

Use Next.js, Tailwind, Supabase, and one small icon library. No paid services, analytics, search vendor, CMS, or additional infrastructure are introduced for beta.
