(()=>{
'use strict';
const PATHS=['/','/index.html','/military-value','/military-value.html','/schools','/schools.html','/bases','/bases.html','/buy-a-car','/buy-a-car.html','/support','/support.html','/medical','/medical.html','/neighborhoods','/neighborhoods.html','/community','/community.html','/events','/events.html','/sources','/sources.html'];
if(!PATHS.includes(location.pathname.replace(/\/$/,'')||'/'))return;
const PREFIX='mr_';let restoring=false,timer=null,clearButton=null;
function candidates(){return [...document.querySelectorAll('input[type="search"],input:not([type]),select')].filter(el=>{if(el.closest('.mrReviewModal'))return false;const text=((el.id||'')+' '+(el.name||'')).toLowerCase();return /q|search|filter|category|city|sort|rating|benefit|type|evidence|service|performance|purple|level/.test(text)||el.closest('.search,.controls,.mrAutoFilters,.mrSortRow')})}
function key(el,i){return PREFIX+String(el.id||el.name||`filter${i}`).replace(/[^a-zA-Z0-9_-]/g,'_')}
function defaultValue(el){return el.tagName==='SELECT'?(el.options[0]?.value||''):''}
function emit(el){el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}))}
function hasActive(){return candidates().some(el=>String(el.value||'').trim()&&String(el.value)!==defaultValue(el))}
function updateClear(){if(!clearButton)return;clearButton.hidden=!hasActive()}
function clearAll(){restoring=true;candidates().forEach(el=>{const v=defaultValue(el);if(String(el.value)!==v){el.value=v;emit(el)}});restoring=false;const u=new URL(location.href);[...u.searchParams.keys()].filter(k=>k.startsWith(PREFIX)).forEach(k=>u.searchParams.delete(k));history.replaceState(null,'',u.pathname+(u.search||'')+u.hash);updateClear()}
function addClear(){const host=document.querySelector('.search,.controls,.mrAutoFilters,.mrSortRow');if(!host||document.getElementById('mrClearFilters'))return;clearButton=document.createElement('button');clearButton.id='mrClearFilters';clearButton.type='button';clearButton.textContent='Clear filters';clearButton.hidden=true;clearButton.setAttribute('aria-label','Clear search and filters');clearButton.style.cssText='min-height:42px;padding:9px 12px;border:1px solid #3b6a82;border-radius:9px;background:#08263a;color:#eaf5f8;font:inherit;font-size:10px;font-weight:850;cursor:pointer';clearButton.addEventListener('click',clearAll);host.appendChild(clearButton);updateClear()}
function sync(){if(restoring)return;const u=new URL(location.href);candidates().forEach((el,i)=>{const v=String(el.value||'').trim(),k=key(el,i);if(!v||v===defaultValue(el))u.searchParams.delete(k);else u.searchParams.set(k,v)});history.replaceState(null,'',u.pathname+(u.search||'')+u.hash);updateClear()}
function schedule(){clearTimeout(timer);timer=setTimeout(sync,180)}
function restore(attempt=0){const u=new URL(location.href);let pending=false;restoring=true;candidates().forEach((el,i)=>{const v=u.searchParams.get(key(el,i));if(v==null)return;if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===v)){pending=true;return}if(String(el.value)!==v){el.value=v;emit(el)}});restoring=false;updateClear();if(pending&&attempt<10)setTimeout(()=>restore(attempt+1),250)}
function run(){addClear();document.addEventListener('input',e=>{if(candidates().includes(e.target)){updateClear();schedule()}},true);document.addEventListener('change',e=>{if(candidates().includes(e.target)){updateClear();sync()}},true);restore();setTimeout(()=>{addClear();restore(1)},700);setTimeout(()=>restore(2),1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
