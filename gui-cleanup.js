(()=>{
'use strict';
if(!['/','/index.html'].includes(location.pathname)) return;

function ensureFeedbackFallback(){
  if(document.getElementById('mrFeedbackButton')) return;
  const ENDPOINT='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/submit-beta-feedback';
  const s=document.createElement('style');
  s.id='mrFeedbackFallbackStyle';
  s.textContent=`
    #mrFeedbackButton{position:fixed!important;right:16px!important;bottom:20px!important;top:auto!important;left:auto!important;transform:none!important;z-index:2147483000!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;min-height:54px!important;padding:14px 18px!important;border:2px solid #8ef5ff!important;border-radius:999px!important;background:#00e5ff!important;color:#02101d!important;font:900 12px/1 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;box-shadow:0 14px 38px #000a,0 0 0 4px #00e5ff24!important;cursor:pointer!important}
    #mrFeedbackFallback{position:fixed;inset:0;z-index:2147483001;display:none;align-items:flex-end;justify-content:center;background:#000b;padding:16px}
    #mrFeedbackFallback.open{display:flex}
    #mrFeedbackFallback .sheet{width:min(520px,100%);background:#061725;color:#f5f8fa;border:1px solid #355d73;border-radius:18px;padding:18px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 25px 80px #000d}
    #mrFeedbackFallback .top{position:static;height:auto;background:none;border:0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
    #mrFeedbackFallback h2{margin:2px 0 5px;font-size:20px}
    #mrFeedbackFallback p{margin:0;color:#a8bbc5;font-size:11px;line-height:1.45}
    #mrFeedbackFallback .close{border:0;background:transparent;color:#fff;font-size:26px;min-width:44px;min-height:44px;cursor:pointer}
    #mrFeedbackFallback .choices{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}
    #mrFeedbackFallback .choice{min-height:44px;border:1px solid #345c72;border-radius:9px;background:#082238;color:#e6f1f5;font-weight:850;cursor:pointer}
    #mrFeedbackFallback .choice.active{border-color:#00e5ff;background:#0a3b4e;color:#8ef5ff}
    #mrFeedbackFallback textarea{width:100%;min-height:100px;margin-top:12px;padding:12px;border:1px solid #426176;border-radius:9px;background:#061b2d;color:#fff;font:inherit;resize:vertical}
    #mrFeedbackFallback .send{width:100%;min-height:44px;margin-top:12px;border:1px solid #00e5ff;border-radius:9px;background:#00e5ff;color:#02101d;font-weight:900;cursor:pointer}
    @media(max-width:640px){#mrFeedbackButton{right:12px!important;bottom:calc(82px + env(safe-area-inset-bottom))!important;min-height:52px!important;padding:13px 16px!important}#mrFeedbackFallback{padding:0}#mrFeedbackFallback .sheet{border-radius:18px 18px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom))}}
  `;
  document.head.appendChild(s);

  const button=document.createElement('button');
  button.id='mrFeedbackButton';button.type='button';button.textContent='💬 Give Feedback';button.setAttribute('aria-label','Give feedback');
  document.body.appendChild(button);

  const modal=document.createElement('div');
  modal.id='mrFeedbackFallback';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  modal.innerHTML='<div class="sheet"><div class="top"><div><div style="font-size:8px;font-weight:900;color:#00e5ff">PUBLIC BETA • NO LOGIN</div><h2>Help make Mission Rated better.</h2><p>Tap a rating and send it. A note is optional.</p></div><button class="close" type="button" aria-label="Close feedback">×</button></div><div class="choices"><button class="choice" type="button" data-v="yes">👍 Yes</button><button class="choice" type="button" data-v="partly">😐 Partly</button><button class="choice" type="button" data-v="no">👎 No</button></div><textarea maxlength="1200" placeholder="Anything we should fix or add? (optional)"></textarea><button class="send" type="button">Send feedback</button></div>';
  document.body.appendChild(modal);

  let helpful='';
  const close=()=>{modal.classList.remove('open');document.body.style.overflow=''};
  button.addEventListener('click',()=>{modal.classList.add('open');document.body.style.overflow='hidden'});
  modal.querySelector('.close').addEventListener('click',close);
  modal.addEventListener('click',e=>{if(e.target===modal)close()});
  modal.querySelectorAll('.choice').forEach(c=>c.addEventListener('click',()=>{modal.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));c.classList.add('active');helpful=c.dataset.v||''}));
  modal.querySelector('.send').addEventListener('click',async()=>{
    const note=modal.querySelector('textarea').value.trim();
    if(!helpful&&!note){alert('Tap Yes, Partly, or No — or add a short note.');return}
    const send=modal.querySelector('.send');send.disabled=true;send.textContent='Sending…';
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({feedback_type:'general',helpful,category:'general',message:note,item_name:document.title,page_path:location.pathname,website:''})});
      if(!r.ok) throw new Error(String(r.status));
      send.textContent='✓ Thank you';setTimeout(close,900);
    }catch{alert('We could not send that feedback. Please try again.');send.textContent='Send feedback'}
    finally{setTimeout(()=>{send.disabled=false;if(send.textContent==='✓ Thank you')send.textContent='Send feedback'},1200)}
  });
}

function clean(){
  const hero=document.querySelector('.hero .wrap,.hero');
  if(!hero) return;
  const links=hero.querySelector('.viewlinks');
  if(links){
    links.innerHTML='';
    const items=[['/events','Events'],['/medical','Medical / TRICARE'],['/community','Community Reviews'],['/sources','Trust & Sources']];
    for(const [href,label] of items){const a=document.createElement('a');a.href=href;a.textContent=label+' ↗';links.appendChild(a)}
  }
  document.querySelectorAll('.hero a').forEach(a=>{const text=(a.textContent||'').toLowerCase();if(text.includes('featured partner'))a.remove()});
  document.getElementById('mrGrowthShare')?.remove();
  const p=hero.querySelector('p');if(p)p.textContent='Trusted local deals, places and military-family intelligence for Hampton Roads — source-backed and built to save military families real money.';
  const sub=hero.querySelector('.sub');if(sub)sub.textContent='Find it. Trust it. Save.';
  const eyebrow=hero.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='HAMPTON ROADS • MILITARY FAMILY INTELLIGENCE';
  const status=document.getElementById('status');if(status)status.style.opacity='.7';
  const tabrow=document.querySelector('.tabrow');if(tabrow){const seen=new Set();[...tabrow.querySelectorAll('.tab')].forEach(tab=>{const key=(tab.textContent||'').trim().toLowerCase();if(seen.has(key))tab.remove();else seen.add(key)})}
  const style=document.createElement('style');style.id='mrGuiCleanupStyle';style.textContent=`.hero{padding-bottom:24px}.hero .viewlinks{margin-top:12px;gap:7px}.hero .viewlinks a{padding:7px 9px;border:1px solid #284d62;border-radius:8px;background:#051a29;color:#9fefff!important}#mrHeadlineEvents{margin-top:14px!important}#mr-featured-partners{margin-bottom:18px!important}.tabs{box-shadow:0 8px 22px #0003}.context{margin-bottom:10px}@media(max-width:640px){.hero .viewlinks{grid-template-columns:repeat(2,minmax(0,1fr))!important}.hero .viewlinks a{min-height:36px!important}}`;
  if(!document.getElementById(style.id))document.head.appendChild(style);
  setTimeout(ensureFeedbackFallback,250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(clean,0),{once:true});else setTimeout(clean,0);
})();
