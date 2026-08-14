(()=>{
'use strict';
const PATHS=['/','/index.html','/military-value','/military-value.html','/schools','/schools.html','/bases','/bases.html','/buy-a-car','/buy-a-car.html','/support','/support.html','/medical','/medical.html','/neighborhoods','/neighborhoods.html','/community','/community.html','/events','/events.html','/sources','/sources.html'];
if(!PATHS.includes(location.pathname.replace(/\/$/,'')||'/'))return;
const PREFIX='mr_';let restoring=false,timer=null;
function candidates(){return [...document.querySelectorAll('input[type="search"],input:not([type]),select')].filter(el=>{if(el.closest('.mrReviewModal'))return false;const text=((el.id||'')+' '+(el.name||'')).toLowerCase();return /q|search|filter|category|city|sort|rating|benefit|type|evidence|service|performance|purple|level/.test(text)||el.closest('.search,.controls,.mrAutoFilters,.mrSortRow')})}
function key(el,i){return PREFIX+String(el.id||el.name||`filter${i}`).replace(/[^a-zA-Z0-9_-]/g,'_')}
function defaultValue(el){return el.tagName==='SELECT'?(el.options[0]?.value||''):''}
function emit(el){el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}))}
function sync(){if(restoring)return;const u=new URL(location.href);candidates().forEach((el,i)=>{const v=String(el.value||'').trim(),k=key(el,i);if(!v||v===defaultValue(el))u.searchParams.delete(k);else u.searchParams.set(k,v)});history.replaceState(null,'',u.pathname+(u.search||'')+u.hash)}
function schedule(){clearTimeout(timer);timer=setTimeout(sync,180)}
function restore(attempt=0){const u=new URL(location.href);let pending=false;restoring=true;candidates().forEach((el,i)=>{const v=u.searchParams.get(key(el,i));if(v==null)return;if(el.tagName==='SELECT'&&![...el.options].some(o=>o.value===v)){pending=true;return}if(String(el.value)!==v){el.value=v;emit(el)}});restoring=false;if(pending&&attempt<10)setTimeout(()=>restore(attempt+1),250)}
function run(){document.addEventListener('input',e=>{if(candidates().includes(e.target))schedule()},true);document.addEventListener('change',e=>{if(candidates().includes(e.target))sync()},true);restore();setTimeout(()=>restore(1),700);setTimeout(()=>restore(2),1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
