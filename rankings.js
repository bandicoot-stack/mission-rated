(async()=>{
'use strict';
const {SUPABASE_FUNCTIONS_ROOT}=await import('/lib/config.js');
const API=SUPABASE_FUNCTIONS_ROOT+'public-explore';
const RATINGS_API=SUPABASE_FUNCTIONS_ROOT+'public-installation-ratings';
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,Number(n)||0));
const pct=(rating,scale=5)=>clamp((Number(rating)||0)/(Number(scale)||5)*100);
const confidence=n=>{n=Number(n)||0;return n>=500?1:n>=100?.9:n>=25?.8:n>=5?.65:n>0?.5:0};
const normalizeFramework=n=>clamp(Number(n)||0);
const offerScore=x=>{const t=`${x?.best_military_offer?.value||''} ${x?.best_military_offer?.title||''}`.toLowerCase();if(/free|complimentary|100%/.test(t))return 100;const p=t.match(/(\d+(?:\.\d+)?)\s*%/);if(p)return clamp(Number(p[1])*4);const d=t.match(/\$(\d+(?:\.\d+)?)\s*(?:off|discount|savings?)/);if(d)return clamp(Number(d[1])*8);return x?.has_active_military_offer?45:0};
function businessOpen(x){
 if(x?.mission_score_status==='rated'&&x?.mission_score!=null)return {score:clamp(x.mission_score),kind:'native',evidence:'Mission Rated reviews'};
 const r=x?.public_rating,rc=r?.rating!=null?confidence(r?.sample_size):0,review=r?.rating!=null?pct(r.rating,r.scale||5):0;
 const military=offerScore(x),official=x?.official_verified?100:0,user=x?.community_verified?100:0,parts=[];
 if(rc)parts.push([review,.55*rc]);if(military)parts.push([military,.25]);if(official)parts.push([official,.15]);if(user)parts.push([user,.05]);
 const den=parts.reduce((s,[,w])=>s+w,0);if(den<.30)return null;
 return {score:Math.round(parts.reduce((s,[v,w])=>s+v*w,0)/den),kind:'open',evidence:[r?.rating!=null?'public reviews':null,military?'military value':null,official?'official sources':null,user?'user verification':null].filter(Boolean).join(' + ')};
}
function schoolOpen(x){
 if(x?.mission_score_status==='rated'&&x?.mission_score!=null)return {score:clamp(x.mission_score),kind:'native',evidence:'Mission Rated reviews'};
 const framework=x?.framework_score!=null?normalizeFramework(x.framework_score):null,perf=String(x?.performance_level||'').toLowerCase(),accred=String(x?.accreditation_status||'').toLowerCase(),parts=[];
 if(framework!=null)parts.push([framework,.65]);if(/distinguished/.test(perf))parts.push([100,.15]);else if(/on track/.test(perf))parts.push([85,.15]);else if(/off track/.test(perf))parts.push([70,.15]);else if(/intensive/.test(perf))parts.push([55,.15]);if(/fully|accredited/.test(accred))parts.push([95,.10]);if(x?.purple_star_status)parts.push([100,.10]);
 const den=parts.reduce((s,[,w])=>s+w,0);if(den<.55)return null;
 return {score:Math.round(parts.reduce((s,[v,w])=>s+v*w,0)/den),kind:'open',evidence:'VDOE performance + military-family support'};
}
function baseOpen(x){
 if(x?.mission_score_status==='rated'&&x?.mission_score!=null)return {score:clamp(x.mission_score),kind:'native',evidence:'Mission Rated reviews'};
 const r=x?.public_rating,review=r?.rating!=null?pct(r.rating,r.scale||5):0,reviewConfidence=clamp((Number(r?.confidence)||0)*100),signals=Math.min(100,(Number(x?.signal_count)||0)*10),school=x?.school_liaison?100:0,pcs=x?.pcs_support?100:0,official=x?.official_verified?100:0,parts=[];
 if(review)parts.push([review,.35*Math.max(.45,reviewConfidence/100)]);if(signals)parts.push([signals,.25]);if(school)parts.push([school,.15]);if(pcs)parts.push([pcs,.15]);if(official)parts.push([official,.10]);
 const den=parts.reduce((s,[,w])=>s+w,0);if(den<.35)return null;
 return {score:Math.round(parts.reduce((s,[v,w])=>s+v*w,0)/den),kind:'open',evidence:[r?.rating!=null?'public rating':null,'PCS/family-readiness','official sources'].filter(Boolean).join(' + '),publicRating:r||null};
}
function style(){if(document.getElementById('mr-rank-style'))return;const s=document.createElement('style');s.id='mr-rank-style';s.textContent=`.mrHeroScore{display:flex;align-items:center;gap:11px;margin:10px 0 7px;padding:8px 0}.mrBig{font-size:48px;line-height:.84;font-weight:1000;letter-spacing:-.055em;color:#ffd36d}.mrBig small{display:block;font-size:8px;letter-spacing:.14em;color:#99b0bb;margin-bottom:6px}.mrRank{font-size:11px;font-weight:950;color:#00e5ff}.mrWhy{font-size:8px;color:#8fa6b0;margin-top:4px;max-width:190px;line-height:1.35}.mrPublicEvidence{font-size:9px;line-height:1.4;color:#c8d6dc;margin:-1px 0 8px;padding:7px 8px;border:1px solid #294b5d;border-radius:7px;background:#041824}.mrPublicEvidence a{color:#00e5ff;text-decoration:none}.card[data-mr-ranked="1"]{border-color:#b18f32;box-shadow:0 0 0 1px #6b5723 inset}.card[data-mr-ranked="2"],.card[data-mr-ranked="3"]{border-color:#3d6579}.mrLegend{margin:0 0 14px;padding:10px 12px;border:1px solid #31566b;border-radius:9px;background:#061b2d;color:#9fb3bd;font-size:9px;line-height:1.45}.mrLegend b{color:#ffd36d}`;document.head.appendChild(s)}
const safeUrl=u=>/^https:\/\//i.test(String(u||''))?String(u):'';
function insert(card,result,rank,total,label){if(!card||!result)return;card.querySelector('.mrHeroScore')?.remove();card.querySelector('.mrPublicEvidence')?.remove();card.dataset.mrRanked=String(rank);const h=card.querySelector('h2,h3');if(!h)return;const d=document.createElement('div');d.className='mrHeroScore';d.innerHTML=`<div class="mrBig"><small>${result.kind==='native'?'MISSION RATED':'MR OPEN'}</small>${result.score}</div><div><div class="mrRank">#${rank} of ${total} ${label}</div><div class="mrWhy">${result.evidence}</div></div>`;h.insertAdjacentElement('afterend',d);if(result.publicRating?.rating!=null){const p=result.publicRating,u=safeUrl(p.source_url),e=document.createElement('div');e.className='mrPublicEvidence';e.innerHTML=`Public rating: <b>${Number(p.rating).toFixed(1)}/${Number(p.scale||5)}</b>${p.source_name?` • ${String(p.source_name).replace(/[<>]/g,'')}`:''}${u?` • <a href="${u}" target="_blank" rel="noopener noreferrer">source ↗</a>`:''}`;d.insertAdjacentElement('afterend',e)}}
function rankMap(data,scoreFn){const scored=(Array.isArray(data)?data:[]).map(x=>({x,r:scoreFn(x)})).filter(o=>o.r).sort((a,b)=>b.r.score-a.r.score||String(a.x.name||'').localeCompare(String(b.x.name||'')));return {total:scored.length,map:new Map(scored.map((o,i)=>[String(o.x.name||o.x.title||o.x.businesses?.name||'').trim(),{...o.r,rank:i+1}]))}}
function applyCards(container,data,scoreFn,label,reorder=true){if(!container)return;const ranked=rankMap(data,scoreFn),cards=[...container.querySelectorAll('.card')];cards.forEach(card=>{const name=card.querySelector('h2,h3')?.textContent?.trim(),rr=ranked.map.get(name);if(rr)insert(card,rr,rr.rank,ranked.total,label)});if(reorder&&cards.length&&cards.every(c=>c.parentElement===container)){cards.slice().sort((a,b)=>(Number(a.dataset.mrRanked)||999)-(Number(b.dataset.mrRanked)||999)).forEach(c=>container.appendChild(c))}}
function addLegend(target,text){const root=typeof target==='string'?document.getElementById(target):target;if(!root||root.querySelector?.('.mrLegend'))return;const context=root.querySelector?.('.context,.notice');const d=document.createElement('div');d.className='mrLegend';d.innerHTML=`<b>MR Open ranking:</b> ${text} It is a transparent open-evidence score, not a substitute for Mission Rated community reviews. Native MR reviews replace it when sufficient.`;if(context)context.insertAdjacentElement('afterend',d);else root.prepend(d)}
function applyAll(j){
 const path=location.pathname;
 if(path.endsWith('/military-value.html')){addLegend(document.querySelector('main .wrap'),'derived from public review signals, verified military benefits and source confidence.');applyCards(document.getElementById('grid'),j.businesses,businessOpen,'businesses');return}
 if(path.endsWith('/schools.html')){addLegend(document.querySelector('main .wrap'),'derived from VDOE performance/accreditation plus military-family support such as Purple Star.');applyCards(document.getElementById('groups'),j.school_items,schoolOpen,'schools',false);return}
 if(path.endsWith('/bases.html')){addLegend(document.querySelector('main .wrap'),'derived from available public ratings plus verified PCS/family-readiness and official-source evidence. Public ratings remain separate evidence, not Mission Rated reviews.');applyCards(document.getElementById('grid'),j.installations,baseOpen,'bases');return}
 addLegend('places','derived from public review signals, verified military value and source confidence.');
 addLegend('schools','derived from VDOE performance/accreditation and military-family support signals.');
 addLegend('bases','derived from available public ratings plus verified PCS/family-readiness and official-source evidence.');
 applyCards(document.getElementById('businessGrid'),j.businesses,businessOpen,'places');applyCards(document.getElementById('schoolGrid'),j.school_items,schoolOpen,'schools');applyCards(document.getElementById('baseGrid'),j.installations,baseOpen,'bases');
}
async function run(){style();let j;try{const [explore,ratings]=await Promise.all([fetch(API,{headers:{accept:'application/json'}}),fetch(RATINGS_API,{headers:{accept:'application/json'}}).catch(()=>null)]);if(!explore.ok)return;j=await explore.json();if(ratings?.ok){const rj=await ratings.json(),by=new Map((rj.installations||[]).map(x=>[x.installation_id,x.best_public_rating]));j.installations=(j.installations||[]).map(x=>({...x,public_rating:by.get(x.id)||null}))}}catch{return}let tries=0;const timer=setInterval(()=>{applyAll(j);if(++tries>=8)clearInterval(timer)},400);applyAll(j)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();