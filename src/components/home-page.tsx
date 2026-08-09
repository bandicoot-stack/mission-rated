"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Building2, ChevronDown, GraduationCap, HandCoins, Home, Menu, Search, ShieldCheck, ShoppingBag, Tags, Truck, UtensilsCrossed, Wrench, X } from "lucide-react";
import type { HomepageData } from "@/lib/types";
import { Logo } from "./logo";
import { BusinessCard } from "./business-card";

const futureLinks = ["PCS & Housing", "Schools", "Jobs", "Marketplace", "Price Check", "Benefits"];
const categories = [
  { name: "Home services", icon: Home, note: "Movers, repair & more" },
  { name: "Food & drink", icon: UtensilsCrossed, note: "Local favorites" },
  { name: "Auto", icon: Truck, note: "Repair, sales & care" },
  { name: "Professional", icon: BriefcaseBusiness, note: "Trusted expertise" },
  { name: "Shopping", icon: ShoppingBag, note: "Everyday essentials" },
  { name: "Military deals", icon: Tags, note: "Verified offers" },
];

export function HomePage({ data }: { data: HomepageData }) {
  const [query, setQuery] = useState("");
  const [installation, setInstallation] = useState(data.installations[0]?.id ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const businesses = useMemo(() => data.businesses.filter((item) => `${item.name} ${item.category} ${item.deal ?? ""}`.toLowerCase().includes(query.toLowerCase())), [data.businesses, query]);

  return (
    <main id="top">
      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {futureLinks.map((link) => <a href="#coming-soon" key={link}>{link}</a>)}
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        {menuOpen && <nav className="mobile-nav">{futureLinks.map((link) => <a href="#coming-soon" onClick={() => setMenuOpen(false)} key={link}>{link}</a>)}</nav>}
      </header>

      <section className="hero">
        <div className="topo" aria-hidden="true" />
        <div className="hero-copy">
          <span className="market-label"><span /> Now building in Hampton Roads</span>
          <h1>Know what’s worth it.<br /><em>Wherever orders take you.</em></h1>
          <p>Find trusted local businesses, real military deals, and community insight—organized around your installation.</p>
          <div className="search-shell" role="search">
            <label className="installation-select">
              <span>Your installation</span>
              <select value={installation} onChange={(event) => setInstallation(event.target.value)}>
                {data.installations.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
              <ChevronDown size={17} />
            </label>
            <label className="search-input">
              <Search size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movers, dentists, deals…" />
            </label>
            <button onClick={() => document.getElementById("businesses")?.scrollIntoView({ behavior: "smooth" })}>Search</button>
          </div>
          <div className="hero-proof"><span><ShieldCheck size={17} /> Free for military families</span><span>Ratings can’t be bought</span><span>Community-led</span></div>
        </div>
        <aside className="hero-panel">
          <div className="map-card">
            <div className="map-lines" />
            <span className="map-label label-norfolk">Naval Station<br /><b>Norfolk</b></span>
            <span className="map-label label-langley">JBLE<br /><b>Langley</b></span>
            <span className="map-label label-oceana">NAS <b>Oceana</b></span>
            <span className="map-pin pin-one" /><span className="map-pin pin-two" /><span className="map-pin pin-three" />
            <div className="market-card"><span>01</span><div><small>FIRST MARKET</small><b>Hampton Roads</b><p>17 installations · One connected community</p></div></div>
          </div>
        </aside>
      </section>

      <section className="category-section section-wrap">
        <div className="section-heading"><div><span className="eyebrow">EXPLORE LOCALLY</span><h2>What do you need today?</h2></div><a href="#coming-soon">Browse all categories →</a></div>
        <div className="category-grid">{categories.map(({ name, icon: Icon, note }) => <button key={name} onClick={() => setQuery(name)}><span><Icon size={22} /></span><b>{name}</b><small>{note}</small></button>)}</div>
      </section>

      <section className="business-section" id="businesses">
        <div className="section-wrap">
          <div className="section-heading"><div><span className="eyebrow">COMMUNITY PICKS</span><h2>Worth knowing near you</h2></div><p>Mission Scores come only from community signals—never ad spend.</p></div>
          {data.source === "preview" && <div className="preview-notice"><Building2 size={18} /><span><b>Interface preview</b> Connect the production environment to display real businesses, verified deals, reviews, and Mission Scores.</span></div>}
          <div className="business-grid">{businesses.map((business) => <BusinessCard key={business.id} business={business} preview={data.source === "preview"} />)}</div>
          {!businesses.length && <div className="empty-state"><Search size={28} /><h3>No matches yet</h3><p>Try a broader service or category.</p></div>}
        </div>
      </section>

      <section className="trust-section section-wrap" id="how-it-works">
        <div className="trust-copy"><span className="eyebrow">THE MISSION RATED PROMISE</span><h2>Trust is the product.</h2><p>Mission Rated is built to help military families make confident local decisions. Businesses help fund the platform—but the score always belongs to the community.</p><a href="#principles">How Mission Scores work →</a></div>
        <div className="principle-list" id="principles">
          <article><span>01</span><div><h3>Families always use it free</h3><p>No subscription, paywall, or premium tier for military families.</p></div></article>
          <article><span>02</span><div><h3>Visibility is not credibility</h3><p>Businesses may pay for clearly labeled promotion. Payment never changes Mission Score.</p></div></article>
          <article><span>03</span><div><h3>Community ownership matters</h3><p>Military spouse-owned businesses receive visibility without paying for placement.</p></div></article>
        </div>
      </section>

      <section className="coming-section" id="coming-soon">
        <div className="section-wrap coming-inner"><div><span className="eyebrow">THE NEXT CHAPTER</span><h2>Your whole community,<br />one trusted starting point.</h2></div><div className="coming-grid"><span><Home /> PCS & Housing</span><span><GraduationCap /> Schools</span><span><BriefcaseBusiness /> Jobs</span><span><ShoppingBag /> Marketplace</span><span><HandCoins /> Price Check</span><span><Wrench /> Benefits</span></div></div>
      </section>

      <footer><Logo /><p>Made for the military community. Built with independence.</p><span>© 2026 Mission Rated</span></footer>
    </main>
  );
}
