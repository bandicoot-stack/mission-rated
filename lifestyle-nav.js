(()=>{
'use strict';
if(document.getElementById('mrLifestyleNav'))return;
const style=document.createElement('style');style.id='mrLifestyleNavStyle';style.textContent=`
#mrLifestyleNav{display:none}
@media(max-width:700px){body{padding-bottom:74px}#mrLifestyleNav{position:fixed;left:10px;right:10px;bottom:max(10px,env(safe-area-inset-bottom));z-index:9998;display:grid;grid-template-columns:repeat(5,1fr);gap:4px;padding:6px;background:#03111ff2;border:1px solid #2c536a;border-radius:16px;box-shadow:0 12px 36px #0009;backdrop-filter:blur(14px)}#mrLifestyleNav a{min-width:0;padding:8px 3px;border-radius:10px;color:#9fb6c1;text-decoration:none;text-align:center;font-size:8px;font-weight:850;line-height:1.2}#mrLifestyleNav a b{display:block;color:#f4f8fa;font-size:13px;margin-bottom:2px}#mrLifestyleNav a[aria-current=page]{background:#092b3b;color:#7defff;box-shadow:inset 0 0 0 1px #1e6078}#mrLifestyleNav a:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}}
`;document.head.appendChild(style);
const p=location.pathname.replace(/\/$/,'')||'/';
const items=[
 {href:'/neighborhoods',icon:'⌂',label:'LIVE',match:['/neighborhoods']},
 {href:'/support',icon:'✚',label:'SUPPORT',match:['/support','/bases','/schools']},
 {href:'/military-value',icon:'$',label:'SAVE',match:['/military-value']},
 {href:'/community',icon:'★',label:'REVIEWS',match:['/community']},
 {href:'/buy-a-car',icon:'▣',label:'CARS',match:['/buy-a-car']}
];
const nav=document.createElement('nav');nav.id='mrLifestyleNav';nav.setAttribute('aria-label','Mission Rated lifestyle navigation');
nav.innerHTML=items.map(x=>{const active=x.match.some(m=>p===m||p===m+'.html');return `<a href="${x.href}"${active?' aria-current="page"':''}><b aria-hidden="true">${x.icon}</b>${x.label}</a>`}).join('');
document.body.appendChild(nav);
})();
