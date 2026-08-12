(()=>{
'use strict';
if(document.getElementById('mrModeBar')) return;
const style=document.createElement('style');
style.textContent='.mrModeBar{position:relative;z-index:45;background:#031522;border-bottom:1px solid #18394c}.mrModeInner{max-width:1220px;margin:auto;padding:8px 18px;display:flex;align-items:center;gap:8px;overflow-x:auto;scrollbar-width:none}.mrModeInner::-webkit-scrollbar{display:none}.mrModeLabel{font-size:8px;font-weight:950;letter-spacing:.14em;color:#7d98a5;white-space:nowrap;margin-right:2px}.mrModeLink{white-space:nowrap;text-decoration:none;border:1px solid #31566b;border-radius:999px;padding:7px 10px;font-size:9px;font-weight:900;color:#c9d9df;background:#061b2d}.mrModeLink b{color:#00e5ff}.mrModeLink.save b{color:#ffd36d}.mrModeLink.active{border-color:#00e5ff;box-shadow:0 0 0 1px #00e5ff22 inset}.mrDataHealth{margin-left:auto;white-space:nowrap;font-size:8px;color:#7f99a5}.mrDataHealth strong{color:#83efc4}@media(max-width:640px){.mrModeInner{padding:8px 14px}.mrDataHealth{display:none}}';
document.head.appendChild(style);
const bar=document.createElement('nav');bar.id='mrModeBar';bar.className='mrModeBar';bar.setAttribute('aria-label','Mission Rated lifestyle sections');
const p=location.pathname;
const link=(href,label,cls='')=>`<a class="mrModeLink ${cls} ${p.startsWith(href)&&href!=='/'?'active':''}" href="${href}">${label}</a>`;
bar.innerHTML=`<div class="mrModeInner"><span class="mrModeLabel">MILITARY LIFE</span>${link('/neighborhoods','<b>LIVE</b> Neighborhoods')}${link('/bases','<b>SUPPORT</b> Bases')}${link('/schools','<b>SUPPORT</b> Schools')}${link('/military-value','<b>SAVE</b> Military Value','save')}${link('/buy-a-car','<b>SAVE</b> Buy a Car','save')}${link('/community','Community Reviews')}<span class="mrDataHealth" id="mrDataHealth">Source-backed data • live</span></div>`;
const header=document.querySelector('header');if(header?.nextSibling) header.parentNode.insertBefore(bar,header.nextSibling); else document.body.prepend(bar);
const API='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/public-explore';
fetch(API).then(r=>r.ok?r.json():null).then(d=>{if(!d)return;const m=d.meta||{},el=document.getElementById('mrDataHealth');if(!el)return;const sourced=m.sourced_businesses??null,offers=Array.isArray(d.deals)?d.deals.length:null;const parts=[];if(sourced!=null)parts.push(`${sourced} sourced places`);if(offers!=null)parts.push(`${offers} verified offers`);el.innerHTML=`<strong>LIVE</strong>${parts.length?' • '+parts.join(' • '):' • source-backed data'}`}).catch(()=>{});
})();
