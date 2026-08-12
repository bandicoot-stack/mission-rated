import type { BusinessCardData, Installation } from "./types";

type Row = Record<string, unknown>;

const text = (value: unknown) => (typeof value === "string" ? value : null);
const number = (value: unknown) => (typeof value === "number" ? value : null);

export function normalizeInstallation(row: Row): Installation | null {
  const id = text(row.id);
  const name = text(row.name);
  if (!id || !name) return null;
  return { id, name, region: text(row.region) ?? text(row.market) ?? "Hampton Roads" };
}

export function normalizeBusiness(row: Row, score?: Row, deal?: Row): BusinessCardData | null {
  const id = text(row.id);
  const name = text(row.name);
  if (!id || !name) return null;
  return {
    id,
    name,
    category: text(row.category) ?? text(row.primary_category) ?? "Local service",
    distance: text(row.distance_display),
    missionScore: number(score?.mission_score) ?? number(score?.score),
    reviewCount: number(score?.review_count) ?? 0,
    deal: text(deal?.title) ?? text(deal?.description),
    dealVerified: Boolean(deal?.verified_at ?? deal?.is_verified),
    verified: Boolean(row.verified_at ?? row.is_verified),
    sponsored: Boolean(row.is_sponsored),
  };
}
