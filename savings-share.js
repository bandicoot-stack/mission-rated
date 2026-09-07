(()=>{
'use strict';
const grid=document.getElementById('grid');
if(!grid)return;
const search=document.getElementById('q');
const params=new URLSearchParams(location.search);
const sharedId=String(params.get('id')||'').trim().slice(0,120);
const sharedQuery=String(params.get('q')||'').trim().slice(0,120);
if(!sharedId&&sharedQuery&&search){search.value=sharedQuery;search.dispatchEvent(new Event('input',{bubbles:true}));}
let sharedResolved=false;
const resolveSharedTarget=()=>{
  if(sharedResolved||!sharedId)return;
  const card=[...grid.querySelectorAll('.card[data-business-id]')].find(item=>String(item.dataset.businessId||'').trim()===sharedId);
  if(!card)return;
  const name=String(card.querySelector('h2')?.textContent||'').trim();
  sharedResolved=true;
  if(search&&name){
    search.value=name;
    search.dispatchEvent(new Event('input',{bubbles:true}));
  }
  requestAnimationFrame(()=>{
    const exact=[...grid.querySelectorAll('.card[data-business-id]')].find(item=>String(item.dataset.businessId||'').trim()===sharedId);
    exact?.scrollIntoView({block:'center'});
  });
};
const decorate=()=>{
  grid.querySelectorAll('.card[data-business-id]').forEach(card=>{
    if(card.querySelector('.mrSavingsShare'))return;
    const name=String(card.querySelector('h2')?.textContent||'').trim();
    const businessId=String(card.dataset.businessId||'').trim();
    if(!name||!businessId)return;
    const actions=card.querySelector('.actions');
    if(!actions)return;
    const button=document.createElement('button');
    button.type='button';
    button.className='btn mrSavingsShare';
    button.dataset.dealAction='share';
    button.dataset.shareMethod='native-or-copy';
    button.textContent='Share';
    button.setAttribute('aria-label',`Share ${name} on Mission Rated`);
    button.addEventListener('click',async()=>{
      if(typeof window.mrDealShare!=='function')return;
      const url=new URL('/savings.html',location.origin);
      url.searchParams.set('id',businessId);
      url.searchParams.set('q',name);
      const result=await window.mrDealShare({
        url:url.toString(),
        title:`${name} — Mission Rated`,
        text:`Check this source-backed military offer for ${name} on Mission Rated.`,
        targetType:'business',
        targetId:businessId
      });
      if(result?.ok&&result.method==='copy'){
        const original=button.textContent;
        button.textContent='Copied ✓';
        setTimeout(()=>{button.textContent=original},1400);
      }
    });
    actions.appendChild(button);
  });
  resolveSharedTarget();
};
decorate();
new MutationObserver(decorate).observe(grid,{childList:true,subtree:true});
})();
