"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness, Building2, Car, ChevronDown, GraduationCap, HandCoins,
  HeartPulse, Home, Menu, PawPrint, Search, ShieldCheck, ShoppingBag, Tag,
  Tickets, Truck, UtensilsCrossed, Wrench, X
} from "lucide-react";
import type { HomepageData } from "@/lib/types";
import { Logo } from "./logo";
import { BusinessCard } from "./business-card";

const nav = [
  ["Explore", "#explore"], ["Deals", "#deals"], ["Reviews", "#reviews"],
  ["Resources", "#resources"], ["About", "#about"]
] as const;

const categories = [
  { name: "Auto", query: "auto", icon: Car },
  { name: "Home", query: "home", icon: Home },
  { name: "Dining", query: "food", icon: UtensilsCrossed },
  { name: "Health", query: "health", icon: HeartPulse },
  { name: "Pets", query: "pet", icon: PawPrint },
  { name: "Fitness", query: "fitness", icon: HeartPulse },
  { name: "Services", query: "service", icon: Wrench },
  { name: "Fun", query: "entertainment", icon: Tickets },
];

const resources = [
  { title: "PCS & Moving", note: "Local movers, storage, transport & more", icon: Truck },
  { title: "Schools", note: "Find the right fit for your kids", icon: GraduationCap },
  { title: "Jobs", note: "Opportunities near your next duty station", icon: BriefcaseBusiness },
  { title: "Housing", note: "Neighborhoods, agents and resources", icon: Home },
  { title: "Marketplace", note: "Buy, sell and trade locally", icon: ShoppingBag },
  { title: "Price Check", note: "Know when you're getting a fair deal", icon: Tag },
  { title: "Benefits", note: "Maximize what you've earned", icon: ShieldCheck },
];

