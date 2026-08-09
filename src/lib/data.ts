import { normalizeBusiness, normalizeInstallation } from "./normalize";
import { createClient } from "./supabase/server";
import { hasSupabaseEnv } from "./supabase/env";
import type { HomepageData } from "./types";

const preview: HomepageData = {
  source: "preview",
  installations: [
    { id: "naval-station-norfolk", name: "Naval Station Norfolk", region: "Hampton Roads" },
    { id: "jble", name: "Joint Base Langley–Eustis", region: "Hampton Roads" },
    { id: "nas-oceana", name: "NAS Oceana", region: "Hampton Roads" },
  ],
  businesses: [
    { id: "preview-1", name: "Your trusted local business", category: "Home services", distance: null, missionScore: null, reviewCount: 0, deal: "Verified military deals will appear here", dealVerified: false, verified: false, sponsored: false },
    { id: "preview-2", name: "A military spouse-owned business", category: "Professional services", distance: null, missionScore: null, reviewCount: 0, deal: null, dealVerified: false, verified: false, sponsored: false },
    { id: "preview-3", name: "A neighborhood favorite", category: "Food & drink", distance: null, missionScore: null, reviewCount: 0, deal: null, dealVerified: false, verified: false, sponsored: false },
  ],
};

export async function getHomepageData(): Promise<HomepageData> {
  if (!hasSupabaseEnv()) return preview;
  try {
    const supabase = await createClient();
    const [{ data: installationRows }, { data: businessRows }] = await Promise.all([
      supabase.from("installations").select("*").limit(12),
      supabase.from("businesses").select("*").limit(12),
    ]);
    const businessesRaw = (businessRows ?? []) as Record<string, unknown>[];
    const ids = businessesRaw.map((row) => String(row.id)).filter(Boolean);
    const [{ data: scores }, { data: deals }] = ids.length
      ? await Promise.all([
          supabase.from("business_scores").select("*").in("business_id", ids),
          supabase.from("deals").select("*").in("business_id", ids),
        ])
      : [{ data: [] }, { data: [] }];
    const scoreRows = (scores ?? []) as Record<string, unknown>[];
    const dealRows = (deals ?? []) as Record<string, unknown>[];
    const businesses = businessesRaw.flatMap((row) => {
      const score = scoreRows.find((item) => item.business_id === row.id);
      const deal = dealRows.find((item) => item.business_id === row.id);
      const item = normalizeBusiness(row, score, deal);
      return item ? [item] : [];
    });
    const installations = ((installationRows ?? []) as Record<string, unknown>[]).flatMap((row) => {
      const item = normalizeInstallation(row);
      return item ? [item] : [];
    });
    return { source: "live", installations, businesses };
  } catch (error) {
    console.error("Unable to load Mission Rated homepage data", error);
    return preview;
  }
}
