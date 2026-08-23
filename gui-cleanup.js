(()=>{
'use strict';
if(!['/','/index.html'].includes(location.pathname)) return;
function clean(){
  const hero=document.querySelector('.hero .wrap,.hero');
  if(!hero) return;

  // One utility row only. Primary discovery already lives in the tab navigation.
  const links=hero.querySelector('.viewlinks');
  if(links){
    links.innerHTML='';
    const items=[
      ['/events','Events'],
      ['/medical','Medical / TRICARE'],
      ['/community','Community Reviews'],
      ['/sources','Trust & Sources']
    ];
    for(const [href,label] of items){
      const a=document.createElement('a');a.href=href;a.textContent=label+' ↗';links.appendChild(a);
    }
  }

  // Featured is already a prominent homepage section; don't advertise it again in hero links.
  document.querySelectorAll('.hero a').forEach(a=>{
    const text=(a.textContent||'').toLowerCase();
    if(text.includes('featured partner')) a.remove();
  });

  // Remove redundant growth box from the hero. Keep the page focused on discovery.
  document.getElementById('mrGrowthShare')?.remove();

  // Tighten hero copy and reduce visual noise around status text.
  const p=hero.querySelector('p');
  if(p) p.textContent='Trusted local deals, places and military-family intelligence for Hampton Roads — source-backed and built to save military families real money.';
  const sub=hero.querySelector('.sub');
  if(sub) sub.textContent='Find it. Trust it. Save.';
  const eyebrow=hero.querySelector('.eyebrow');
  if(eyebrow) eyebrow.textContent='HAMPTON ROADS • MILITARY FAMILY INTELLIGENCE';
  const status=document.getElementById('status');
  if(status) status.style.opacity='.7';

  // Keep tabs as the single primary navigation layer and remove accidental duplicate labels.
  const tabrow=document.querySelector('.tabrow');
  if(tabrow){
    const seen=new Set();
    [...tabrow.querySelectorAll('.tab')].forEach(tab=>{
      const key=(tab.textContent||'').trim().toLowerCase();
      if(seen.has(key)) tab.remove(); else seen.add(key);
    });
  }

  // Make the content hierarchy breathe a little more.
  const style=document.createElement('style');
  style.id='mrGuiCleanupStyle';
  style.textContent=`
    .hero{padding-bottom:24px}
    .hero .viewlinks{margin-top:12px;gap:7px}
    .hero .viewlinks a{padding:7px 9px;border:1px solid #284d62;border-radius:8px;background:#051a29;color:#9fefff!important}
    #mrHeadlineEvents{margin-top:14px!important}
    #mr-featured-partners{margin-bottom:18px!important}
    .tabs{box-shadow:0 8px 22px #0003}
    .context{margin-bottom:10px}
    @media(max-width:640px){.hero .viewlinks{grid-template-columns:repeat(2,minmax(0,1fr))!important}.hero .viewlinks a{min-height:36px!important}}
  `;
  if(!document.getElementById(style.id)) document.head.appendChild(style);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(clean,0),{once:true});
else setTimeout(clean,0);
})();
