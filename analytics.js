(()=>{
'use strict';
// Keep browser analytics on the same origin. The server endpoint owns the
// event allowlist/sanitization boundary and can evolve without exposing a
// direct third-party ingestion URL in every client.
const ENDPOINT='/api/event';
const productionHosts=new Set(['www.missionratedhq.com','missionratedhq.com','mission-rated-beta.vercel.app']);
if(!productionHosts.has(location.hostname))return;
const clean=s=>String(s??'').trim();
const qs=new URLSearchParams(location.search);
try{
  const analyticsMode=qs.get('mr_analytics');
  if(analyticsMode==='off')localStorage.setItem('mr_analytics_optout','1');
  if(analyticsMode==='on')localStorage.removeItem('mr_analytics_optout');
  if(localStorage.getItem('mr_analytics_optout')==='1')return;
}catch{}
const embedded=(()=>{try{return window.self!==window.top||qs.get('embedded')==='1'}catch{return true}})();
const getId=(key,storage)=>{try{let v=storage.getItem(key);if(!v){v=crypto.randomUUID();storage.setItem(key,v)}return v}catch{return null}};
const session=getId('mr_analytics_session',sessionStorage);
const visitor=getId('mr_analytics_visitor',localStorage);
// Referral attribution uses a dedicated pseudonymous token rather than the
// analytics visitor ID. A shared Mission Rated URL therefore cannot expose or
// correlate the sender's internal visitor identifier.
const referralToken=getId('mr_share_referral_token',localStorage);
const referrerHost=(()=>{try{return document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):null}catch{return null}})();
const currentAcquisition={utm_source:qs.get('utm_source'),utm_medium:qs.get('utm_medium'),utm_campaign:qs.get('utm_campaign')||qs.get('campaign'),referral_code:qs.get('mr_ref')||qs.get('ref')};
const acquisition=(()=>{try{const key='mr_acquisition_first_touch',existing=JSON.parse(localStorage.getItem(key)||'null');if(existing)return existing;const has=Object.values(currentAcquisition).some(Boolean);if(has)localStorage.setItem(key,JSON.stringify(currentAcquisition));return has?currentAcquisition:{}}catch{return currentAcquisition}})();
const targetContext=el=>{
  const card=el?.closest?.('[data-business-id],[data-school-id],[data-installation-id],[data-deal-id],[data-id],.card');
  const params=new URLSearchParams(location.search);
  if(card?.dataset?.dealId)return {target_type:'deal',target_id:card.dataset.dealId};
  if(card?.dataset?.businessId)return {target_type:'business',target_id:card.dataset.businessId};
  if(card?.dataset?.schoolId)return {target_type:'school',target_id:card.dataset.schoolId};
  if(card?.dataset?.installationId)return {target_type:'installation',target_id:card.dataset.installationId};
  if(card?.dataset?.id)return {target_type:'item',target_id:card.dataset.id};
  if(params.get('deal'))return {target_type:'deal',target_id:params.get('deal')};
  if(params.get('id'))return {target_type:location.pathname.includes('school')?'school':location.pathname.includes('installation')?'installation':'business',target_id:params.get('id')};
  return {};
};
const send=(eventName,extra={})=>{
  const payload={event_name:eventName,path:location.pathname||'/',session_id:session,visitor_id:visitor,referrer_host:referrerHost,...acquisition,...extra};
  try{fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload),keepalive:true,credentials:'same-origin'}).catch(()=>{})}catch{}
};
window.mrTrack=send;
window.mrReferralUrl=(url=location.href)=>{
  try{
    const dest=new URL(url,location.href);
    // Referral tokens stay on Mission Rated links only. External merchant or
    // source URLs never receive either the referral token or visitor ID.
    if(dest.origin!==location.origin)return dest.toString();
    if(referralToken)dest.searchParams.set('mr_ref',referralToken);
    if(!dest.searchParams.get('utm_source'))dest.searchParams.set('utm_source','mission-rated-share');
    if(!dest.searchParams.get('utm_medium'))dest.searchParams.set('utm_medium','referral');
    return dest.toString();
  }catch{return url}
};
if(!embedded){
  send('page_view');
  if(currentAcquisition.referral_code)send('referral_visit',{referral_code:currentAcquisition.referral_code});
  try{
    const last=Number(localStorage.getItem('mr_last_visit')||0),now=Date.now();
    if(last&&now-last>=20*60*60*1000)send('return_visit',{days_since_last:Math.round((now-last)/86400000)});
    localStorage.setItem('mr_last_visit',String(now));
  }catch{}
}
document.addEventListener('submit',e=>{
  const form=e.target;if(!(form instanceof HTMLFormElement))return;
  const text=clean(form.textContent).toLowerCase();
  const idClass=`${clean(form.id)} ${clean(form.className)}`.toLowerCase();
  const action=clean(form.getAttribute('action')).toLowerCase();
  const email=form.querySelector('input[type="email"],input[name*="email" i]');
  const isWeekendBrief=form.dataset?.weekendBrief==='true'||/weekend[\s_-]*brief/.test(idClass)||/weekend brief/.test(text)||(/subscribe|newsletter/.test(`${idClass} ${action} ${text}`)&&!!email);
  if(isWeekendBrief)send('weekend_brief_signup_attempt',{signup_surface:clean(form.dataset?.signupSurface)||location.pathname||'unknown'});
},true);
document.addEventListener('click',e=>{
  const el=e.target?.closest?.('a,button');if(!el)return;
  const text=clean(el.textContent).toLowerCase(),href=clean(el.getAttribute?.('href'));
  const ctx=targetContext(el);
  if(el.classList?.contains('mrDealAction')||el.dataset?.dealAction==='get-deal')return send('deal_click',{...ctx,deal_source:clean(el.dataset?.dealSource)||clean(el.closest?.('[data-deal-source]')?.dataset?.dealSource)||'unknown'});
  if(el.id==='mrShareAction'||el.dataset?.dealAction==='share'||/^↗?\s*share\b/.test(text))return;
  if(el.classList?.contains('mrDirections')||/\bdirections\b/.test(text))return send('directions_click',ctx);
  if(/claim (this|business|listing)|\bclaim\b/.test(text))return send('claim_action',ctx);
  if(/leave.*review|write.*review|add.*review|review this|submit review/.test(text))return send('review_action',ctx);
  if(/feedback|suggest.*improvement|report.*issue/.test(text))return send('feedback_action',ctx);
  if(/verify (military )?offer( source)?|verify source|tricare evidence|rating source|public rating source|source ↗/.test(text))return send('offer_source_click',ctx);
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