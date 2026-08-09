export type Installation = { id: string; name: string; region: string };

export type BusinessCardData = {
  id: string;
  name: string;
  category: string;
  distance: string | null;
  missionScore: number | null;
  reviewCount: number;
  deal: string | null;
  dealVerified: boolean;
  verified: boolean;
  sponsored: boolean;
};

export type HomepageData = {
  installations: Installation[];
  businesses: BusinessCardData[];
  source: "live" | "preview";
};
