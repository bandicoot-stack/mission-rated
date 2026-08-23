(()=>{
'use strict';
if(!['/','/index.html'].includes(location.pathname)) return;
const isFeaturedActive=()=>document.querySelector('.tab[data-view="featured"]')?.classList.contains('active');
const purgeLeakedHuntClub=()=>{
  if(!isFeaturedActive()) return;
  document.querySelectorAll('main.main article, main.main .card, main.main [data-id]').forEach(el=>{
    if(el.closest('#featured')) return;
    if(/hunt club farm/i.test(el.textContent||'')) el.remove();
  });
};
function enforce(){
  const main=document.querySelector('main.main');
  const tabs=document.querySelector('.tabrow');
  if(!main||!tabs) return;

  let featured=document.getElementById('featured');
  if(!featured){
    featured=document.createElement('section');
    featured.id='featured';
    featured.className='section';
    main.prepend(featured);
  }
  featured.hidden=false;
  featured.innerHTML=`
    <div class="head"><div><h2>Featured Partners</h2><small>DIRECT MISSION RATED PARTNERS ONLY</small></div></div>
    <div class="context">Only businesses directly added through Mission Rated partnership outreach appear here. General military discounts, seasonal finds, and other listings stay in their normal tabs.</div>
    <div class="grid">
      <article class="card hot" style="grid-column:1/-1;border-color:#8d742a;background:linear-gradient(135deg,#102234,#081723)">
        <div class="badges"><span class="badge score">★ FEATURED PARTNER</span><span class="badge good">Veteran-owned</span><span class="badge official">Directly confirmed</span></div>
        <h3 style="font-size:24px">Yorktown Tools</h3>
        <div class="offer" style="font-size:42px">10% OFF</div>
        <div class="line"><b>Military Discount</b></div>
        <p class="muted">Yorktown Tools directly confirmed a 10% military discount with Mission Rated. Featured placement highlights the partnership and benefit; it does not affect ratings or rankings.</p>
        <div class="links"><a class="btn" style="background:#00e5ff;color:#02101d;border-color:#00e5ff" href="/featured">View featured partner →</a><a class="btn" href="https://yorktowntools.com/" target="_blank" rel="noopener noreferrer">Yorktown Tools ↗</a></div>
      </article>
    </div>`;

  [...main.querySelectorAll(':scope > .section')].forEach(section=>{section.hidden=section.id!=='featured'});
  [...tabs.querySelectorAll('.tab')].forEach(tab=>{
    const active=tab.dataset.view==='featured';
    tab.classList.toggle('active',active);
    tab.setAttribute('aria-selected',active?'true':'false');
    if(active){tab.style.borderColor='#d0a93a';tab.style.background='#ffd36d';tab.style.color='#02101d';}
  });
  purgeLeakedHuntClub();
  const observer=new MutationObserver(()=>purgeLeakedHuntClub());
  observer.observe(main,{childList:true,subtree:true});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(enforce,80),{once:true});
else setTimeout(enforce,80);
})();