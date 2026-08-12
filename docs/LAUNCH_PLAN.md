# Beta launch plan

## 1. Data contract and security

- Verify exact columns, foreign keys, enums, and active/archive semantics for all core tables.
- Audit RLS on every exposed table and confirm explicit Data API grants for intended roles.
- Validate score computation cannot consume sponsorship or payment inputs.
- Establish review flagging, moderation, appeal, and audit procedures.

## 2. Hampton Roads readiness

- Confirm canonical installation records and service radii.
- Onboard a useful category mix without manufacturing reviews or scores.
- Verify every advertised military deal, owner claim, and spouse-owned designation.
- Prepare accessible empty states for low-density categories.

## 3. Product verification

- Test iPhone/Android and current desktop browsers.
- Run accessibility checks for keyboard flow, landmarks, contrast, zoom, and reduced motion.
- Test search, installation switching, production errors, empty datasets, and slow connections.
- Run `pnpm lint`, `pnpm test`, and `pnpm build` for every release.

## 4. Vercel release

- Connect the GitHub repository to Vercel's free tier.
- Add only the public Supabase URL and publishable key as encrypted environment variables.
- Validate preview deployment against production read policies, then promote intentionally.
- Add a custom domain only when already owned; no paid infrastructure is required.

## 5. Controlled beta

- Invite a small Hampton Roads cohort and collect structured trust/usability feedback.
- Monitor failed queries and abuse reports without recording unnecessary personal data.
- Publish score methodology and sponsored-content rules before opening broadly.
- Gate expansion on data quality, moderation capacity, and user trust—not vanity traffic.
