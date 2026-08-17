(()=>{
'use strict';
const ENDPOINT='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/product-event';
const productionHosts=new Set(['www.missionratedhq.com','missionratedhq.com','mission-rated-beta.vercel.app']);
if(!productionHosts.has(location.hostname))return;
const clean=s=>String(s??'').trim();
const qs=new URLSearchParams(location.search);
const embedded=(()=>{try{return window.self!==window.top||qs.get('embedded')==='1'}catch{return true}})();
const session=(()=>{try{let v=sessionStorage.getItem('mr_analytics_session');if(!v){v=crypto.randomUUID();sessionStorage.setItem('mr_analytics_session',v)}return v}catch{return null}})();
const referrerHost=(()=>{try{return document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):null}catch{return null}})();
const acquisition={utm_source:qs.get('utm_source'),utm_medium:qs.get('utm_medium'),utm_campaign:qs.get('utm_campaign')};
const targetContext=el=>{
  const card=el?.closest?.('[data-business-id],[data-school-id],[data-installation-id],[data-id],.card');
  const params=new URLSearchParams(location.search);
  if(card?.dataset?.businessId)return {target_type:'business',target_id:card.dataset.businessId};
  if(card?.dataset?.schoolId)return {target_type:'school',target_id:card.dataset.schoolId};
  if(card?.dataset?.installationId)return {target_type:'installation',target_id:card.dataset.installationId};
  if(card?.dataset?.id)return {target_type:'item',target_id:card.dataset.id};
  if(params.get('id'))return {target_type:location.pathname.includes('school')?'school':location.pathname.includes('installation')?'installation':'business',target_id:params.get('id')};
  return {};
};
const send=(eventName,extra={})=>{
  const payload={event_name:eventName,path:location.pathname||'/',session_id:session,referrer_host:referrerHost,...acquisition,...extra};
  try{fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload),keepalive:true,credentials:'omit'}).catch(()=>{})}catch{}
};
window.mrTrack=send;
if(!embedded)send('page_view');
document.addEventListener('click',e=>{
  const el=e.target?.closest?.('a,button');if(!el)return;
  const text=clean(el.textContent).toLowerCase(),href=clean(el.getAttribute?.('href'));
  const ctx=targetContext(el);
  if(el.classList?.contains('mrDealAction')||el.dataset?.dealAction==='get-deal')return send('deal_click',{...ctx,deal_source:clean(el.dataset?.dealSource)||clean(el.closest?.('[data-deal-source]')?.dataset?.dealSource)||'unknown'});
  if(el.id==='mrShareAction'||/^↗?\s*share\b/.test(text))return send('share_action',ctx);
  if(el.classList?.contains('mrDirections')||/\bdirections\b/.test(text))return send('directions_click',ctx);
  if(/claim (this|business|listing)|\bclaim\b/.test(text))return send('claim_action',ctx);
  if(/leave.*review|write.*review|add.*review|review this|submit review/.test(text))return send('review_action',ctx);
  if(/feedback|suggest.*improvement|report.*issue/.test(text))return send('feedback_action',ctx);
  if(/verify offer source|verify source|tricare evidence|rating source|public rating source|source ↗/.test(text))return send('offer_source_click',ctx);
  if(/^https:\/\//i.test(href)&&(/official website|business website|provider website|visit website/.test(text)))return send('official_website_click',ctx);
  const viewEl=el.closest?.('[data-view]');
  if(viewEl?.dataset?.view)return send('internal_navigation',{...ctx,destination:`view:${clean(viewEl.dataset.view)}`});
  if(href&&!/^https?:\/\//i.test(href)&&!href.startsWith('#')&&!href.startsWith('javascript:')){
    try{
      const dest=new URL(href,location.href);
      if(dest.origin===location.origin){
        const view=dest.searchParams.get('view');
        return send('internal_navigation',{...ctx,destination:view?`${dest.pathname}?view=${view}`:dest.pathname});
      }
    }catch{}
  }
},true);
})();
