(async function(){
  const fallbackPartners = [
    {
      slug:'hunt-club-farm',
      name:'Hunt Club Farm',
      location:'Virginia Beach, VA',
      category:'Family Activities',
      featured:true,
      directPartner:true,
      sourceType:'direct-partner-confirmation',
      logo:null,
      logoAlt:'Hunt Club Farm',
      logoPending:true,
      eligibilityNote:'Eligibility and exclusions pending partner confirmation. Offer terms below are directly confirmed.',
      offers:[
        '10% off Petting Farm/TreeWalk admission on Sundays',
        '10% off Farm Market purchases on Sundays',
        '$2 off Harvest Fair admission on Sundays in October',
        '$10 off Halloween Festival military admission'
      ]
    }
  ];

  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function normalizePartner(p){
    return {
      slug:p.slug || '',
      name:p.name || '',
      location:p.location || '',
      category:p.category || '',
      featured:!!p.featured,
      directPartner:!!p.directPartner,
      sourceType:p.sourceType || '',
      logo:p.logo || null,
      logoAlt:p.logoAlt || p.name || '',
      logoPending:!!p.logoPending,
      eligibilityNote:p.eligibilityNote || '',
      offers:Array.isArray(p.offers) ? p.offers : []
    };
  }

  const existing = Array.isArray(window.MISSION_RATED_FEATURED_PARTNERS) ? window.MISSION_RATED_FEATURED_PARTNERS.map(normalizePartner) : [];
  const bySlug = new Map(existing.map(p => [p.slug, p]));
  for (const p of fallbackPartners.map(normalizePartner)) if (!bySlug.has(p.slug)) bySlug.set(p.slug,p);
  const partners = Array.from(bySlug.values());
  window.MISSION_RATED_FEATURED_PARTNERS = partners;

  function renderPartner(p){
    const logo = p.logo
      ? `<img class="featured-partner-logo" src="${esc(p.logo)}" alt="${esc(p.logoAlt)}" loading="lazy">`
      : `<div class="featured-partner-logo-fallback" aria-label="${esc(p.name)} logo pending">${esc(p.name.charAt(0) || '★')}</div>`;
    const offers = p.offers.map(o => `<li>${esc(o)}</li>`).join('');
    const provenance = p.directPartner ? '<span class="partner-badge">Directly confirmed partner</span>' : '';
    const logoNote = p.logoPending ? '<span class="partner-badge subtle">Logo pending</span>' : '';
    return `<article class="featured-partner-card" data-partner-slug="${esc(p.slug)}">
      <div class="featured-partner-brand">${logo}</div>
      <div class="featured-partner-content">
        <div class="featured-partner-kicker">Featured Partner</div>
        <h3>${esc(p.name)}</h3>
        <p class="featured-partner-meta">${esc(p.location)}${p.category ? ` · ${esc(p.category)}` : ''}</p>
        <div class="featured-partner-badges">${provenance}${logoNote}</div>
        <ul class="featured-partner-offers">${offers}</ul>
        ${p.eligibilityNote ? `<p class="featured-partner-note">${esc(p.eligibilityNote)}</p>` : ''}
      </div>
    </article>`;
  }

  function mount(){
    const root = document.querySelector('[data-featured-partners]') || document.getElementById('featured-partners');
    if (!root) return;
    root.innerHTML = partners.filter(p => p.featured).map(renderPartner).join('');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
})();
