(()=>{
  if (document.getElementById('mrWeekendBrief')) return;

  const ENDPOINT='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/weekend-brief-signup';
  const style=document.createElement('style');
  style.textContent=`
    .mrBrief{max-width:1220px;margin:0 auto 26px;padding:0 18px}.mrBriefCard{position:relative;overflow:hidden;border:1px solid #285b72;border-radius:16px;background:linear-gradient(135deg,#072238,#04131f 70%);padding:20px;box-shadow:0 18px 50px #0005}.mrBriefCard:after{content:'';position:absolute;inset:auto -70px -90px auto;width:220px;height:220px;border-radius:50%;background:#00e5ff12}.mrBriefEyebrow{font-size:9px;font-weight:950;letter-spacing:.14em;color:#00e5ff}.mrBrief h2{margin:6px 0 4px;font-size:23px}.mrBrief p{margin:0 0 13px;max-width:720px;color:#9fb3bd;font-size:11px;line-height:1.55}.mrBriefForm{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;max-width:650px}.mrBriefForm input{min-width:0;width:100%;padding:12px 13px;border:1px solid #426176;border-radius:9px;background:#061b2d;color:#fff}.mrBriefForm button{border:1px solid #00e5ff;border-radius:9px;padding:12px 16px;background:#00e5ff;color:#02101d;font-weight:950;cursor:pointer}.mrBriefForm button[disabled]{opacity:.65;cursor:wait}.mrBriefFine{margin-top:8px!important;font-size:9px!important;color:#78919d!important}.mrBriefStatus{min-height:17px;margin-top:8px;font-size:10px;font-weight:800;color:#8affdc}.mrBriefStatus.bad{color:#ffb0a8}.mrBriefTrap{position:absolute!important;left:-9999px!important;opacity:0!important;pointer-events:none!important}@media(max-width:640px){.mrBrief{padding:0 14px}.mrBriefForm{grid-template-columns:1fr}.mrBriefForm button{width:100%}}
  `;
  document.head.appendChild(style);

  const shell=document.createElement('section');
  shell.className='mrBrief';
  shell.id='mrWeekendBrief';
  shell.setAttribute('aria-label','Weekend Brief signup');
  shell.innerHTML=`<div class="mrBriefCard"><div class="mrBriefEyebrow">YOUR WEEKEND BRIEF</div><h2>Be part of our story.</h2><p>Sign up and we’ll bring your Weekend Brief right to you — useful military-family finds, local deals, events, and what’s worth knowing around Hampton Roads.</p><form class="mrBriefForm" id="mrBriefForm" data-weekend-brief="true" data-signup-surface="homepage-weekend-brief"><input id="mrBriefEmail" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" placeholder="you@email.com" aria-label="Email address" required><input class="mrBriefTrap" name="company" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="submit">Bring me the Brief</button></form><p class="mrBriefFine">No spam. Just the useful stuff. Unsubscribe anytime.</p><div class="mrBriefStatus" id="mrBriefStatus" role="status" aria-live="polite"></div></div>`;

  const main=document.querySelector('main');
  if (main) main.insertAdjacentElement('afterend',shell); else document.body.appendChild(shell);

  const form=document.getElementById('mrBriefForm');
  const status=document.getElementById('mrBriefStatus');
  const button=form.querySelector('button');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const data=new FormData(form);
    const email=String(data.get('email')||'').trim();
    const company=String(data.get('company')||'').trim();
    if (!email) return;
    button.disabled=true;
    status.className='mrBriefStatus';
    status.textContent='Joining…';
    try{
      const res=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,company,source:'homepage-weekend-brief'})});
      const body=await res.json().catch(()=>({}));
      if(!res.ok||!body.ok) throw new Error(body.error||'signup_failed');
      form.reset();
      status.textContent='You’re in. Your Weekend Brief is headed your way.';
      // This event is emitted only after the authoritative signup endpoint confirms success.
      // Keep the payload structured so the growth scorecard can distinguish attempts from
      // confirmed subscriptions without collecting the subscriber email in analytics.
      window.mrTrack?.('weekend_brief_signup_confirmed',{signup_surface:'homepage-weekend-brief'});
    }catch{
      status.className='mrBriefStatus bad';
      status.textContent='Couldn’t sign you up just now. Please try again.';
    }finally{button.disabled=false}
  });
})();