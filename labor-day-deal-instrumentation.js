(()=>{
'use strict';
const hash32=(input,seed)=>{
  let hash=seed>>>0;
  for(let i=0;i<input.length;i++)hash=Math.imul(hash^input.charCodeAt(i),16777619);
  return (hash>>>0).toString(16).padStart(8,'0');
};
const stableDealKey=card=>{
  const source=card.querySelector('a.mrDealVerify')?.getAttribute('href')||'';
  const business=card.querySelector('h3')?.textContent||'';
  const offer=card.querySelector('.mrDealOffer')?.textContent||'';
  const input=`${source}|${business}|${offer}`;
  return `labor-day-${hash32(input,2166136261)}${hash32(input,2246822519)}`;
};
const decorate=()=>{
  const section=document.getElementById('mrLocalLaborDeals');
  if(!section)return false;
  section.querySelectorAll('a.mrDealVerify').forEach(link=>{
    const card=link.closest('.mrDeal');
    if(card&&!card.dataset.dealId)card.dataset.dealId=stableDealKey(card);
    link.textContent='Source ↗';
    link.setAttribute('aria-label','Open source for this offer');
    link.dataset.dealAction='get-deal';
    // This identifies the click as an outbound source-link interaction only.
    // It must not be interpreted as proof that Mission Rated independently
    // verified the merchant, offer, redemption, or realized savings.
    link.dataset.dealSource='seasonal-source-link';
  });
  return true;
};
if(decorate())return;
const observer=new MutationObserver(()=>{if(decorate())observer.disconnect()});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();
