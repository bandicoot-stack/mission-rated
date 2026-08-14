(()=>{
'use strict';
if(document.getElementById('mrShareAction'))return;
const blocked=new Set(['/community','/sources']);
const p=location.pathname.replace(/\/$/,'')||'/';
if(blocked.has(p))return;
const style=document.createElement('style');style.id='mrShareStyle';style.textContent=`
#mrShareAction{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:1px solid #3b7188;background:#07263a;color:#d8f7ff;border-radius:999px;padding:8px 11px;font-size:9px;font-weight:900;cursor:pointer;white-space:nowrap}#mrShareAction:hover{border-color:#00e5ff}#mrShareAction:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}#mrShareAction[data-done="1"]{border-color:#2f8a73;color:#8ff2d0}@media(max-width:700px){#mrShareAction{min-height:40px;padding:9px 12px;font-size:10px}}
`;document.head.appendChild(style);
const btn=document.createElement('button');btn.type='button';btn.id='mrShareAction';btn.textContent='↗ Share';btn.setAttribute('aria-label','Share this Mission Rated view');
const target=document.querySelector('.top .wrap,.topin,.nav,.hero .wrap,header .wrap');
if(!target)return;
if(target.classList?.contains('nav'))target.appendChild(btn);else target.appendChild(btn);
const cleanUrl=()=>{const u=new URL(location.href);u.hash='';return u.toString()};
const title=()=>document.querySelector('h1')?.textContent?.trim()||document.title||'Mission Rated';
const done=label=>{btn.dataset.done='1';btn.textContent=label;setTimeout(()=>{delete btn.dataset.done;btn.textContent='↗ Share'},1800)};
btn.addEventListener('click',async()=>{
 const url=cleanUrl(),text=`${title()} — Mission Rated`;
 try{
  if(navigator.share){await navigator.share({title:title(),text,url});done('Shared');return}
  if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);done('Link copied');return}
  const area=document.createElement('textarea');area.value=url;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();done('Link copied');
 }catch(e){if(e?.name!=='AbortError')done('Copy failed')}
});
})();
