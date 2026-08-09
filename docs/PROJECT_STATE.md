# Project state

## Current

- Production-quality responsive beta homepage implemented.
- Hampton Roads installation-first flow implemented.
- Search and category filtering implemented client-side.
- Supabase browser/server client structure and defensive homepage repository implemented.
- Preview state clearly distinguishes placeholder UI from production data.
- Core product and technical documentation established.

## Requires production configuration

- Add Vercel environment variables from `.env.example`.
- Confirm production column names against the defensive normalizers.
- Confirm Data API grants and RLS policies permit the intended anonymous reads.
- Populate production data; no reviews or scores are seeded by this repository.

## Next product increments

1. Installation and business detail routes.
2. Authentication and profile completion.
3. Review submission/moderation and business claiming.
4. Deal verification workflow.
5. Search ranking and geospatial distance.
6. PCS & Housing, Schools, Jobs, Marketplace, Price Check, and Benefits.
