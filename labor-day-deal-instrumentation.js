(()=>{
'use strict';
const stableDealKey=card=>{
  const source=card.querySelector('a.mrDealVerify')?.getAttribute('href')||'';
  const business=card.querySelector('h3')?.textContent||'';
  const offer=card.querySelector('.mrDealOffer')?.textContent||'';
  const input=`${source}|${business}|${offer}`;
  let hash=2166136261;
  for(let i=0;i<input.length;i++)hash=Math.imul(hash^input.charCodeAt(i),16777619);
  return `labor-day-${(hash>>>0).toString(16).padStart(8,'0')}`;
};
const decorate=()=>{
  const section=document.getElementById('mrLocalLaborDeals');
  if(!section)return false;
  section.querySelectorAll('a.mrDealVerify').forEach(link=>{
    const card=link.closest('.mrDeal');
    if(card&&!card.dataset.dealId)card.dataset.dealId=stableDealKey(card);
    link.dataset.dealAction='get-deal';
    link.dataset.dealSource='verified-source';
  });
  return true;
};
if(decorate())return;
const observer=new MutationObserver(()=>{if(decorate())observer.disconnect()});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();
