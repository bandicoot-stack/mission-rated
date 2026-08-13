(()=>{
'use strict';
if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
function run(){
 const sub=document.querySelector('.hero .sub');if(sub)sub.textContent='Live better. Get support. Save more.';
 const p=document.querySelector('.hero p');if(p)p.textContent='Military lifestyle intelligence for everyday life: trusted places, verified savings, medical care, schools, installation support, neighborhoods, events, community reviews, and car-buying help. Mission Rated never invents a score when evidence is thin.';
 const eyebrow=document.querySelector('.hero .eyebrow');if(eyebrow)eyebrow.textContent='HAMPTON ROADS • LIVE • SUPPORT • SAVE';
 const links=document.querySelector('.hero .viewlinks');if(links){
   const wanted=[['/medical','Medical / TRICARE'],['/?view=support','Support'],['/?view=cars','Buy a Car'],['/events','Events'],['/community','Community Reviews'],['/neighborhoods','Neighborhoods'],['/sources','Trust & Sources']];
   for(const [href,label] of wanted){if(![...links.querySelectorAll('a')].some(a=>a.getAttribute('href')===href)){const a=document.createElement('a');a.href=href;a.textContent=label+' ↗';links.appendChild(a)}}
 }
 const tabrow=document.querySelector('.tabrow');
 let carTab=document.querySelector('.tab[data-view="cars"]');
 if(tabrow&&!carTab){carTab=document.createElement('button');carTab.className='tab';carTab.dataset.view='cars';carTab.setAttribute('aria-selected','false');carTab.textContent='Buy a Car';tabrow.appendChild(carTab)}
 const main=document.querySelector('main.main');
 let carSection=document.getElementById('cars');
 if(main&&!carSection){
   carSection=document.createElement('section');carSection.className='section';carSection.id='cars';carSection.hidden=true;
   carSection.innerHTML='<div class="head"><div><h2>Buy a Car</h2><small>DEALERS • SALESPEOPLE • DEAL CHECK</small></div></div><div class="context">Car buying is part of Mission Rated Live. Dealer ratings and community signals stay source-attributed and separate from Mission Rated scores.</div><iframe id="mrCarFrame" title="Mission Rated Buy a Car" loading="lazy" src="/buy-a-car.html?embedded=1" style="width:100%;min-height:900px;border:0;border-radius:12px;background:#02101d" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
   main.appendChild(carSection);
 }
 const activateCars=()=>{
   document.querySelectorAll('.tab').forEach(x=>{const active=x===carTab;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active))});
   document.querySelectorAll('.section').forEach(s=>s.hidden=s.id!=='cars');
   const category=document.getElementById('category'),city=document.getElementById('city');if(category)category.disabled=true;if(city)city.disabled=true;
   try{const u=new URL(location.href);u.searchParams.set('view','cars');history.replaceState(history.state,'',u)}catch{}
 };
 if(carTab)carTab.addEventListener('click',activateCars);
 window.addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='mr-car-height')return;const frame=document.getElementById('mrCarFrame');if(frame&&Number(e.data.height)>0)frame.style.height=Math.max(700,Number(e.data.height))+'px'});
 if(new URLSearchParams(location.search).get('view')==='cars')activateCars();
 const style=document.createElement('style');style.textContent='@media(max-width:640px){.viewlinks{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px!important}.viewlinks a{display:flex;align-items:center;justify-content:center;min-height:40px;padding:8px;border:1px solid #31566b;border-radius:9px;background:#061b2d;text-align:center}#mrCarFrame{min-height:1100px!important}}';document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
