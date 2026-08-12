# Architecture

## Runtime

- Next.js App Router on Vercel's default Node.js runtime.
- Server Component homepage fetch for initial data.
- Client component limited to installation choice, navigation, and local filtering.
- Tailwind build pipeline plus authored CSS design tokens and responsive rules.

## Data flow

`page.tsx` → `getHomepageData()` → Supabase server client → `installations`, `businesses`, `business_scores`, and `deals` → defensive normalizers → serializable homepage model → client UI.

The remaining live tables (`profiles`, `business_installations`, `reviews`, `business_claims`, `business_owners`, and `review_flags`) are reserved for authenticated/detail workflows. They are not queried merely to populate the landing page.

## Security boundary

- The browser receives only the publishable key.
- Supabase RLS and Data API grants are the source of authorization truth.
- No administrative client exists in the frontend.
- Authenticated actions should use `@supabase/ssr`, validate the user server-side, and rely on ownership-aware RLS policies.
- Review moderation and score computation must be server-controlled and auditable; clients never write computed scores.

## Failure behavior

Missing configuration or unavailable tables result in a labeled preview experience. Errors are logged server-side without exposing credentials. Production deployment should add error monitoring only when an approved, cost-conscious vendor decision is made.