export function HomePage({ data }: { data: HomepageData }) {
  const [query, setQuery] = useState("");
  const [installation, setInstallation] = useState(data.installations[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScore, setShowScore] = useState(false);

  const activeInstallation = data.installations.find((item) => item.id === installation) ?? data.installations[0];
  const businesses = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return data.businesses;
    return data.businesses.filter((item) => `${item.name} ${item.category} ${item.deal ?? ""}`.toLowerCase().includes(term));
  }, [data.businesses, query]);
  const deals = data.businesses.filter((item) => item.deal).slice(0, 4);

  function jump(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main id="top" className="app-shell">
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
        </nav>
        <a className="business-cta" href="#about"><Building2 size={16} /> For Businesses</a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        {menuOpen && <nav className="mobile-nav">{nav.map(([label, href]) => <a href={href} onClick={() => setMenuOpen(false)} key={label}>{label}</a>)}</nav>}
      </header>

      <section className="dashboard-hero" id="explore">
        <div className="hero-texture" aria-hidden="true" />
        <div className="hero-main">
          <span className="welcome">HAMPTON ROADS BETA</span>
          <h1>Hampton Roads</h1>
          <div className="hero-accent" />
          <p>Real businesses. Honest reviews.<br />Built by the community. Free for military families.</p>

          <div className="hero-search" role="search">
            <label className="hero-query"><Search size={22} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search businesses, services, or deals…" /></label>
            <label className="hero-install"><span>Installation</span><select value={installation} onChange={(e) => setInstallation(e.target.value)}>{data.installations.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><ChevronDown size={16} /></label>
          </div>

          <div className="category-rail">
            {categories.map(({ name, query: categoryQuery, icon: Icon }) => <button key={name} onClick={() => { setQuery(categoryQuery); jump("#businesses"); }} className={query.toLowerCase() === categoryQuery ? "active" : ""}><Icon /><span>{name}</span></button>)}
            <button onClick={() => setQuery("")}><span className="more-dots">•••</span><span>More</span></button>
          </div>
        </div>

        <aside className="mission-score-panel">
          <span className="panel-label">MISSION SCORE</span>
          <button className="score-ring" onClick={() => setShowScore(!showScore)} aria-expanded={showScore}><strong>—</strong><span>COMMUNITY<br />POWERED</span></button>
          <ul><li>Military-specific criteria</li><li>Verified community reviews</li><li>Confidence adjusted</li><li>Never influenced by payment</li></ul>
          <button className="text-link" onClick={() => setShowScore(!showScore)}>See how it works →</button>
          {showScore && <div className="score-explainer"><b>How scoring works</b><p>Mission Score combines trust, military knowledge, responsiveness, price transparency, PCS friendliness and recommendation signals. New businesses stay unrated until real community data exists.</p></div>}
        </aside>
      </section>

      <section className="dashboard-grid section-wrap" id="businesses">
        <div className="business-panel">
          <div className="panel-heading"><div><span className="eyebrow">COMMUNITY PICKS</span><h2>Top Rated Near You</h2></div><button onClick={() => setQuery("")}>View All</button></div>
          {data.source === "preview" && <div className="preview-notice"><Building2 size={17} /><span><b>Preview mode.</b> Placeholder businesses are clearly labeled until production data is connected.</span></div>}
          <div className="business-grid">{businesses.slice(0, 4).map((business) => <BusinessCard key={business.id} business={business} preview={data.source === "preview"} />)}</div>
          {!businesses.length && <div className="empty-state"><Search size={26} /><h3>No matches yet</h3><p>Try another category or clear your search.</p><button onClick={() => setQuery("")}>Clear search</button></div>}
        </div>

        <aside className="deals-panel" id="deals">
          <div className="panel-heading"><div><span className="eyebrow">FRESH OFFERS</span><h2>Military Deals</h2></div><span className="count-pill">{deals.length}</span></div>
          {deals.length ? deals.map((business) => <a className="deal-row" href="#businesses" key={business.id}><span className="deal-avatar">{business.name.slice(0, 2).toUpperCase()}</span><span><b>{business.name}</b><small>{business.deal}</small></span><span>→</span></a>) : <div className="deal-empty"><HandCoins /><b>Verified offers are coming online</b><p>We only show deals we can trace and verify.</p></div>}
        </aside>
      </section>

      <section className="resource-strip section-wrap" id="resources">
        {resources.map(({ title, note, icon: Icon }) => <a href="#coming-soon" key={title}><Icon /><span><b>{title}</b><small>{note}</small></span><span>→</span></a>)}
      </section>

      <section className="trust-band section-wrap" id="reviews">
        <div className="trust-title"><ShieldCheck /><div><span className="eyebrow">MISSION RATED PROMISE</span><h2>By military families, for military families.</h2></div></div>
        <div className="trust-points"><div><b>Free for Military Families</b><span>Always and forever.</span></div><div><b>Mission Scores Are Never for Sale</b><span>Honest. Transparent. Trusted.</span></div><div><b>Businesses Pay for Visibility</b><span>Not ratings. Never influence.</span></div></div>
      </section>

      <section className="about-panel section-wrap" id="about">
        <div><span className="eyebrow">THIS IS YOUR COMMUNITY</span><h2>Help it grow.</h2><p>Share real experiences, support great local businesses, and help the next military family make a confident decision.</p><div className="action-row"><a href="#coming-soon" className="primary-action">Add a Review</a><a href="#coming-soon" className="secondary-action">Claim Your Business</a></div></div>
        <div className="promise-card"><b>THE PROMISE</b><ul><li>Families use Mission Rated free</li><li>Businesses may pay for visibility, never ratings</li><li>Reviews and scores belong to the community</li><li>Deals must be verifiable</li></ul></div>
      </section>

      <section className="coming-section" id="coming-soon">
        <div className="section-wrap coming-inner"><div><span className="eyebrow">NEXT CAPABILITIES</span><h2>One trusted starting point for military life.</h2><p>PCS, housing, schools, jobs, marketplace, price checks and benefits will plug into the same installation-first experience.</p></div><a href="#top">Back to Hampton Roads ↑</a></div>
      </section>

      <footer><Logo /><p>{activeInstallation ? `Exploring around ${activeInstallation.name}` : "Hampton Roads beta"}</p><span>© 2026 Mission Rated</span></footer>
    </main>
  );
}
