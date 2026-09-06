(()=>{
'use strict';
const sourceFixes=new Map([
  ['Norfolk|Nike Factory Store|Up to 30% off fleece','https://www.premiumoutlets.com/outlet/norfolk/stores/nike-factory-store/stream/nike--up-to-30-off-fleece-93-99-6288015'],
  ['Norfolk|Nike Factory Store|Running footwear starting at $49.99','https://www.premiumoutlets.com/outlet/norfolk/stores/nike-factory-store/stream/running-footwear-starting-at-4999-93-99-6288017'],
  ['Norfolk|Nike Factory Store|Up to 30% off backpacks','https://www.premiumoutlets.com/outlet/norfolk/stores/nike-factory-store/stream/up-to-30-off-backpacks-6288020'],
  ['Norfolk|Under Armour Factory House|50% off entire store','https://www.premiumoutlets.com/outlet/norfolk/stores/under-armour-factory-house/stream/50-off-entire-store-at-under-armour-6288656'],
  ['Norfolk|Under Armour Factory House|$19.99 hoodies','https://www.premiumoutlets.com/outlet/norfolk/stores/under-armour-factory-house/stream/score-of-the-week-1999-hoodies-at-under-armour-6287030'],
  ['Norfolk|Crocs|2 for $50 on select styles & clearance footwear','https://www.premiumoutlets.com/outlet/norfolk/stores/crocs/stream/2-for-50-on-select-styles-clearance-footwear-6288526'],
  ['Norfolk|Skechers|BOGO 50% off footwear','https://www.premiumoutlets.com/outlet/norfolk/stores/skechers/stream/back-2-school-bogo-50-off-footwear-6285855'],
  ['Norfolk|The Uniform Outlet|Scrubs under $20','https://www.premiumoutlets.com/outlet/norfolk/stores/the-uniform-outlet/stream/scrubs-under-20-at-the-uniform-outlet-6277085'],
  ['Norfolk|Columbia Factory Store|Clearance event up to 70% off','https://www.premiumoutlets.com/outlet/norfolk/stores/columbia-factory-store/stream/clearance-event--up-to-70-off-6285727'],
  ['Williamsburg|Nike Factory Store|Up to 30% off fleece','https://www.premiumoutlets.com/outlet/williamsburg/stores/nike-factory-store/stream/nike--up-to-30-off-fleece-93-99-6288015'],
  ['Williamsburg|Nike Factory Store|Running footwear starting at $49.99','https://www.premiumoutlets.com/outlet/williamsburg/stores/nike-factory-store/stream/running-footwear-starting-at-4999-93-99-6288017'],
  ['Williamsburg|Nike Factory Store|Up to 30% off backpacks','https://www.premiumoutlets.com/outlet/williamsburg/stores/nike-factory-store/stream/up-to-30-off-backpacks-6288020'],
  ['Williamsburg|Under Armour Factory House|50% off entire store','https://www.premiumoutlets.com/outlet/williamsburg/stores/under-armour-factory-house/stream/50-off-entire-store-at-under-armour-6288656'],
  ['Williamsburg|Under Armour Factory House|$19.99 hoodies','https://www.premiumoutlets.com/outlet/williamsburg/stores/under-armour-factory-house/stream/score-of-the-week-1999-hoodies-at-under-armour-6287030'],
  ['Williamsburg|Aeropostale|60% off storewide + BOGO free jeans','https://www.premiumoutlets.com/outlet/williamsburg/stores/aeropostale/stream/60-off-storewide-bogo-free-jeans-6288658'],
  ['Williamsburg|Tommy Hilfiger|50% off almost everything','https://www.premiumoutlets.com/outlet/williamsburg/stores/tommy-hilfiger/stream/50-off-almost-everything-6288642'],
  ['Williamsburg|ASICS|BOGO 60% off footwear','https://www.premiumoutlets.com/outlet/williamsburg/stores/asics/stream/bogo-60-off-footwear-6288628']
]);
const hash32=(input,seed)=>{
  let hash=seed>>>0;
  for(let i=0;i<input.length;i++)hash=Math.imul(hash^input.charCodeAt(i),16777619);
  return (hash>>>0).toString(16).padStart(8,'0');
};
const cardKey=card=>{
  const location=card.querySelector('.mrDealMeta')?.textContent?.trim()||'';
  const business=card.querySelector('h3')?.textContent?.trim()||'';
  const offer=card.querySelector('.mrDealOffer')?.textContent?.trim()||'';
  return `${location}|${business}|${offer}`;
};
const stableDealKey=card=>{
  const source=card.querySelector('a.mrDealVerify')?.getAttribute('href')||'';
  const business=card.querySelector('h3')?.textContent||'';
  const offer=card.querySelector('.mrDealOffer')?.textContent||'';
  const input=`${source}|${business}|${offer}`;
  return `labor-day-${hash32(input,2166136261)}${hash32(input,2246822519)}`;
};
const sourceMatchesMerchant=(card,link)=>{
  try{
    const url=new URL(link.href);
    if(url.hostname!=='www.premiumoutlets.com')return true;
    const business=(card.querySelector('h3')?.textContent||'').toLowerCase();
    const storePath=(url.pathname.match(/\/stores\/([^/]+)\//)||[])[1]||'';
    const normalized=business.replace(/factory house|factory store|new york|outlet|store|bostonian|b'gosh/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    return normalized.split('-').filter(Boolean).every(part=>storePath.includes(part));
  }catch{return false;}
};
const decorate=()=>{
  const section=document.getElementById('mrLocalLaborDeals');
  if(!section)return false;
  section.querySelectorAll('a.mrDealVerify').forEach(link=>{
    const card=link.closest('.mrDeal');
    if(!card)return;
    const corrected=sourceFixes.get(cardKey(card));
    if(corrected)link.href=corrected;
    if(!sourceMatchesMerchant(card,link)){
      card.remove();
      return;
    }
    if(!card.dataset.dealId)card.dataset.dealId=stableDealKey(card);
    link.textContent='Source ↗';
    link.setAttribute('aria-label','Open source for this offer');
    link.dataset.dealAction='get-deal';
    link.dataset.dealSource='seasonal-source-link';
  });
  const visible=section.querySelectorAll('.mrDeal').length;
  const count=section.querySelector('.mrLocalCount');
  if(count)count.textContent=`${visible} source-backed offers`;
  const heading=section.querySelector('.mrLocalDealsTop h2');
  if(heading)heading.textContent=`${visible} local Labor Day deals`;
  const toggle=document.getElementById('mrLocalToggle');
  if(toggle)toggle.textContent=`Show all ${visible} source-backed deals`;
  return true;
};
if(decorate())return;
const observer=new MutationObserver(()=>{if(decorate())observer.disconnect()});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();
