(async()=>{
'use strict';
if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
const {SUPABASE_FUNCTIONS_ROOT}=await import('/lib/config.js');
const ROOT=SUPABASE_FUNCTIONS_ROOT,API=ROOT+'public-explore',MEDICAL=ROOT+'public-medical';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https:\/\//i.test(String(u||''))?String(u):'';
function css(){if(document.getElementById('mrCoverageStyle'))return;const s=document.createElement('style');s.id='mrCoverageStyle';s.textContent=`
.mrCoverage{margin-top:12px;border:1px solid #2d5267;border-radius:11px;background:#051725cc;padding:10px 11px}.mrCoverageHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}.mrCoverageTitle{font-size:8px;font-weight:950;letter-spacing:.1em;color:#8ef6ff}.mrCoverageTime{font-size:8px;color:#819ba6}.mrCoverageGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.mrCoverageItem{border:1px solid #29495b;border-radius:8px;background:#031522;padding:8px}.mrCoverageItem b{display:block;color:#ffd36d;font-size:15px}.mrCoverageItem span{font-size:8px;color:#a6bac4;line-height:1.35}.mrCoverageFoot{font-size:8px;color:#7f97a2;margin-top:7px;line-height:1.4}.mrTricare{margin-top:8px;padding:8px 9px;border:1px solid #236f61;border-radius:8px;background:#08251f}.mrTricareHead{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.mrTricareBadge{font-size:8px;font-weight:950;padding:4px 6px;border-radius:5px;border:1px solid #236f61;color:#8affdc}.mrTricarePending{font-size:8px;color:#ffd98d}.mrTricareMeta{margin-top:5px;font-size:8px;color:#9fb6c1;line-height:1.4}.mrTricareLink{display:inline-block;margin-top:6px;font-size:8px;color:#00e5ff;text-decoration:none}.mrTricareLink:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}
@media(max-width:700px){.mrCoverageGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.mrCoverageHead{align-items:flex-start;flex-direction:column;gap:3px}.mrTricare{padding:9px}.mrTricareLink{min-height:34px;display:inline-flex;align-items:center}}
`;document.head.appendChild(s)}
const pct=(n,d)=>d?Math.round(n/d*100):0;
function renderCoverage(j,medical){const businesses=j.businesses||[],deals=j.deals||[],schools=j.school_items||[],bases=j.installations||[],providers=medical?.providers||[];
 const sourcedBusinesses=businesses.filter(x=>/^https:\/\//i.test(String(x.source_url||''))||x.provenance_status==='sourced').length;
 const officialSchools=schools.filter(x=>x.official_verified).length;
 const officialBases=bases.filter(x=>x.official_verified).length;
 const sourcedDeals=deals.filter(x=>/^https:\/\//i.test(String(x.source_url||''))).length;
 const host=document.querySelector('.hero .status')?.parentElement||document.querySelector('.hero .wrap');if(!host)return;
 let el=document.getElementById('mrEvidenceCoverage');if(!el){el=document.createElement('div');el.id='mrEvidenceCoverage';el.className='mrCoverage';host.appendChild(el)}
 const generated=j.meta?.generated_at?String(j.meta.generated_at).slice(0,16).replace('T',' ')+'Z':'live';
 el.innerHTML=`<div class="mrCoverageHead"><div class="mrCoverageTitle">LIVE EVIDENCE COVERAGE</div><div class="mrCoverageTime">Dataset ${esc(generated)}</div></div><div class="mrCoverageGrid"><div class="mrCoverageItem"><b>${pct(sourcedBusinesses,businesses.length)}%</b><span>${sourcedBusinesses}/${businesses.length} places source-backed</span></div><div class="mrCoverageItem"><b>${sourcedDeals}</b><span>active offers with direct sources</span></div><div class="mrCoverageItem"><b>${pct(officialSchools,schools.length)}%</b><span>${officialSchools}/${schools.length} schools official-source verified</span></div><div class="mrCoverageItem"><b>${providers.length}</b><span>medical providers with source-backed TRICARE acceptance</span></div></div><div class="mrCoverageFoot">Coverage describes provenance only. It does not create a Mission Rated score, network-status claim, or User Verified state.</div>`;
}
function decorateMedical(medical){const providers=medical?.providers||[],byId=new Map(providers.map(x=>[String(x.id),x])),byName=new Map(providers.map(x=>[String(x.name||'').trim(),x]));if(!providers.length)return;
 const root=document.getElementById('businessGrid');if(!root)return;
 for(const card of root.querySelectorAll('.card')){if(card.querySelector('.mrTricare'))continue;const name=card.querySelector('h3,h2')?.textContent?.trim();const id=card.dataset?.businessId||card.getAttribute('data-id');const x=(id&&byId.get(String(id)))||byName.get(name);if(!x?.tricare_accepted)continue;
  const box=document.createElement('div');box.className='mrTricare';const checked=x.tricare_checked_at?String(x.tricare_checked_at).slice(0,10):'';const source=safe(x.tricare_source_url);box.innerHTML=`<div class="mrTricareHead"><span class="mrTricareBadge">TRICARE Accepted</span><span class="mrTricarePending">Network status: confirm</span></div><div class="mrTricareMeta">Source-backed acceptance${checked?` • checked ${esc(checked)}`:''}. Acceptance does not establish in-network status for every TRICARE plan.</div>${source?`<a class="mrTricareLink" href="${esc(source)}" target="_blank" rel="noopener noreferrer">Open TRICARE evidence ↗</a>`:''}`;
  const links=card.querySelector('.links');if(links)card.insertBefore(box,links);else card.appendChild(box);
 }
}
async function run(){css();try{const [a,m]=await Promise.all([fetch(API,{headers:{accept:'application/json'}}),fetch(MEDICAL,{headers:{accept:'application/json'}})]);if(!a.ok)throw Error(a.status);const j=await a.json(),medical=m.ok?await m.json():{providers:[]};renderCoverage(j,medical);let n=0,t=setInterval(()=>{decorateMedical(medical);if(++n>18)clearInterval(t)},300);decorateMedical(medical)}catch{/* base UI remains available */}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();