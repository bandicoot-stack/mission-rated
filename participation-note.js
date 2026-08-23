(async()=>{
'use strict';
if(document.getElementById('mrParticipationNote'))return;
const {SUPABASE_FUNCTIONS_ROOT}=await import('/lib/config.js');
const ROOT=SUPABASE_FUNCTIONS_ROOT;
const VOTES=ROOT+'public-quick-rank-votes';
const style=document.createElement('style');
style.textContent=`
.mr-participation-note{position:fixed;right:16px;bottom:78px;z-index:10010;width:min(340px,calc(100vw - 32px));border:1px solid #3e7087;border-radius:16px;background:#061725f2;color:#f5f8fa;box-shadow:0 18px 50px #000b;padding:14px 14px 12px;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;backdrop-filter:blur(12px)}
.mr-participation-note strong{display:block;font-size:13px;line-height:1.25;margin-bottom:5px;color:#ffd36d}.mr-participation-note p{margin:0;color:#c0d0d7;font-size:10px;line-height:1.45}.mr-participation-actions{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}.mr-participation-actions button{min-height:40px;border-radius:9px;border:1px solid #3b6a82;background:#08263a;color:#eef8fb;padding:8px 10px;font-size:9px;font-weight:900;cursor:pointer}.mr-participation-actions .primary{background:#00e5ff;color:#02101d;border-color:#00e5ff}.mr-participation-close{position:absolute;top:5px;right:6px;width:34px;height:34px;border:0;background:transparent;color:#91a8b3;font-size:20px;cursor:pointer}.mr-participation-count{margin-top:7px;font-size:8px;color:#89a5b1}.mr-participation-pulse{animation:mrPulse 1.2s ease 2}@keyframes mrPulse{50%{box-shadow:0 0 0 4px #00e5ff55,0 18px 50px #000b}}
@media(max-width:640px){.mr-participation-note{left:12px;right:12px;bottom:calc(max(10px,env(safe-area-inset-bottom)) + 132px);width:auto;padding:13px}.mr-participation-actions button{flex:1;min-width:120px}}
`;
document.head.appendChild(style);
const note=document.createElement('aside');
note.id='mrParticipationNote';note.className='mr-participation-note';note.setAttribute('role','note');note.setAttribute('aria-label','Join the Mission Rated community');
note.innerHTML=`<button class="mr-participation-close" type="button" aria-label="Dismiss participation note">×</button><strong>★ Help build Mission Rated.</strong><p>See a place, school, base, or dealer you know? Press ▲ or ▼ and participate. Add your ★ to the growing community signal—or hit Feedback anytime to drop a review, correction, or idea.</p><div class="mr-participation-count" id="mrParticipationCount">Community participation is growing.</div><div class="mr-participation-actions"><button type="button" class="primary" id="mrParticipationVote">Find a ▲ / ▼</button><button type="button" id="mrParticipationFeedback">Give feedback</button></div>`;
document.body.appendChild(note);
const hide=()=>{note.remove();try{sessionStorage.setItem('mr_participation_note_dismissed','1')}catch{}};
note.querySelector('.mr-participation-close').addEventListener('click',hide);
note.querySelector('#mrParticipationVote').addEventListener('click',()=>{const q=document.querySelector('.mrQuick');if(q){q.scrollIntoView({behavior:'smooth',block:'center'});q.classList.add('mr-participation-pulse');setTimeout(()=>q.classList.remove('mr-participation-pulse'),2600)}else{const target=document.querySelector('#businessGrid,#schoolGrid,#baseGrid,.grid,.main');target?.scrollIntoView({behavior:'smooth',block:'start'})}});
note.querySelector('#mrParticipationFeedback').addEventListener('click',()=>{const b=document.getElementById('mrFeedbackButton');if(b)b.click();else document.querySelector('[id*=Feedback],button')?.focus()});
(async()=>{try{const r=await fetch(VOTES,{headers:{accept:'application/json'}});if(!r.ok)return;const j=await r.json();const total=(j.votes||[]).reduce((n,v)=>n+(Number(v.total)||Number(v.up)||0)+(Number(v.total)==null?(Number(v.down)||0):0),0);if(total>0)document.getElementById('mrParticipationCount').textContent=`★ ${total.toLocaleString()} community vote${total===1?'':'s'} so far. Add yours.`}catch{}})();
try{if(sessionStorage.getItem('mr_participation_note_dismissed')==='1')note.remove()}catch{}
})();