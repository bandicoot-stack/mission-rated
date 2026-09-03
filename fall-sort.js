(()=>{
'use strict';
if(!/\/fall(?:\.html)?$/.test(location.pathname))return;
const month={SEP:9,SEPT:9,OCT:10,NOV:11};
const parseDate=text=>{const s=String(text||'').toUpperCase();const m=s.match(/\b(SEP|SEPT|OCT|NOV)\s+(\d{1,2})\b/);if(!m)return Number.MAX_SAFE_INTEGER;return Date.UTC(2026,(month[m[1]]||12)-1,Number(m[2]));};
const confirmed=[
 {match:/SUFFOLK PEANUT FEST/i,label:'MILITARY DEAL • SUNDAY',detail:'Active/retired military and dependents: $5 admission Sunday, Oct. 11 with proper ID.',url:'https://www.suffolkpeanutfest.com/tickets.html'},
 {match:/TOURNAMENT OF THE CASTLE/i,label:'MILITARY DEAL',detail:'Military admission: $20 vs. $22 adult admission.',url:'https://preservationvirginia.org/event/tournament-saturday/'},
 {match:/HUNT CLUB FARM/i,label:'FEATURED + MILITARY DEAL'},
 {match:/MILITARY FAMILY FESTIVAL/i,label:'FREE FOR ACTIVE DUTY'}
];
const freeNoGap=[/KROCTOBERFEST/i,/BLUEBIRD GAP FARM/i,/CHKD FALL FEST/i,/FAITHLIGHT FALL FAMFEST/i,/POQUOSON SEAFOOD FESTIVAL/i,/AUTUMN IN THE AIR/i,/HAYGOOD UMC/i,/THRIVING TOGETHER/i];
function enhance(){
 const grid=document.querySelector('.section .grid');if(!grid)return;
 const cards=[...grid.querySelectorAll(':scope > .card')];
 cards.sort((a,b)=>parseDate(a.querySelector('.meta')?.textContent)-parseDate(b.querySelector('.meta')?.textContent));cards.forEach(card=>grid.appendChild(card));
 for(const card of cards){
   const name=card.querySelector('h3')?.textContent||'';const badge=card.querySelector('.badge');
   const deal=confirmed.find(x=>x.match.test(name));
   if(deal){if(badge)badge.textContent=deal.label;if(deal.detail&&!card.querySelector('.mrConfirmedMilitary')){const box=document.createElement('div');box.className='mrConfirmedMilitary';box.innerHTML=`<strong>${deal.detail}</strong>${deal.url?` <a href="${deal.url}" target="_blank" rel="noopener noreferrer">Verify ↗</a>`:''}`;box.style.cssText='margin-top:8px;padding:8px;border:1px solid #236f61;border-radius:7px;color:#8affdc;background:#0a281f;font-size:8px;line-height:1.4';badge?.insertAdjacentElement('afterend',box)}continue;}
   const text=`${badge?.textContent||''} ${card.textContent||''}`.toUpperCase();
   if(/\bFREE\b/.test(text)||freeNoGap.some(r=>r.test(name)))continue;
   if(card.querySelector('.mrDiscountGap'))continue;
   const gap=document.createElement('div');gap.className='mrDiscountGap';gap.textContent='MILITARY DISCOUNT: NOT YET CONFIRMED • OUTREACH TARGET';gap.style.cssText='margin-top:8px;padding:7px 8px;border:1px solid #7a6138;border-radius:7px;color:#ffd36d;background:#241d10;font-size:8px;font-weight:900;letter-spacing:.03em';badge?.insertAdjacentElement('afterend',gap);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();
})();