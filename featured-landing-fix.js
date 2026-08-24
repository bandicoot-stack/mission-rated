(()=>{
'use strict';
if(!['/','/index.html'].includes(location.pathname)) return;
const tabsNav=()=>document.querySelector('nav.tabs');
const mainEl=()=>document.querySelector('main.main');
const featuredActive=()=>document.querySelector('.tab[data-view="featured"]')?.classList.contains('active');
function interstitials(){const nav=tabsNav(),main=mainEl();if(!nav||!main)return[];const out=[];let n=nav.nextElementSibling;while(n&&n!==main){out.push(n);n=n.nextElementSibling;}return out;}
function setInterstitialVisibility(show){for(const el of interstitials()){if(show){if(el.dataset.mrFeaturedPrevDisplay!==undefined){el.style.display=el.dataset.mrFeaturedPrevDisplay;delete el.dataset.mrFeaturedPrevDisplay;}}else{if(el.dataset.mrFeaturedPrevDisplay===undefined)el.dataset.mrFeaturedPrevDisplay=el.style.display||'';el.style.display='none';}}}
function purgeLeak(){if(!featuredActive())return;setInterstitialVisibility(false);document.querySelectorAll('main.main > .section').forEach(s=>s.hidden=s.id!=='featured');}
function escapeHtml(value=''){return String(value).replace(/[&<>\"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[char]));}
function enforce(){
  const main=mainEl(),tabs=document.querySelector('.tabrow');if(!main||!tabs)return;
  const partners=window.MRFeaturedPartners?.all||[];
  if(!partners.length){console.error('Featured partner data missing');return;}
  let featured=document.getElementById('featured');if(!featured){featured=document.createElement('section');featured.id='featured';featured.className='section';main.prepend(featured);}
  featured.hidden=false;
  const cards=partners.map(partner=>`<article class="card hot" data-featured-partner="${escapeHtml(partner.slug)}" style="border-color:#8d742a;background:linear-gradient(135deg,#102234,#081723)">
      <div data-partner-logo-host></div>
      <div class="badges"><span class="badge score">★ FEATURED PARTNER</span>${partner.veteranOwned?'<span class="badge good">Veteran-owned</span>':''}${partner.directlyConfirmed?'<span class="badge official">Directly confirmed</span>':''}</div>
      <h3 style="font-size:22px">${escapeHtml(partner.name)}</h3><div class="offer" style="font-size:36px">${escapeHtml(partner.offer)}</div><div class="line"><b>${escapeHtml(partner.offerLabel)}</b></div>
      <p class="muted">${escapeHtml(partner.description)}</p>
      ${partner.contactName?`<div class="line">Partner contact: <b>${escapeHtml(partner.contactName)}</b></div>`:''}
      <div class="links"><a class="btn" style="background:#00e5ff;color:#02101d;border-color:#00e5ff" href="${escapeHtml(partner.featuredUrl)}">View offer →</a><a class="btn" href="${escapeHtml(partner.businessUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(partner.name)} ↗</a></div>
    </article>`).join('');
  featured.innerHTML=`<div class="head"><div><h2>Featured Partners</h2><small>DIRECT MISSION RATED PARTNERS ONLY</small></div></div><div class="context">Only businesses directly added through Mission Rated partnership outreach appear here. Featured placement never changes ratings, reviews, or organic ranking.</div><div class="grid">${cards}</div>`;
  featured.querySelectorAll('[data-featured-partner]').forEach(article=>{const partner=window.MRFeaturedPartners.get(article.dataset.featuredPartner);window.MRPartnerLogo?.render(article.querySelector('[data-partner-logo-host]'),partner,{eager:true});});
  [...main.querySelectorAll(':scope > .section')].forEach(s=>s.hidden=s.id!=='featured');
  [...tabs.querySelectorAll('.tab')].forEach(tab=>{const on=tab.dataset.view==='featured';tab.classList.toggle('active',on);tab.setAttribute('aria-selected',on?'true':'false');if(on){tab.style.borderColor='#d0a93a';tab.style.background='#ffd36d';tab.style.color='#02101d';}});
  setInterstitialVisibility(false);
  tabs.addEventListener('click',e=>{const tab=e.target.closest('.tab');if(!tab)return;setTimeout(()=>setInterstitialVisibility(tab.dataset.view==='today'),0);},true);
  const observer=new MutationObserver(()=>purgeLeak());observer.observe(document.body,{childList:true,subtree:true});setTimeout(purgeLeak,250);setTimeout(purgeLeak,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(enforce,100),{once:true});else setTimeout(enforce,100);
})();