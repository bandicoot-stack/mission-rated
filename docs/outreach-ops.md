# Mission Rated Outreach Operating System

Mission Rated outreach is a relationship and verification workflow, not a bulk-email engine.

## Lanes

1. **Business outreach** — verify listings, military discounts, and useful military-family information.
2. **Military-connected founders** — prioritize veteran- and military-spouse-owned businesses for verification and founder stories.
3. **Creator outreach** — request permission and participation for Hampton Roads Local Intel content.
4. **Community outreach** — build relationships with organizations that serve military families and preserve official-source provenance.

## Pipeline

`researched -> ready -> contacted -> follow_up -> interested -> partner`

Terminal/hold states: `not_interested`, `paused`.

## Priority

- **P1**: veteran/spouse-owned businesses and highest-value community relationships.
- **P2**: unclaimed Hampton Roads businesses and active creator candidates.
- **P3**: claimed/current businesses that need periodic value verification.
- **P4/P5**: low-confidence or long-horizon prospects.

## Operating rules

- Personalize before sending. Do not bulk-spam the queue.
- Ratings, verification, and organic rank are never sold.
- Paid visibility must remain separate from earned ratings and verification.
- Creator content requires permission or a supported public embed/use path; preserve attribution.
- Deal outreach asks for an official source, eligibility, terms, and expiration when available.
- Keep opt-outs and `not_interested` status respected.
- Do not fabricate endorsements, reviews, discounts, ownership status, or partnerships.

## Weekly scorecard

Track: researched, ready, contacted, positive replies, interested, partners, verified offers added, creator permissions, Weekend Brief referrals, and follow-ups due.

Initial operating target: 75 personalized outreaches/week across the four lanes, with humans handling positive replies and relationship conversations.

## Data model

Server-controlled Supabase tables:

- `outreach_prospects`
- `outreach_activities`
- `outreach_templates`

The tables have RLS enabled and no `anon`/`authenticated` access grants. They are intentionally internal operating data.
