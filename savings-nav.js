(()=>{
'use strict';
const p=location.pathname.replace(/\/$/,'')||'/',params=new URLSearchParams(location.search),liveView=params.get('view');
const wire=()=>{
  const nav=document.getElementById('mrLifestyleNav');
  if(nav){
    const save=[...nav.querySelectorAll('a')].find(a=>a.textContent.trim().toUpperCase().includes('SAVE'));
    if(save){save.href='/savings';const active=p==='/savings'||p==='/savings.html';if(active)save.setAttribute('aria-current','page');else if(save.getAttribute('aria-current')==='page'&&(p==='/military-value'||p==='/military-value.html'))save.removeAttribute('aria-current')}
  }
  if(p!=='/')return;
  const links=document.querySelector('.viewlinks');
  if(links&&!links.querySelector('[href="savings.html"],[href="/savings"],[href="/savings.html"]')){
    const a=document.createElement('a');a.href='savings.html';a.textContent='Savings hub ↗';links.prepend(a);
  }
  const row=document.querySelector('.tabrow'),main=document.querySelector('main.main');
  if(!row||!main||document.querySelector('[data-view="savings"]'))return;
  const tab=document.createElement('button');tab.className='tab';tab.dataset.view='savings';tab.setAttribute('aria-selected','false');tab.textContent='Savings';row.appendChild(tab);
  const section=document.createElement('section');section.className='section';section.id='savings';section.hidden=true;section.innerHTML='<div class="head"><div><h2>Savings</h2><small>DISCOUNTS • DEALS • MILITARY VALUE</small></div></div><div class="mr-embed-note">Check Mission Rated before you spend. Compare source-backed military savings while keeping ratings, verification, and paid relationships separate.</div><iframe class="mr-embed-frame" title="Mission Rated Savings" loading="eager" src="/savings.html?embedded=1"></iframe>';main.appendChild(section);
  const activate=()=>{document.querySelectorAll('.tab').forEach(x=>{const active=x===tab;x.classList.toggle('active',active);x.setAttribute('aria-selected',String(active))});document.querySelectorAll('.section').forEach(s=>s.hidden=s.id!=='savings');const category=document.getElementById('category'),city=document.getElementById('city');if(category)category.disabled=true;if(city)city.disabled=true;history.replaceState(null,'','/?view=savings')};
  tab.addEventListener('click',activate);if(liveView==='savings')activate();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wire,0),{once:true});else setTimeout(wire,0);
})();
