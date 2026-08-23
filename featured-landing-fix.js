(()=>{
'use strict';
if(!['/','/index.html'].includes(location.pathname)) return;
const tabsNav=()=>document.querySelector('nav.tabs');
const mainEl=()=>document.querySelector('main.main');
const featuredActive=()=>document.querySelector('.tab[data-view="featured"]')?.classList.contains('active');
function interstitials(){const nav=tabsNav(),main=mainEl();if(!nav||!main)return[];const out=[];let n=nav.nextElementSibling;while(n&&n!==main){out.push(n);n=n.nextElementSibling;}return out;}
function setInterstitialVisibility(show){for(const el of interstitials()){if(show){if(el.dataset.mrFeaturedPrevDisplay!==undefined){el.style.display=el.dataset.mrFeaturedPrevDisplay;delete el.dataset.mrFeaturedPrevDisplay;}}else{if(el.dataset.mrFeaturedPrevDisplay===undefined)el.dataset.mrFeaturedPrevDisplay=el.style.display||'';el.style.display='none';}}}
function purgeLeak(){if(!featuredActive())return;setInterstitialVisibility(false);document.querySelectorAll('main.main > .section').forEach(s=>s.hidden=s.id!=='featured');}
function enforce(){
  const main=mainEl(),tabs=document.querySelector('.tabrow');if(!main||!tabs)return;
  let featured=document.getElementById('featured');if(!featured){featured=document.createElement('section');featured.id='featured';featured.className='section';main.prepend(featured);}
  featured.hidden=false;
  featured.innerHTML=`
    <div class="head"><div><h2>Featured Partners</h2><small>DIRECT MISSION RATED PARTNERS ONLY</small></div></div>
    <div class="context">Only businesses directly added through Mission Rated partnership outreach appear here. General military discounts, seasonal finds, and other listings stay in their normal tabs.</div>
    <div class="grid"><article class="card hot" style="grid-column:1/-1;border-color:#8d742a;background:linear-gradient(135deg,#102234,#081723)">
      <div style="display:grid;grid-template-columns:minmax(0,240px) minmax(0,150px);gap:16px;align-items:center;margin-bottom:16px">
        <img src="/assets/yorktown-primary.webp" alt="Yorktown Tools primary Y logo" style="width:100%;aspect-ratio:1/1;object-fit:contain;border-radius:14px;background:#fff;border:2px solid #d0a93a">
        <img src="/assets/yorktown-secondary.webp" alt="Yorktown Tools patriot secondary logo" style="width:100%;aspect-ratio:1/1;object-fit:contain;border-radius:12px;background:#fff;border:1px solid #31566b;opacity:.96">
      </div>
      <div class="badges"><span class="badge score">★ FEATURED PARTNER</span><span class="badge good">Veteran-owned</span><span class="badge official">Directly confirmed</span></div>
      <h3 style="font-size:24px">Yorktown Tools</h3><div class="offer" style="font-size:42px">10% OFF</div><div class="line"><b>Military Discount</b></div>
      <p class="muted">Yorktown Tools directly confirmed a 10% military discount with Mission Rated. Featured placement highlights the partnership and benefit; it does not affect ratings or rankings.</p>
      <div class="links"><a class="btn" style="background:#00e5ff;color:#02101d;border-color:#00e5ff" href="/featured">View featured partner →</a><a class="btn" href="https://yorktowntools.com/" target="_blank" rel="noopener noreferrer">Yorktown Tools ↗</a></div>
    </article></div>`;
  [...main.querySelectorAll(':scope > .section')].forEach(s=>s.hidden=s.id!=='featured');
  [...tabs.querySelectorAll('.tab')].forEach(tab=>{const on=tab.dataset.view==='featured';tab.classList.toggle('active',on);tab.setAttribute('aria-selected',on?'true':'false');if(on){tab.style.borderColor='#d0a93a';tab.style.background='#ffd36d';tab.style.color='#02101d';}});
  setInterstitialVisibility(false);
  tabs.addEventListener('click',e=>{const tab=e.target.closest('.tab');if(!tab)return;setTimeout(()=>setInterstitialVisibility(tab.dataset.view==='today'),0);},true);
  const observer=new MutationObserver(()=>purgeLeak());observer.observe(document.body,{childList:true,subtree:true});setTimeout(purgeLeak,250);setTimeout(purgeLeak,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(enforce,100),{once:true});else setTimeout(enforce,100);
})();