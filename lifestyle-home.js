(()=>{
'use strict';
if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
function run(){
 const sub=document.querySelector('.hero .sub');if(sub)sub.textContent='Live better. Get support. Save more.';
 const p=document.querySelector('.hero p');if(p)p.textContent='Military lifestyle intelligence for everyday life: trusted places, verified savings, schools, installation support, neighborhoods, events, community reviews, and car-buying help. Mission Rated never invents a score when evidence is thin.';
 const eyebrow=document.querySelector('.hero .eyebrow');if(eyebrow)eyebrow.textContent='HAMPTON ROADS • LIVE • SUPPORT • SAVE';
 const links=document.querySelector('.hero .viewlinks');if(links){
   const wanted=[['/?view=support','Support'],['/?view=cars','Buy a Car'],['/events','Events'],['/community','Community Reviews'],['/neighborhoods','Neighborhoods']];
   for(const [href,label] of wanted){if(![...links.querySelectorAll('a')].some(a=>a.getAttribute('href')===href)){const a=document.createElement('a');a.href=href;a.textContent=label+' ↗';links.appendChild(a)}}
 }
 const style=document.createElement('style');style.textContent='@media(max-width:640px){.viewlinks{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px!important}.viewlinks a{display:flex;align-items:center;justify-content:center;min-height:40px;padding:8px;border:1px solid #31566b;border-radius:9px;background:#061b2d;text-align:center}}';document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
