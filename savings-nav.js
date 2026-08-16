(()=>{
'use strict';
const p=location.pathname.replace(/\/$/,'')||'/',params=new URLSearchParams(location.search),liveView=params.get('view');
const PRIMARY='/?view=savings';
const wire=()=>{
  const nav=document.getElementById('mrLifestyleNav');
  if(nav){
    const save=[...nav.querySelectorAll('a')].find(a=>a.textContent.trim().toUpperCase().includes('SAVE'));
    if(save){
      save.href=PRIMARY;
      save.dataset.mrSavingsPrimary='1';
      save.innerHTML='<b aria-hidden="true">$</b>SAVINGS';
      const active=p==='/'&&liveView==='savings';
      if(active)save.setAttribute('aria-current','page');
      else if(save.getAttribute('aria-current')==='page')save.removeAttribute('aria-current');
      const links=[...nav.querySelectorAll('a')];
      const midpoint=Math.floor(links.length/2);
      if(links[midpoint]!==save){
        const anchor=links[midpoint];
        if(anchor)nav.insertBefore(save,anchor);
        else nav.appendChild(save);
      }
    }
    if(!document.getElementById('mrSavingsCenterStyle')){
      const style=document.createElement('style');
      style.id='mrSavingsCenterStyle';
      style.textContent=`
#mrLifestyleNav a[data-mr-savings-primary="1"]{border:1px solid #ffd36d;background:linear-gradient(180deg,#183746,#0b2636);color:#ffd36d!important;box-shadow:0 8px 22px #0008,inset 0 0 0 1px #ffd36d22;transform:translateY(-4px);font-weight:950}
#mrLifestyleNav a[data-mr-savings-primary="1"] b{color:#ffd36d;font-size:17px}
#mrLifestyleNav a[data-mr-savings-primary="1"][aria-current=page]{background:#ffd36d;color:#02101d!important;box-shadow:0 10px 28px #0009,0 0 0 2px #ffd36d33}
#mrLifestyleNav a[data-mr-savings-primary="1"][aria-current=page] b{color:#02101d}
@media(max-width:700px){#mrLifestyleNav a[data-mr-savings-primary="1"]{min-width:76px;padding:10px 5px;transform:translateY(-7px);border-radius:13px}}
`;
      document.head.appendChild(style);
    }
  }
  if(p!=='/')return;
  const links=document.querySelector('.viewlinks');
  if(links&&!links.querySelector('[data-mr-savings-link]')){
    const a=document.createElement('a');a.href=PRIMARY;a.dataset.mrSavingsLink='1';a.textContent='Savings ↗';links.prepend(a);
  }
  const row=document.querySelector('.tabrow'),main=document.querySelector('main.main');
  if(!row||!main||document.querySelector('[data-view="savings"]'))return;
  const tab=document.createElement('button');tab.className='tab';tab.dataset.view='savings';tab.setAttribute('aria-selected','false');tab.textContent='Savings';
  const existing=[...row.querySelectorAll('.tab')],center=Math.floor(existing.length/2);const anchor=existing[center];if(anchor)row.insertBefore(tab,anchor);else row.appendChild(tab);
  if(!document.getElementById('mrSavingsTabStyle')){const style=document.createElement('style');style.id='mrSavingsTabStyle';style.textContent='.tab[data-view="savings"]{border-color:#ffd36d;color:#ffd36d;background:#172332;box-shadow:0 6px 18px #0005;font-size:11px;padding-left:16px;padding-right:16px}.tab[data-view="savings"].active{background:#ffd36d;color:#02101d;border-color:#ffd36d}';document.head.appendChild(style)}
  const section=document.createElement('section');section.className='section';section.id='savings';section.hidden=true;section.innerHTML='<div class="head"><div><h2>Savings</h2><small>DISCOUNTS • DEALS • MILITARY VALUE</small></div></div><div class="mr-embed-note">Check Mission Rated before you spend. Find and compare source-backed military savings without leaving Mission Rated Live. Ratings, verification, and paid relationships remain separate.</div><iframe class="mr-embed-frame" title="Mission Rated Savings" loading="eager" src="/savings.html?embedded=1"></iframe>';main.appendChild(section);
  const activate=()=>{
    document.querySelectorAll('.tab').forEach(x=>{const active=x===tab;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active))});
    document.querySelectorAll('.section').forEach(s=>s.hidden=s.id!=='savings');
    const category=document.getElementById('category'),city=document.getElementById('city');if(category)category.disabled=true;if(city)city.disabled=true;
    history.replaceState(null,'',PRIMARY);
  };
  tab.addEventListener('click',activate);if(liveView==='savings')activate();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,0),{once:true});else setTimeout(wire,0);
})();
