(()=>{
'use strict';
const API='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/public-explore';
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,Number(n)||0));
const pct=(rating,scale=5)=>clamp((Number(rating)||0)/(Number(scale)||5)*100);
const confidence=n=>{n=Number(n)||0;return n>=500?1:n>=100?.9:n>=25?.8:n>=5?.65:n>0?.5:0};
const normalizeFramework=n=>clamp(Number(n)||0);
const offerScore=x=>{const t=`${x?.best_military_offer?.value||''} ${x?.best_military_offer?.title||''}`.toLowerCase();if(/free|complimentary|100%/.test(t))return 100;const p=t.match(/(\d+(?:\.\d+)?)\s*%/);if(p)return clamp(Number(p[1])*4);const d=t.match(/\$(\d+(?:\.\d+)?)\s*(?:off|discount|savings?)/);if(d)return clamp(Number(d[1])*8);return x?.has_active_military_offer?45:0};
function businessOpen(x){
 if(x?.mission_score_status==='rated'&&x?.mission_score!=null)return {score:clamp(x.mission_score),kind:'native',evidence:'Mission Rated reviews'};
 const r=x?.public_rating;const rc=r?.rating!=null?confidence(r?.sample_size):0;const review=r?.rating!=null?pct(r.rating,r.scale||5):0;
 const military=offerScore(x),official=x?.official_verified?100:0,user=x?.community_verified?100:0;
 const weights=[]; if(rc)weights.push([review,.55*rc]); if(military)weights.push([military,.25]); if(official)weights.push([official,.15]); if(user)weights.push([user,.05]);
 const den=weights.reduce((s,[,w])=>s+w,0); if(den<.30)return null;
 return {score:Math.round(weights.reduce((s,[v,w])=>s+v*w,0)/den),kind:'open',evidence:[r?.rating!=null?'public reviews':null,military?'military value':null,official?'official sources':null,user?'user verification':null].filter(Boolean).join(' + ')};
}
function schoolOpen(x){
 if(x?.mission_score_status==='rated'&&x?.mission_score!=null)return {score:clamp(x.mission_score),kind:'native',evidence:'Mission Rated reviews'};
 const framework=x?.framework_score!=null?normalizeFramework(x.framework_score):null; const perf=String(x?.performance_level||'').toLowerCase(); const accred=String(x?.accreditation_status||'').toLowerCase();
 let parts=[]; if(framework!=null)parts.push([framework,.65]); if(/distinguished/.test(perf))parts.push([100,.15]); else if(/on track/.test(perf))parts.push([85,.15]); else if(/off track/.test(perf))parts.push([70,.15]); else if(/intensive/.test(perf))parts.push([55,.15]); if(/fully|accredited/.test(accred))parts.push([95,.10]); if(x?.purple_star_status)parts.push([100,.10]);
 const den=parts.reduce((s,[,w])=>s+w,0); if(den<.55)return null; return {score:Math.round(parts.reduce((s,[v,w])=>s+v*w,0)/den),kind:'open',evidence:'VDOE performance + military-family support'};
}
function baseOpen(x){
 if(x?.mission_score_status==='rated'&&x?.mission_score!=null)return {score:clamp(x.mission_score),kind:'native',evidence:'Mission Rated reviews'};
 const signals=Math.min(100,(Number(x?.signal_count)||0)*12); const school=x?.school_liaison?100:0,pcs=x?.pcs_support?100:0,official=x?.official_verified?100:0;
 const parts=[[signals,.40],[school,.25],[pcs,.25],[official,.10]].filter(([v])=>v>0); const den=parts.reduce((s,[,w])=>s+w,0); if(den<.35)return null;
 return {score:Math.round(parts.reduce((s,[v,w])=>s+v*w,0)/den),kind:'open',evidence:'verified PCS/family-readiness evidence'};
}
function style(){if(document.getElementById('mr-rank-style'))return;const s=document.createElement('style');s.id='mr-rank-style';s.textContent=`.mrHeroScore{display:flex;align-items:center;gap:10px;margin:9px 0 4px}.mrBig{font-size:42px;line-height:.9;font-weight:1000;letter-spacing:-.04em;color:#ffd36d}.mrBig small{display:block;font-size:8px;letter-spacing:.12em;color:#99b0bb;margin-bottom:4px}.mrRank{font-size:10px;font-weight:950;color:#00e5ff}.mrWhy{font-size:8px;color:#8fa6b0;margin-top:3px}.card[data-mr-ranked="1"]{border-color:#7e6a32}.card[data-mr-ranked="2"],.card[data-mr-ranked="3"]{border-color:#3d6579}.mrLegend{margin:0 0 12px;padding:9px 11px;border:1px solid #31566b;border-radius:9px;background:#061b2d;color:#9fb3bd;font-size:9px}.mrLegend b{color:#ffd36d}`;document.head.appendChild(s)}
function insert(card,result,rank,total,label){if(!card||!result)return;const old=card.querySelector('.mrHeroScore');if(old)old.remove();card.dataset.mrRanked=String(rank);const h=card.querySelector('h3');if(!h)return;const d=document.createElement('div');d.className='mrHeroScore';d.innerHTML=`<div class="mrBig"><small>${result.kind==='native'?'MISSION RATED':'MR OPEN'}</small>${result.score}</div><div><div class="mrRank">#${rank} of ${total} ${label}</div><div class="mrWhy">${result.evidence}</div></div>`;h.insertAdjacentElement('afterend',d)}
function rankGrid(gridId,data,scoreFn,label){const grid=document.getElementById(gridId);if(!grid||!Array.isArray(data)||!data.length)return;const scored=data.map(x=>({x,r:scoreFn(x)})).filter(o=>o.r).sort((a,b)=>b.r.score-a.r.score);const rank=new Map(scored.map((o,i)=>[String(o.x.name||o.x.title||o.x.businesses?.name||'').trim(),{...o.r,rank:i+1}]));const cards=[...grid.querySelectorAll('.card')];cards.forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();const rr=rank.get(name);if(rr)insert(card,rr,rr.rank,scored.length,label)});cards.sort((a,b)=>(Number(a.dataset.mrRanked)||999)-(Number(b.dataset.mrRanked)||999)).forEach(c=>grid.appendChild(c));}
function addLegend(id,text){const sec=document.getElementById(id);if(!sec||sec.querySelector('.mrLegend'))return;const context=sec.querySelector('.context');const d=document.createElement('div');d.className='mrLegend';d.innerHTML=`<b>MR Open ranking:</b> ${text} Native Mission Rated reviews will replace the open-evidence score when sufficient.`;(context||sec.firstElementChild)?.insertAdjacentElement(context?'afterend':'afterend',d)}
async function run(){style();let j;try{const r=await fetch(API,{headers:{accept:'application/json'}});if(!r.ok)return;j=await r.json()}catch{return}
 addLegend('places','derived from available public review signals, verified military value and source confidence.');
 addLegend('schools','derived from VDOE performance/accreditation and military-family support signals.');
 addLegend('bases','derived from verified PCS/family-readiness evidence currently available; it is not a quality-of-life review score.');
 const apply=()=>{rankGrid('businessGrid',j.businesses,businessOpen,'places');rankGrid('schoolGrid',j.school_items,schoolOpen,'schools');rankGrid('baseGrid',j.installations,baseOpen,'bases');};
 apply();const obs=new MutationObserver(()=>apply());['businessGrid','schoolGrid','baseGrid'].forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el,{childList:true,subtree:false})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
