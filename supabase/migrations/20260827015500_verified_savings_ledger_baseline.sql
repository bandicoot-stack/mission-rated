-- Growth MVP: defensible savings ledger baseline.
-- This migration is intentionally additive and reversible. It does not backfill,
-- infer, or fabricate savings. Rows must represent observed/verified redemption value.

alter table public.verified_savings
  add column if not exists valuation_basis text,
  add column if not exists evidence_url text,
  add column if not exists occurred_at timestamptz,
  add column if not exists attribution text;

comment on column public.verified_savings.amount_cents is
  'Verified savings per redemption in cents; never estimated from an unobserved basket.';
comment on column public.verified_savings.redemption_count is
  'Count of redemptions supported by the same evidence/basis.';
comment on column public.verified_savings.valuation_basis is
  'Human-readable calculation basis, e.g. published retail price minus verified paid price.';
comment on column public.verified_savings.evidence_url is
  'Source supporting the retail/offer value when a public source exists.';
comment on column public.verified_savings.occurred_at is
  'When the redemption/savings event occurred, distinct from when it was verified.';
comment on column public.verified_savings.attribution is
  'How Mission Rated attribution was established; must not imply attribution without evidence.';

alter table public.verified_savings
  add constraint verified_savings_amount_nonnegative
  check (amount_cents >= 0) not valid,
  add constraint verified_savings_redemption_count_positive
  check (redemption_count > 0) not valid;

create index if not exists verified_savings_deal_id_idx
  on public.verified_savings (deal_id);
create index if not exists verified_savings_verified_at_idx
  on public.verified_savings (verified_at desc);
