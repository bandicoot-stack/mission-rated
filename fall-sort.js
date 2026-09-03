(()=>{
'use strict';
if(!/\/fall(?:\.html)?$/.test(location.pathname))return;
const month={SEP:9,SEPT:9,OCT:10,NOV:11};
const parseDate=text=>{
  const s=String(text||'').toUpperCase();
  const m=s.match(/\b(SEP|SEPT|OCT|NOV)\s+(\d{1,2})\b/);
  if(!m)return Number.MAX_SAFE_INTEGER;
  return Date.UTC(2026,(month[m[1]]||12)-1,Number(m[2]));
};
function enhance(){
  const grid=document.querySelector('.section .grid');
  if(!grid)return;
  const cards=[...grid.querySelectorAll(':scope > .card')];
  cards.sort((a,b)=>parseDate(a.querySelector('.meta')?.textContent)-parseDate(b.querySelector('.meta')?.textContent));
  cards.forEach(card=>grid.appendChild(card));
  for(const card of cards){
    const badge=card.querySelector('.badge');
    const text=`${badge?.textContent||''} ${card.textContent||''}`.toUpperCase();
    if(/MILITARY DEAL|FREE FOR ACTIVE DUTY|MILITARY DISCOUNT|MILITARY VALUE/.test(text))continue;
    if(card.querySelector('.mrDiscountGap'))continue;
    const gap=document.createElement('div');
    gap.className='mrDiscountGap';
    gap.textContent='MILITARY DISCOUNT: NOT YET CONFIRMED • OUTREACH TARGET';
    gap.style.cssText='margin-top:8px;padding:7px 8px;border:1px solid #7a6138;border-radius:7px;color:#ffd36d;background:#241d10;font-size:8px;font-weight:900;letter-spacing:.03em';
    badge?.insertAdjacentElement('afterend',gap);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();
})();