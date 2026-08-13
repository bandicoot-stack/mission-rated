(()=>{
'use strict';
if(document.getElementById('mrLifestyleNav'))return;
const style=document.createElement('style');style.id='mrLifestyleNavStyle';style.textContent=`
#mrLifestyleNav{display:none}.mr-embed-frame{width:100%;height:900px;border:0;border-radius:14px;background:#02101d}.mr-embed-note{border-left:3px solid #00e5ff;background:#071d2c;color:#9fb3bd;padding:10px 12px;font-size:10px;line-height:1.45;margin-bottom:12px}
@media(max-width:700px){body{padding-bottom:78px}#mrLifestyleNav{position:fixed;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom));z-index:9998;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(62px,1fr);gap:4px;padding:6px;background:#03111ff2;border:1px solid #2c536a;border-radius:16px;box-shadow:0 12px 36px #0009;backdrop-filter:blur(14px);overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none}#mrLifestyleNav::-webkit-scrollbar{display:none}#mrLifestyleNav a{min-width:0;padding:8px 3px;border-radius:10px;color:#9fb6c1;text-decoration:none;text-align:center;font-size:7px;font-weight:850;line-height:1.2;scroll-snap-align:center}#mrLifestyleNav a b{display:block;color:#f4f8fa;font-size:13px;margin-bottom:2px}#mrLifestyleNav a[aria-current=page]{background:#092b3b;color:#7defff;box-shadow:inset 0 0 0 1px #1e6078}#mrLifestyleNav a:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}}
`;document.head.appendChild(style);
const p=location.pathname.replace(/\/$/,'')||'/',params=new URLSearchParams(location.search),liveView=params.get('view');
const items=[
 {href:'/neighborhoods',icon:'⌂',label:'LIVE',match:['/neighborhoods']},
 {href:'/?view=events',icon:'♪',label:'EVENTS',match:['/events']},
 {href:'/?view=support',icon:'✚',label:'SUPPORT',match:['/support']},
 {href:'/medical',icon:'+',label:'CARE',match:['/medical']},
 {href:'/military-value',icon:'$',label:'SAVE',match:['/military-value']},
 {href:'/community',icon:'★',label:'REVIEWS',match:['/community']},
 {href:'/?view=cars',icon:'▣',label:'CARS',match:[]}
];
const nav=document.createElement('nav');nav.id='mrLifestyleNav';nav.setAttribute('aria-label','Mission Rated lifestyle navigation');
nav.innerHTML=items.map(x=>{const active=x.match.some(m=>p===m||p===m+'.html')||(p==='/'&&((x.label==='CARS'&&liveView==='cars')||(x.label==='SUPPORT'&&liveView==='support')||(x.label==='EVENTS'&&liveView==='events')));return `<a href="${x.href}"${active?' aria-current="page"':''}><b aria-hidden="true">${x.icon}</b>${x.label}</a>`}).join('');
document.body.appendChild(nav);
const current=nav.querySelector('[aria-current="page"]');if(current)requestAnimationFrame(()=>current.scrollIntoView({block:'nearest',inline:'center'}));
if(p==='/'){
 const row=document.querySelector('.tabrow'),main=document.querySelector('main.main');
 if(row&&main){
  const installView=({id,label,small,note,src})=>{
   if(document.querySelector(`[data-view="${id}"]`))return null;
   const tab=document.createElement('button');tab.className='tab';tab.dataset.view=id;tab.setAttribute('aria-selected','false');tab.textContent=label;row.appendChild(tab);
   const section=document.createElement('section');section.className='section';section.id=id;section.hidden=true;section.innerHTML=`<div class="head"><div><h2>${label}</h2><small>${small}</small></div></div><div class="mr-embed-note">${note}</div><iframe class="mr-embed-frame" title="Mission Rated ${label}" loading="eager" src="${src}"></iframe>`;main.appendChild(section);
   const activate=()=>{document.querySelectorAll('.tab').forEach(x=>{const active=x===tab;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active))});document.querySelectorAll('.section').forEach(s=>s.hidden=s.id!==id);const category=document.getElementById('category'),city=document.getElementById('city');if(category)category.disabled=true;if(city)city.disabled=true;history.replaceState(null,'',`/?view=${id}`)};
   tab.addEventListener('click',activate);return {tab,activate};
  };
  const events=installView({id:'events',label:'Events',small:'CONCERTS • FESTIVALS • FAMILY • SPORTS',note:'Source-backed special events across Hampton Roads. Dates, free admission and other claims are shown only when supported by the linked public source.',src:'/events.html?embedded=1'});
  const support=installView({id:'support',label:'Support',small:'FAMILY • MONEY • CAREER • MOVING • DEPLOYMENT',note:'Find authoritative military and family support resources without leaving Mission Rated Live. Every resource remains MR Building until Mission Rated has enough first-party evidence for its own score.',src:'/support.html?embedded=1'});
  const cars=installView({id:'cars',label:'Buy a Car',small:'DEALERS • SALESPEOPLE • DEAL CHECK',note:'Start with people worth buying from. Dealer ratings and sourced salesperson mentions stay separate from Mission Rated reputation; thin evidence remains MR Building.',src:'/buy-a-car.html?embedded=1'});
  if(liveView==='events')events?.activate();else if(liveView==='support')support?.activate();else if(liveView==='cars')cars?.activate();
 }
}
})();