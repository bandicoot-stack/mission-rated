(async()=>{
'use strict';
const {SUPABASE_FUNCTIONS_ROOT}=await import('/lib/config.js');
const ROOT=SUPABASE_FUNCTIONS_ROOT;
const safeText=s=>String(s??'').trim();
const key=s=>safeText(s).toLowerCase();
const destination=x=>{
  const lat=Number(x?.latitude),lng=Number(x?.longitude);
  if(Number.isFinite(lat)&&Number.isFinite(lng))return `${lat},${lng}`;
  const address=[x?.address_line1||x?.address,x?.city,x?.state,x?.postal_code].map(safeText).filter(Boolean).join(', ');
  return address||[x?.name,x?.city,x?.state].map(safeText).filter(Boolean).join(', ');
};
const mapsUrl=x=>{const d=destination(x);return d?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(d)}`:''};
function css(){if(document.getElementById('mrDirectionsStyle'))return;const s=document.createElement('style');s.id='mrDirectionsStyle';s.textContent='.mrDirections{display:inline-flex;align-items:center;justify-content:center;gap:5px;border:1px solid #2f7c91;background:#073047;color:#c9f6ff!important;border-radius:8px;padding:8px 10px;font-size:9px;font-weight:900;text-decoration:none;white-space:nowrap}.mrDirections:hover{border-color:#00e5ff}.mrDirections:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}@media(max-width:640px){.mrDirections{min-height:42px;flex:1;min-width:120px;font-size:10px}}';document.head.appendChild(s)}
function add(card,item){if(!card||card.querySelector('.mrDirections'))return;const href=mapsUrl(item);if(!href)return;const a=document.createElement('a');a.className='mrDirections';a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`Directions to ${safeText(item.name)||'this location'}`);a.textContent='↗ Directions';const links=card.querySelector('.links')||card.querySelector('.actions');if(links)links.appendChild(a);else card.appendChild(a)}
function mapByName(rows){return new Map((rows||[]).map(x=>[key(x.name),x]))}
function applyList(root,map){if(!root)return;for(const card of root.querySelectorAll('.card')){const name=card.querySelector('h2,h3')?.textContent;if(!name)continue;const item=map.get(key(name));if(item)add(card,item)}}
async function run(){css();let explore={businesses:[],installations:[]},medical={providers:[]};try{const [a,b]=await Promise.allSettled([fetch(ROOT+'public-explore').then(r=>r.ok?r.json():null),fetch(ROOT+'public-medical').then(r=>r.ok?r.json():null)]);if(a.status==='fulfilled'&&a.value)explore=a.value;if(b.status==='fulfilled'&&b.value)medical=b.value}catch{}
  const businesses=mapByName(explore.businesses),installations=mapByName(explore.installations),providers=mapByName(medical.providers);
  const p=location.pathname.replace(/\/$/,'')||'/';
  const apply=()=>{
    if(p==='/'){applyList(document.getElementById('businessGrid'),businesses);applyList(document.getElementById('baseGrid'),installations)}
    if(p==='/medical'||p==='/medical.html')applyList(document.getElementById('grid'),providers);
    if(p==='/bases'||p==='/bases.html')applyList(document.getElementById('grid'),installations);
    if(p==='/business'||p==='/business.html'){const name=document.getElementById('name')?.textContent,item=businesses.get(key(name));if(item)add(document.querySelector('#content .card'),item)}
    if(p==='/installation'||p==='/installation.html'){const name=document.querySelector('h1')?.textContent,item=installations.get(key(name));if(item)add(document.querySelector('.card'),item)}
  };
  apply();let n=0;const t=setInterval(()=>{apply();if(++n>18)clearInterval(t)},350);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();