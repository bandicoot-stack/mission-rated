(()=>{
'use strict';
const ENDPOINT='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/product-event';
const surfaces={
  '/gas.html':'gas',
  '/business.html':'business',
  '/military-value.html':'military_deals',
  '/savings.html':'military_deals',
  '/medical.html':'medical'
};
const path=location.pathname||'/';
const surface=surfaces[path];
if(!surface)return;
const storageKey=`mr_helpful:${surface}:${path}`;
try{if(localStorage.getItem(storageKey))return}catch{}
const session=(()=>{try{let v=sessionStorage.getItem('mr_analytics_session');if(!v){v=crypto.randomUUID();sessionStorage.setItem('mr_analytics_session',v)}return v}catch{return null}})();
const qs=new URLSearchParams(location.search);
const referrerHost=(()=>{try{return document.referrer?new URL(document.referrer).hostname.replace(/^www\./,''):null}catch{return null}})();
let shown=false,done=false;
const style=document.createElement('style');
style.textContent=`
#mrHelpful{position:fixed;left:50%;bottom:18px;transform:translateX(-50%) translateY(18px);z-index:9999;width:min(430px,calc(100vw - 28px));padding:14px 15px;border:1px solid #315a73;border-radius:14px;background:#041521f2;color:#f5f8fa;box-shadow:0 18px 50px #0008;backdrop-filter:blur(14px);opacity:0;transition:.2s ease;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
#mrHelpful.mrShow{opacity:1;transform:translateX(-50%) translateY(0)}
#mrHelpful .mrEyebrow{font-size:9px;font-weight:900;letter-spacing:.12em;color:#00e5ff;margin-bottom:5px}
#mrHelpful .mrQuestion{font-size:15px;font-weight:900;line-height:1.25;margin:0 0 10px}
#mrHelpful .mrActions{display:flex;gap:8px}
#mrHelpful button{flex:1;border:1px solid #3b6a82;border-radius:9px;padding:10px 12px;background:#08263a;color:#edf8fb;font:inherit;font-size:12px;font-weight:850;cursor:pointer}
#mrHelpful button[data-response="yes"]{background:#00e5ff;color:#02101d;border-color:#00e5ff}
#mrHelpful button:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}
#mrHelpful .mrThanks{font-size:12px;color:#c3d1d8;line-height:1.4}
@media(max-width:640px){#mrHelpful{bottom:12px}}
`;
document.head.appendChild(style);
const box=document.createElement('aside');
box.id='mrHelpful';
box.setAttribute('aria-live','polite');
box.innerHTML='<div class="mrEyebrow">QUICK CHECK</div><p class="mrQuestion">Did this help?</p><div class="mrActions"><button type="button" data-response="yes">Yes</button><button type="button" data-response="no">Not yet</button></div>';
document.body.appendChild(box);
const send=response=>{
  const payload={
    event_name:'helpfulness_response',path,session_id:session,referrer_host:referrerHost,
    utm_source:qs.get('utm_source'),utm_medium:qs.get('utm_medium'),utm_campaign:qs.get('utm_campaign'),
    destination:path,target_type:'surface',target_id:surface,response,surface
  };
  try{fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload),keepalive:true,credentials:'omit'}).catch(()=>{})}catch{}
};
const show=()=>{if(shown||done)return;shown=true;requestAnimationFrame(()=>box.classList.add('mrShow'))};
const maybeShow=()=>{const doc=document.documentElement;const max=Math.max(1,doc.scrollHeight-innerHeight);if(scrollY/max>=.28)show()};
addEventListener('scroll',maybeShow,{passive:true});
setTimeout(show,8000);
box.addEventListener('click',e=>{
  const button=e.target?.closest?.('button[data-response]');
  if(!button||done)return;
  done=true;
  const response=button.dataset.response==='yes'?'yes':'no';
  try{localStorage.setItem(storageKey,response)}catch{}
  send(response);
  box.innerHTML=`<div class="mrEyebrow">THANK YOU</div><div class="mrThanks">${response==='yes'?'Good — we’ll keep improving this.':'Got it — that tells us where to focus next.'}</div>`;
  setTimeout(()=>{box.classList.remove('mrShow');setTimeout(()=>box.remove(),220)},1400);
});
})();
