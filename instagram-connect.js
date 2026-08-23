(async()=>{
 const {SUPABASE_FUNCTIONS_BASE}=await import('/lib/config.js');
 const API=SUPABASE_FUNCTIONS_BASE;
 const main=document.querySelector('main.wrap'); if(!main) return;
 const panel=document.createElement('section');
 panel.className='panel'; panel.style.marginTop='20px';
 panel.innerHTML='<div class="label">ARE YOU A 757 CREATOR?</div><h2 class="sectiontitle" style="margin-top:6px">Bring your local finds to Mission Rated</h2><p class="muted" id="igConnectCopy">Checking creator connection…</p><button class="btn" id="igConnectBtn" type="button" disabled>Checking…</button><div class="status" id="igConnectStatus"></div>';
 main.appendChild(panel);
 const btn=panel.querySelector('#igConnectBtn'),copy=panel.querySelector('#igConnectCopy'),status=panel.querySelector('#igConnectStatus');
 const params=new URLSearchParams(location.search),result=params.get('instagram');
 if(result==='connected') status.textContent='Instagram connected successfully.'; else if(result==='denied') status.textContent='Instagram connection was cancelled.'; else if(result==='error') status.textContent='Instagram connection failed. Check Meta app settings.';
 fetch(`${API}/instagram-connect-status`,{cache:'no-store'}).then(r=>r.json()).then(j=>{
  if(!j.configured){copy.textContent='Creator connection is coming soon. Mission Rated is ready for Meta OAuth once the Meta app credentials are added.';btn.textContent='Creator connection coming soon';btn.disabled=true;return}
  copy.textContent='Authorize Mission Rated to access eligible Instagram media. Hampton Roads relevance and moderation still apply before anything appears publicly.';btn.textContent='Connect Instagram';btn.disabled=false;
  btn.addEventListener('click',async()=>{btn.disabled=true;btn.textContent='Opening Instagram…';status.textContent='';try{const r=await fetch(`${API}/instagram-connect-start`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({return_to:'/local-intel'})});const j=await r.json();if(!r.ok||!j.login_url)throw new Error();location.href=j.login_url}catch{status.textContent='Unable to start Instagram connection.';btn.disabled=false;btn.textContent='Connect Instagram'}})
 }).catch(()=>{copy.textContent='Creator connection is temporarily unavailable.';btn.textContent='Unavailable';btn.disabled=true});
})();