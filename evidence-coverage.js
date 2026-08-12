(()=>{
'use strict';
if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
const API='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/public-explore';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function css(){if(document.getElementById('mrCoverageStyle'))return;const s=document.createElement('style');s.id='mrCoverageStyle';s.textContent=`
.mrCoverage{margin-top:12px;border:1px solid #2d5267;border-radius:11px;background:#051725cc;padding:10px 11px}.mrCoverageHead{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}.mrCoverageTitle{font-size:8px;font-weight:950;letter-spacing:.1em;color:#8ef6ff}.mrCoverageTime{font-size:8px;color:#819ba6}.mrCoverageGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.mrCoverageItem{border:1px solid #29495b;border-radius:8px;background:#031522;padding:8px}.mrCoverageItem b{display:block;color:#ffd36d;font-size:15px}.mrCoverageItem span{font-size:8px;color:#a6bac4;line-height:1.35}.mrCoverageFoot{font-size:8px;color:#7f97a2;margin-top:7px;line-height:1.4}
@media(max-width:700px){.mrCoverageGrid{grid-template-columns:repeat(2,minmax(0,1fr))}.mrCoverageHead{align-items:flex-start;flex-direction:column;gap:3px}}
`;document.head.appendChild(s)}
const pct=(n,d)=>d?Math.round(n/d*100):0;
function render(j){const businesses=j.businesses||[],deals=j.deals||[],schools=j.school_items||[],bases=j.installations||[];
 const sourcedBusinesses=businesses.filter(x=>/^https:\/\//i.test(String(x.source_url||''))||x.provenance_status==='sourced').length;
 const officialSchools=schools.filter(x=>x.official_verified).length;
 const officialBases=bases.filter(x=>x.official_verified).length;
 const sourcedDeals=deals.filter(x=>/^https:\/\//i.test(String(x.source_url||''))).length;
 const host=document.querySelector('.hero .status')?.parentElement||document.querySelector('.hero .wrap');if(!host)return;
 let el=document.getElementById('mrEvidenceCoverage');if(!el){el=document.createElement('div');el.id='mrEvidenceCoverage';el.className='mrCoverage';host.appendChild(el)}
 const generated=j.meta?.generated_at?String(j.meta.generated_at).slice(0,16).replace('T',' ')+'Z':'live';
 el.innerHTML=`<div class="mrCoverageHead"><div class="mrCoverageTitle">LIVE EVIDENCE COVERAGE</div><div class="mrCoverageTime">Dataset ${esc(generated)}</div></div><div class="mrCoverageGrid"><div class="mrCoverageItem"><b>${pct(sourcedBusinesses,businesses.length)}%</b><span>${sourcedBusinesses}/${businesses.length} places source-backed</span></div><div class="mrCoverageItem"><b>${sourcedDeals}</b><span>active offers with direct sources</span></div><div class="mrCoverageItem"><b>${pct(officialSchools,schools.length)}%</b><span>${officialSchools}/${schools.length} schools official-source verified</span></div><div class="mrCoverageItem"><b>${pct(officialBases,bases.length)}%</b><span>${officialBases}/${bases.length} installations official-source verified</span></div></div><div class="mrCoverageFoot">Coverage describes provenance only. It does not create a Mission Rated score or a User Verified state.</div>`;
}
async function run(){css();try{const r=await fetch(API,{headers:{accept:'application/json'}});if(!r.ok)throw Error(r.status);render(await r.json())}catch{/* base UI remains available */}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
