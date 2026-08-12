import { BadgeCheck, MapPin, ShieldCheck, Star } from "lucide-react";
import type { BusinessCardData } from "@/lib/types";

export function BusinessCard({ business, preview }: { business: BusinessCardData; preview: boolean }) {
  return (
    <article className="business-card">
      <div className="card-topline">
        <span className="eyebrow">{business.category}</span>
        {business.sponsored && <span className="sponsored">Sponsored</span>}
      </div>
      <h3>{business.name}</h3>
      <div className="business-meta">
        <span><MapPin size={15} /> {business.distance ?? "Near your installation"}</span>
        {business.verified && <span><BadgeCheck size={15} /> Verified</span>}
      </div>
      <div className="score-row">
        <div className="score-badge" aria-label={business.missionScore ? `Mission Score ${business.missionScore}` : "Mission Score pending"}>
          <Star size={18} fill="currentColor" />
          <strong>{business.missionScore?.toFixed(1) ?? "—"}</strong>
        </div>
        <div><b>Mission Score</b><small>{business.reviewCount ? `${business.reviewCount} community reviews` : "Not yet rated"}</small></div>
      </div>
      {business.deal ? (
        <div className="deal"><ShieldCheck size={18} /><span><b>{business.dealVerified ? "Verified military deal" : preview ? "Deal preview" : "Military deal"}</b>{business.deal}</span></div>
      ) : <div className="deal muted"><ShieldCheck size={18} /><span><b>No active deal</b>Check back for updates</span></div>}
      <a className="card-link" href="#how-it-works">View business <span>→</span></a>
    </article>
  );
}
