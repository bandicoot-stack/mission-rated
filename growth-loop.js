(()=>{
'use strict';
if(document.getElementById('mrGrowthLoop'))return;
const path=location.pathname.replace(/\/$/,'')||'/';
const style=document.createElement('style');style.id='mrGrowthLoopStyle';style.textContent=`
#mrGrowthLoop{position:fixed;right:14px;bottom:14px;z-index:9997;display:flex;align-items:center;gap:8px;max-width:min(390px,calc(100vw - 28px));padding:9px 10px;border:1px solid #315d74;border-radius:12px;background:#03111ff2;box-shadow:0 12px 34px #0008;backdrop-filter:blur(12px);font:850 9px/1.25 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#mrGrowthLoop a{display:flex;align-items:center;gap:8px;color:#eaf7fb;text-decoration:none;min-width:0}#mrGrowthLoop strong{display:block;color:#8ef5ff;font-size:10px}#mrGrowthLoop span{display:block;color:#93aab4;font-size:8px;margin-top:2px}#mrGrowthLoop button{border:0;background:transparent;color:#8097a2;font-size:16px;cursor:pointer;padding:3px 4px}@media(max-width:700px){#mrGrowthLoop{left:10px;right:10px;bottom:88px;max-width:none}}
`;document.head.appendChild(style);
const dismissed=sessionStorage.getItem('mr_growth_pass_dismissed')==='1';
if(dismissed||path==='/family-pass'||path==='/family-pass.html')return;
const shell=document.createElement('aside');shell.id='mrGrowthLoop';shell.setAttribute('aria-label','Military Family Pass');shell.innerHTML=`<a href="/family-pass.html?utm_source=mission_rated&utm_medium=onsite&utm_campaign=military_family_pass"><div aria-hidden="true">🎟️</div><div><strong>Free Military Family Pass</strong><span>Current Hampton Roads military value →</span></div></a><button type="button" aria-label="Dismiss Family Pass">×</button>`;document.body.appendChild(shell);
shell.querySelector('a').addEventListener('click',()=>window.mrTrack?.('family_pass_cta_clicked',{surface:'sitewide',from:path}));shell.querySelector('button').addEventListener('click',()=>{sessionStorage.setItem('mr_growth_pass_dismissed','1');shell.remove();window.mrTrack?.('family_pass_cta_dismissed',{from:path})});
})();
