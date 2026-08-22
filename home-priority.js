(()=>{
  if(!['/','/index.html'].includes(location.pathname)) return;
  const API='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/today-deals';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe=u=>/^https:\/\//i.test(String(u||''))?String(u):'';
  const main=document.querySelector('main.main'),tabs=document.querySelector('.tabrow'),searchInput=document.getElementById('q');
  if(!main||!tabs) return;
  let dealData=null;

  const existingBusinesses=document.getElementById('places');
  const existingSchools=document.getElementById('schools');
  if(existingBusinesses){
    existingBusinesses.id='businesses';
    const h=existingBusinesses.querySelector('h2'); if(h) h.textContent='Businesses';
    const s=existingBusinesses.querySelector('small'); if(s) s.textContent='MILITARY-FRIENDLY BUSINESSES • VERIFIED VALUE FIRST';
  }

  const mkSection=(id,title,sub)=>{const s=document.createElement('section');s.className='section';s.id=id;s.hidden=true;s.innerHTML=`<div class="head"><div><h2>${title}</h2><small>${sub}</small></div></div><div class="grid" id="${id}Grid"><div class="empty">Loading…</div></div>`;main.prepend(s);return s};
  const today=mkSection('today','Today’s Deals','WHAT YOU CAN USE RIGHT NOW');
  const local=mkSection('local-deals','Local Deals','HAMPTON ROADS SAVINGS');
  const everyday=mkSection('everyday-deals','Everyday Deals','ONGOING MILITARY SAVINGS');
  const places=mkSection('places','Places','NEIGHBORHOODS • LOCAL INTEL • THINGS TO DO');

  places.querySelector('#placesGrid').innerHTML=`
    <article class="card hot"><span class="badge good">LOCAL INTEL</span><h3>Neighborhoods</h3><p class="muted">Military-family perspective on where to live around Hampton Roads.</p><div class="links"><a class="btn" href="/neighborhoods.html">Explore neighborhoods →</a></div></article>
    <article class="card"><span class="badge official">WHAT’S HAPPENING</span><h3>This Week</h3><p class="muted">Source-backed local events, family activities and military life opportunities.</p><div class="links"><a class="btn" href="/this-week.html">See this week →</a></div></article>
    <article class="card"><span class="badge">LOCAL DISCOVERY</span><h3>Local Intel</h3><p class="muted">Public local content and useful Hampton Roads discoveries curated for military families.</p><div class="links"><a class="btn" href="/local-intel.html">Open local intel →</a></div></article>`;

  const dealCard=(d,label)=>{
    const b=d.business||{},source=safe(d.source_url),website=safe(b.website_url),id=esc(d.id||'');
    const sourceAction=source?`<a class="btn mrDealAction" data-deal-action="get-deal" data-deal-source="verified-source" href="${esc(source)}" target="_blank" rel="noopener noreferrer">Verify & use deal ↗</a>`:'';
    const websiteAction=website&&website!==source?`<a class="btn" href="${esc(website)}" target="_blank" rel="noopener noreferrer">Official website ↗</a>`:'';
    const fallbackAction=!source&&website?`<a class="btn" href="${esc(website)}" target="_blank" rel="noopener noreferrer">Visit business ↗</a>`:'';
    const trustCue=source?'<span class="badge official">SOURCE-BACKED</span>':'<span class="badge">BUSINESS SITE</span>';
    return `<article class="card hot"${id?` data-id="${id}"`:''}${source?' data-deal-source="verified-source"':''}><div class="badges"><span class="badge good">${label}</span>${trustCue}${d.recurrence_label?`<span class="badge">${esc(d.recurrence_label)}</span>`:''}</div><h3>${esc(b.name||d.title||'Military savings')}</h3><div class="offer">${esc(d.offer_value_text||d.title||'Military savings')}</div><p class="muted">${esc(d.description||d.terms||'Source-backed military savings.')}</p><div class="links">${sourceAction}${websiteAction}${fallbackAction}</div></article>`;
  };
  const hamptonRoads=new Set(['chesapeake','hampton','newport news','norfolk','poquoson','portsmouth','suffolk','virginia beach','williamsburg','yorktown']);
  const isLocal=d=>{const b=d.business||{};return String(b.state||'').trim().toUpperCase()==='VA'&&hamptonRoads.has(String(b.city||'').trim().toLowerCase())};
  const searchText=d=>{const b=d.business||{};return [b.name,b.city,b.category,d.title,d.offer_value_text,d.description,d.terms,d.recurrence_label].filter(Boolean).join(' ').toLowerCase()};
  const filterDeals=rows=>{const q=String(searchInput?.value||'').trim().toLowerCase();return q?rows.filter(d=>searchText(d).includes(q)):rows};
  const emptySearch=()=>{const q=String(searchInput?.value||'').trim();return q?`<div class="empty">No deals match “${esc(q)}”. <button type="button" class="btn" data-clear-deal-search>Clear search</button></div>`:''};
  const bindClear=()=>document.querySelectorAll('[data-clear-deal-search]').forEach(btn=>btn.addEventListener('click',()=>{if(!searchInput)return;searchInput.value='';searchInput.focus();render(dealData||{})}));
  const render=(data)=>{
    dealData=data;
    const specific=data.today_specific||[],all=data.everyday||[];
    const pool=[...specific,...all].filter((d,i,a)=>a.findIndex(x=>String(x.id||x.title)===String(d.id||d.title))===i);
    const localDeals=filterDeals(pool.filter(isLocal)).slice(0,12);
    const todayBase=(specific.length?specific:all),todayDeals=filterDeals(todayBase).slice(0,9),everydayDeals=filterDeals(all).slice(0,12);
    today.querySelector('#todayGrid').innerHTML=todayDeals.length?todayDeals.map(d=>dealCard(d,specific.length?'TODAY':'AVAILABLE TODAY')).join(''):emptySearch()||'<div class="empty">No verified deals are available right now.</div>';
    local.querySelector('#local-dealsGrid').innerHTML=localDeals.length?localDeals.map(d=>dealCard(d,'LOCAL DEAL')).join(''):emptySearch()||'<div class="empty">No verified Hampton Roads deals are available right now. Local coverage is still building.</div>';
    everyday.querySelector('#everyday-dealsGrid').innerHTML=everydayDeals.length?everydayDeals.map(d=>dealCard(d,'EVERYDAY DEAL')).join(''):emptySearch()||'<div class="empty">Everyday military deal coverage is still building.</div>';
    bindClear();
  };

  const order=[['today','Today’s Deals'],['labor-day','Labor Day'],['local-deals','Local Deals'],['everyday-deals','Everyday Deals'],['places','Places'],['businesses','Businesses'],['schools','Schools']];
  tabs.innerHTML='';
  const show=id=>{document.querySelectorAll('main.main > .section').forEach(s=>s.hidden=s.id!==id);tabs.querySelectorAll('.tab').forEach(b=>{const on=b.dataset.view===id;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});};
  order.forEach(([id,label])=>{const b=document.createElement('button');b.className='tab';b.dataset.view=id;b.setAttribute('aria-selected','false');b.textContent=label;b.addEventListener('click',()=>{if(id==='labor-day'){location.href='/labor-day.html';return}show(id)});tabs.appendChild(b)});
  show('today');
  searchInput?.addEventListener('input',()=>{if(dealData)render(dealData)});
  document.getElementById('mrTodayDeals')?.remove();
  document.getElementById('mrLaborDay')?.remove();
  fetch(API,{headers:{accept:'application/json'}}).then(r=>r.ok?r.json():Promise.reject()).then(j=>{if(j?.ok)render(j)}).catch(()=>{today.querySelector('#todayGrid').innerHTML='<div class="empty">Today’s deals are temporarily unavailable.</div>';local.querySelector('#local-dealsGrid').innerHTML='<div class="empty">Local deals are temporarily unavailable.</div>';everyday.querySelector('#everyday-dealsGrid').innerHTML='<div class="empty">Everyday deals are temporarily unavailable.</div>'});
})();
