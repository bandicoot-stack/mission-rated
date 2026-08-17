(()=>{
'use strict';
if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
const hero=document.querySelector('.hero .wrap');
if(!hero||document.getElementById('mrIntent'))return;
const style=document.createElement('style');
style.textContent=`
#mrIntent{margin-top:20px;padding:16px;border:1px solid #315a73;border-radius:14px;background:linear-gradient(145deg,#061b2de8,#041521e8);box-shadow:0 18px 50px #0004}
#mrIntent .mr-intent-kicker{font-size:10px;font-weight:900;letter-spacing:.12em;color:#ffd36d;margin-bottom:5px}
#mrIntent h2{font-size:20px;margin:0 0 12px}
#mrIntent .mr-intent-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
#mrIntent .mr-intent{display:flex;align-items:center;gap:8px;min-height:46px;padding:10px 12px;border:1px solid #31566b;border-radius:10px;background:#08263a;color:#eef9fb;text-decoration:none;font-size:11px;font-weight:850;cursor:pointer;text-align:left}
#mrIntent .mr-intent:hover{border-color:#00e5ff;background:#0a3048;transform:translateY(-1px)}
#mrIntent .mr-intent.primary{border-color:#167482;background:#07323b}
#mrIntent .mr-intent-icon{font-size:16px}
@media(max-width:700px){#mrIntent .mr-intent-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:430px){#mrIntent .mr-intent-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(style);
const box=document.createElement('section');
box.id='mrIntent';
box.setAttribute('aria-labelledby','mrIntentTitle');
box.innerHTML=`<div class="mr-intent-kicker">START HERE</div><h2 id="mrIntentTitle">What do you need today?</h2><div class="mr-intent-grid">
<a class="mr-intent primary" href="#places" data-intent="find_business" data-view="places"><span class="mr-intent-icon">⌕</span>Find a military-friendly business</a>
<a class="mr-intent primary" href="/military-value.html" data-intent="military_discounts"><span class="mr-intent-icon">$</span>Find military discounts</a>
<a class="mr-intent" href="/events.html" data-intent="events"><span class="mr-intent-icon">★</span>Events & things to do</a>
<a class="mr-intent" href="/buy-a-car.html" data-intent="buy_car"><span class="mr-intent-icon">↗</span>Buy a Car</a>
<a class="mr-intent" href="/neighborhoods.html" data-intent="neighborhoods"><span class="mr-intent-icon">⌂</span>Explore neighborhoods</a>
<a class="mr-intent" href="/support.html" data-intent="family_resources"><span class="mr-intent-icon">+</span>Family resources</a>
</div></section>`;
const search=hero.querySelector('.search');
hero.insertBefore(box,search||null);
box.addEventListener('click',e=>{
 const a=e.target.closest('[data-intent]');if(!a)return;
 window.mrTrack?.('homepage_intent_selected',{intent:a.dataset.intent,destination:a.getAttribute('href')});
 if(a.dataset.view){e.preventDefault();const tab=document.querySelector(`.tab[data-view="${a.dataset.view}"]`);tab?.click();document.getElementById(a.dataset.view)?.scrollIntoView({behavior:'smooth',block:'start'});}
});
})();
