(()=>{
 const API='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1';
 const panel=document.createElement('section');
 panel.className='panel';
 panel.style.marginTop='20px';
 panel.innerHTML='<div class="label">CREATOR CONNECTION</div><h2 class="sectiontitle" style="margin-top:6px">Connect Instagram</h2><p class="muted" id="igConnectCopy">Checking Meta connection…</p><button class="btn" id="igConnectBtn" type="button" disabled>Checking…</button><div class="status" id="igConnectStatus"></div>';
 const main=document.querySelector('main.wrap');
 const firstFeed=document.querySelector('.feed');
 if(firstFeed) firstFeed.parentNode.insertBefore(panel,firstFeed); else main?.appendChild(panel);
 const btn=panel.querySelector('#igConnectBtn'),copy=panel.querySelector('#igConnectCopy'),status=panel.querySelector('#igConnectStatus');
 const params=new URLSearchParams(location.search);
 const result=params.get('instagram');
 if(result==='connected') status.textContent='Instagram connected successfully.';
 else if(result==='denied') status.textContent='Instagram connection was cancelled.';
 else if(result==='error') status.textContent='Instagram connection failed. Check Meta app settings.';
 fetch(`${API}/instagram-connect-status`,{cache:'no-store'}).then(r=>r.json()).then(j=>{
   if(!j.configured){copy.textContent='Mission Rated is ready for Meta OAuth. Add the Meta Instagram App ID and secret to activate creator login.';btn.textContent='Meta setup required';btn.disabled=true;return}
   copy.textContent='Creators can authorize Mission Rated to access eligible Instagram media. Content still goes through the Hampton Roads relevance and moderation pipeline.';
   btn.textContent='Connect Instagram';btn.disabled=false;
   btn.addEventListener('click',async()=>{
     btn.disabled=true;btn.textContent='Opening Instagram…';status.textContent='';
     try{const r=await fetch(`${API}/instagram-connect-start`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({return_to:'/local-intel'})});const j=await r.json();if(!r.ok||!j.login_url)throw new Error(j.error||'connect_failed');location.href=j.login_url}catch(e){status.textContent='Unable to start Instagram connection.';btn.disabled=false;btn.textContent='Connect Instagram'}
   });
 }).catch(()=>{copy.textContent='Instagram connection status is temporarily unavailable.';btn.textContent='Unavailable';btn.disabled=true});
})();
