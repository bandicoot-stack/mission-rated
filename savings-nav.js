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
      save.classList.add('mr-save-primary');
      const active=p==='/'&&liveView==='savings';
      if(active)save.setAttribute('aria-current','page');
      else if(save.getAttribute('aria-current')==='page')save.removeAttribute('aria-current');
    }
  }
  if(p!=='/')return;

  // Savings replaces the older overlapping Military Value discovery tab in the
  // primary experience. The detailed Military Value page remains available
  // from Savings for users who need the evidence-heavy view.
  const legacyDealTab=document.querySelector('.tab[data-view="deals"]');
  if(legacyDealTab){legacyDealTab.hidden=true;legacyDealTab.setAttribute('aria-hidden','true');legacyDealTab.tabIndex=-1}
  document.querySelectorAll('.viewlinks a').forEach(a=>{if(/military value/i.test(a.textContent||''))a.remove()});

  const row=document.querySelector('.tabrow'),main=document.querySelector('main.main');
  if(!row||!main||document.querySelector('[data-view="savings"]'))return;
  const tab=document.createElement('button');tab.className='tab mrSavingsTab';tab.dataset.view='savings';tab.setAttribute('aria-selected','false');tab.textContent='Savings';
  const visible=[...row.querySelectorAll('.tab')].filter(x=>!x.hidden);
  const mid=Math.floor(visible.length/2);
  const anchor=visible[mid];
  if(anchor)row.insertBefore(tab,anchor.nextSibling);else row.appendChild(tab);

  const style=document.createElement('style');style.id='mrSavingsCenterStyle';style.textContent=`
    .mrSavingsTab{border-color:#8b7330!important;color:#ffd36d!important;background:#1b1a12!important;box-shadow:0 0 0 1px #ffd36d22,0 8px 22px #0003;transform:translateY(-1px)}
    .mrSavingsTab.active{background:#ffd36d!important;color:#02101d!important;border-color:#ffd36d!important;box-shadow:0 8px 24px #0005}
    .mr-savings-mode .hero .search{display:none!important}
    @media(min-width:760px){.tabrow{justify-content:center}.mrSavingsTab{padding-left:18px!important;padding-right:18px!important}}
    @media(max-width:700px){#mrLifestyleNav a.mr-save-primary{background:#392f12!important;color:#ffe899!important;box-shadow:inset 0 0 0 1px #8b7330,0 8px 24px #0005;transform:translateY(-4px);font-size:8px!important}#mrLifestyleNav a.mr-save-primary b{color:#ffd36d!important;font-size:17px!important}}
  `;document.head.appendChild(style);

  const section=document.createElement('section');section.className='section';section.id='savings';section.hidden=true;section.innerHTML='<div class="head"><div><h2>Savings</h2><small>DISCOUNTS • DEALS • MILITARY VALUE</small></div></div><div class="mr-embed-note">Check Mission Rated before you spend. Find and compare source-backed military savings without leaving Mission Rated Live. Ratings, verification, and paid relationships remain separate.</div><iframe class="mr-embed-frame" title="Mission Rated Savings" loading="eager" src="/savings.html?embedded=1"></iframe>';main.appendChild(section);

  const setMode=active=>{
    document.body.classList.toggle('mr-savings-mode',active);
    const save=nav?[...nav.querySelectorAll('a')].find(a=>a.classList.contains('mr-save-primary')):null;
    if(save){if(active)save.setAttribute('aria-current','page');else if(save.getAttribute('aria-current')==='page')save.removeAttribute('aria-current')}
  };
  const activate=()=>{
    document.querySelectorAll('.tab').forEach(x=>{const active=x===tab;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active))});
    document.querySelectorAll('.section').forEach(s=>s.hidden=s.id!=='savings');
    const category=document.getElementById('category'),city=document.getElementById('city');if(category)category.disabled=true;if(city)city.disabled=true;
    setMode(true);
    history.replaceState(null,'',PRIMARY);
  };
  tab.addEventListener('click',activate);
  row.querySelectorAll('.tab:not(.mrSavingsTab)').forEach(other=>other.addEventListener('click',()=>setMode(false)));
  if(liveView==='savings')activate();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,0),{once:true});else setTimeout(wire,0);
})();
