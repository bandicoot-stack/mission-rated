(()=>{
'use strict';
// Keep browser analytics on the same origin. The server endpoint owns the
// event allowlist/sanitization boundary and can evolve without exposing a
// direct third-party ingestion URL in every client.
const ENDPOINT='/api/event';
const productionHosts=new Set(['www.missionratedhq.com','missionratedhq.com','mission-rated-beta.vercel.app']);
if(!productionHosts.has(location.hostname))return;

// Global feedback control. This lives in analytics.js because that bundle is
// shared broadly across Mission Rated and avoids relying on blocker-sensitive
// filenames such as feedback.js. Existing page-specific feedback UI wins when
// present, so this is safe to load alongside older pages during rollout.
function ensureGlobalFeedback(){
  if(document.getElementById('mrFeedbackButton'))return;
  const FEEDBACK_ENDPOINT='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/submit-beta-feedback';
  const style=document.createElement('style');
  style.id='mrGlobalFeedbackStyle';
  style.textContent=`
    #mrFeedbackButton{position:fixed!important;right:14px!important;bottom:20px!important;top:auto!important;left:auto!important;z-index:2147483000!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;min-height:54px!important;padding:14px 17px!important;border:2px solid #8ef5ff!important;border-radius:999px!important;background:#00e5ff!important;color:#02101d!important;font:900 12px/1 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;box-shadow:0 14px 38px #000a,0 0 0 4px #00e5ff24!important;cursor:pointer!important}
    #mrGlobalFeedbackModal{position:fixed;inset:0;z-index:2147483001;display:none;align-items:flex-end;justify-content:center;background:#000b;padding:16px}
    #mrGlobalFeedbackModal.open{display:flex}
    #mrGlobalFeedbackModal .mr-gf-sheet{width:min(540px,100%);max-height:90vh;overflow:auto;background:#061725;color:#f5f8fa;border:1px solid #355d73;border-radius:18px;padding:18px;box-shadow:0 25px 80px #000d;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    #mrGlobalFeedbackModal .mr-gf-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    #mrGlobalFeedbackModal h2{margin:2px 0 5px;font-size:20px}
    #mrGlobalFeedbackModal p{margin:0;color:#a8bbc5;font-size:11px;line-height:1.45}
    #mrGlobalFeedbackModal .mr-gf-close{border:0;background:transparent;color:#fff;font-size:26px;min-width:44px;min-height:44px;cursor:pointer}
    #mrGlobalFeedbackModal .mr-gf-choices{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
    #mrGlobalFeedbackModal .mr-gf-choice{min-height:44px;border:1px solid #345c72;border-radius:9px;background:#082238;color:#e6f1f5;font-weight:850;cursor:pointer}
    #mrGlobalFeedbackModal .mr-gf-choice.active{border-color:#00e5ff;background:#0a3b4e;color:#8ef5ff}
    #mrGlobalFeedbackModal select,#mrGlobalFeedbackModal textarea,#mrGlobalFeedbackModal input{width:100%;margin-top:10px;padding:12px;border:1px solid #426176;border-radius:9px;background:#061b2d;color:#fff;font:inherit}
    #mrGlobalFeedbackModal textarea{min-height:100px;resize:vertical}
    #mrGlobalFeedbackModal .mr-gf-send{width:100%;min-height:44px;margin-top:12px;border:1px solid #00e5ff;border-radius:9px;background:#00e5ff;color:#02101d;font-weight:900;cursor:pointer}
    @media(max-width:640px){#mrFeedbackButton{right:12px!important;bottom:calc(82px + env(safe-area-inset-bottom))!important;min-height:52px!important;padding:13px 16px!important}#mrGlobalFeedbackModal{padding:0}#mrGlobalFeedbackModal .mr-gf-sheet{border-radius:18px 18px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom))}}
  `;
  document.head.appendChild(style);

  const button=document.createElement('button');
  button.id='mrFeedbackButton';button.type='button';button.textContent='💬 Give Feedback';button.setAttribute('aria-label','Give feedback');button.setAttribute('aria-haspopup','dialog');
  document.body.appendChild(button);

  const modal=document.createElement('div');
  modal.id='mrGlobalFeedbackModal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  modal.innerHTML=`<div class="mr-gf-sheet"><div class="mr-gf-top"><div><div style="font-size:8px;font-weight:900;color:#00e5ff">PUBLIC BETA • NO LOGIN</div><h2>Help make Mission Rated better.</h2><p>Tell us what worked, what did not, or what is missing on this page.</p></div><button class="mr-gf-close" type="button" aria-label="Close feedback">×</button></div><div class="mr-gf-choices"><button class="mr-gf-choice" type="button" data-v="yes">👍 Yes</button><button class="mr-gf-choice" type="button" data-v="partly">😐 Partly</button><button class="mr-gf-choice" type="button" data-v="no">👎 No</button></div><select class="mr-gf-category" aria-label="Feedback category"><option value="general">General experience</option><option value="data_issue">Wrong / outdated data</option><option value="military_discount">Military discount</option><option value="missing_info">Something is missing</option><option value="bug">Something is broken</option><option value="other">Other</option></select><textarea maxlength="1200" placeholder="Anything we should fix or add? (optional)"></textarea><input class="mr-gf-email" type="email" maxlength="180" autocomplete="email" placeholder="Email (optional, only if you'd like a reply)"><button class="mr-gf-send" type="button">Send feedback</button></div>`;
  document.body.appendChild(modal);

  let helpful='';
  const close=()=>{modal.classList.remove('open');document.body.style.overflow=''};
  button.addEventListener('click',()=>{modal.classList.add('open');document.body.style.overflow='hidden'});
  modal.querySelector('.mr-gf-close').addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
  modal.querySelectorAll('.mr-gf-choice').forEach(c=>c.addEventListener('click',()=>{modal.querySelectorAll('.mr-gf-choice').forEach(x=>x.classList.remove('active'));c.classList.add('active');helpful=c.dataset.v||''}));
  modal.querySelector('.mr-gf-send').addEventListener('click',async()=>{
    const note=modal.querySelector('textarea').value.trim();
    const category=modal.querySelector('.mr-gf-category').value;
    if(!helpful&&!note){alert('Tap Yes, Partly, or No — or add a short note.');return}
    const sendButton=modal.querySelector('.mr-gf-send');sendButton.disabled=true;sendButton.textContent='Sending…';
    const payload={feedback_type:category==='data_issue'?'data_issue':'general',helpful,category,message:note,item_name:document.title,contact_email:modal.querySelector('.mr-gf-email').value,page_path:location.pathname,website:''};
    try{const r=await fetch(FEEDBACK_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw new Error(String(r.status));sendButton.textContent='✓ Thank you';setTimeout(close,900)}catch{alert('We could not send that feedback. Please try again.');sendButton.textContent='Send feedback'}finally{setTimeout(()=>{sendButton.disabled=false;if(sendButton.textContent==='✓ Thank you')sendButton.textContent='Send feedback'},1200)}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureGlobalFeedback,{once:true});else ensureGlobalFeedback();

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
// Subscription integrations must call this only after the authoritative
// signup provider/server confirms success. Form submission itself is merely an
// attempt and must never be counted as a subscriber conversion.
window.mrConfirmWeekendBriefSignup=(surface='unknown')=>send('weekend_brief_signup_confirmed',{signup_surface:clean(surface)||'unknown'});
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
  if(currentAcquisition.referral_code){
    // A referral landing is one acquisition event per browser session, not one
    // event per page view. This keeps the growth scorecard from inflating when
    // a referred visitor navigates through Mission Rated with mr_ref preserved.
    try{
      const key=`mr_referral_visit:${currentAcquisition.referral_code}`;
      if(!sessionStorage.getItem(key)){
        send('referral_visit',{referral_code:currentAcquisition.referral_code});
        sessionStorage.setItem(key,'1');
      }
    }catch{send('referral_visit',{referral_code:currentAcquisition.referral_code})}
  }
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
  // A generic merchant/deal CTA is evidence of outbound intent only. It must
  // never be interpreted as a claim, confirmed redemption, or documented savings.
  if(el.classList?.contains('mrDealAction')||el.dataset?.dealAction==='get-deal')return send('deal_outbound_click',{...ctx,deal_source:clean(el.dataset?.dealSource)||clean(el.closest?.('[data-deal-source]')?.dataset?.dealSource)||'unknown'});
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