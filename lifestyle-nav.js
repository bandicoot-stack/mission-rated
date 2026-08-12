(()=>{
'use strict';
if(document.getElementById('mrLifestyleNav'))return;
const style=document.createElement('style');style.id='mrLifestyleNavStyle';style.textContent=`
#mrLifestyleNav{display:none}.mr-car-frame{width:100%;height:900px;border:0;border-radius:14px;background:#02101d}.mr-car-note{border-left:3px solid #00e5ff;background:#071d2c;color:#9fb3bd;padding:10px 12px;font-size:10px;line-height:1.45;margin-bottom:12px}
@media(max-width:700px){body{padding-bottom:74px}#mrLifestyleNav{position:fixed;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom));z-index:9998;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:6px;background:#03111ff2;border:1px solid #2c536a;border-radius:16px;box-shadow:0 12px 36px #0009;backdrop-filter:blur(14px)}#mrLifestyleNav a{min-width:0;padding:8px 3px;border-radius:10px;color:#9fb6c1;text-decoration:none;text-align:center;font-size:8px;font-weight:850;line-height:1.2}#mrLifestyleNav a b{display:block;color:#f4f8fa;font-size:13px;margin-bottom:2px}#mrLifestyleNav a[aria-current=page]{background:#092b3b;color:#7defff;box-shadow:inset 0 0 0 1px #1e6078}#mrLifestyleNav a:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}}
`;document.head.appendChild(style);
const p=location.pathname.replace(/\/$/,'')||'/';
const items=[
 {href:'/neighborhoods',icon:'⌂',label:'LIVE',match:['/neighborhoods']},
 {href:'/support',icon:'✚',label:'SUPPORT',match:['/support','/bases','/schools']},
 {href:'/military-value',icon:'$',label:'SAVE',match:['/military-value']},
 {href:'/community',icon:'★',label:'REVIEWS',match:['/community']},
 {href:'/?view=cars',icon:'▣',label:'CARS',match:[]}
];
const nav=document.createElement('nav');nav.id='mrLifestyleNav';nav.setAttribute('aria-label','Mission Rated lifestyle navigation');
nav.innerHTML=items.map(x=>{const active=x.match.some(m=>p===m||p===m+'.html')||(x.label==='CARS'&&p==='/'&&new URLSearchParams(location.search).get('view')==='cars');return `<a href="${x.href}"${active?' aria-current="page"':''}><b aria-hidden="true">${x.icon}</b>${x.label}</a>`}).join('');
document.body.appendChild(nav);

if(p==='/'){
 const row=document.querySelector('.tabrow'),main=document.querySelector('main.main');
 if(row&&main&&!document.querySelector('[data-view="cars"]')){
  const tab=document.createElement('button');tab.className='tab';tab.dataset.view='cars';tab.setAttribute('aria-selected','false');tab.textContent='Buy a Car';row.appendChild(tab);
  const section=document.createElement('section');section.className='section';section.id='cars';section.hidden=true;section.innerHTML='<div class="head"><div><h2>Buy a Car</h2><small>DEALERS • SALESPEOPLE • DEAL CHECK</small></div></div><div class="mr-car-note">Start with people worth buying from. Dealer ratings and sourced salesperson mentions stay separate from Mission Rated reputation; thin evidence remains MR Building.</div><iframe class="mr-car-frame" title="Mission Rated Buy a Car" loading="eager" src="/buy-a-car.html?embedded=1"></iframe>';main.appendChild(section);
  const frame=section.querySelector('.mr-car-frame');
  window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow||e.data?.type!=='mr-car-height')return;const h=Number(e.data.height);if(Number.isFinite(h)&&h>300&&h<5000)frame.style.height=`${h}px`});
  const activate=()=>{
   document.querySelectorAll('.tab').forEach(x=>{const active=x===tab;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active))});
   document.querySelectorAll('.section').forEach(s=>s.hidden=s.id!=='cars');
   const category=document.getElementById('category'),city=document.getElementById('city');if(category)category.disabled=true;if(city)city.disabled=true;
   history.replaceState(null,'','/?view=cars');
  };
  tab.addEventListener('click',activate);
  if(new URLSearchParams(location.search).get('view')==='cars')activate();
 }
}
})();
