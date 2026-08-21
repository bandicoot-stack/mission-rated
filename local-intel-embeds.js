(()=>{
 const endpoint='https://vquwdypidgjmxnhhdbol.supabase.co/functions/v1/public-local-intel-candidates';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cat=s=>String(s||'local').replaceAll('_',' · ');
 const grid=document.getElementById('candidateGrid');
 const count=document.getElementById('candidateCount');
 if(!grid||!count) return;
 fetch(endpoint,{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(j=>{
  const items=j.candidates||[];
  const playable=items.filter(x=>x.instagram_url);
  const pending=items.filter(x=>!x.instagram_url);
  count.textContent=`${playable.length} playable · ${pending.length} pending`;
  grid.innerHTML=items.length?items.map(x=>{
   const profile=`https://www.instagram.com/${encodeURIComponent(x.creator_handle)}/`;
   const media=x.instagram_url?`<div class="intelvisual" style="padding:8px;min-height:500px"><blockquote class="instagram-media" data-instgrm-permalink="${esc(x.instagram_url)}" data-instgrm-version="14" style="background:#fff;border:0;border-radius:3px;box-shadow:none;margin:0;max-width:540px;min-width:300px;padding:0;width:100%"></blockquote></div>`:`<div class="intelvisual"><div class="waiting"><b style="color:#fff">Public Hampton Roads content found</b><br>Exact Instagram URL still being recovered before playback.</div></div>`;
   return `<article class="intelcard">${media}<div class="intelbody"><div class="inteltop"><span class="handle">@${esc(x.creator_handle)}</span><span class="statuspill">${x.instagram_url?'PLAYABLE':'URL PENDING'}</span></div><h3>${esc(x.entity_hint||cat(x.topic))}</h3><p>${esc(cat(x.topic))} · ${esc(x.evidence_source||'public web discovery')}${x.evidence_summary?`<br>${esc(x.evidence_summary)}`:''}</p><div class="actions">${x.instagram_url?`<a class="tinybtn primary" href="${esc(x.instagram_url)}" target="_blank" rel="noopener noreferrer">Open on Instagram</a>`:''}<a class="tinybtn" href="${profile}" target="_blank" rel="noopener noreferrer">Creator profile</a>${x.evidence_url?`<a class="tinybtn" href="${esc(x.evidence_url)}" target="_blank" rel="noopener noreferrer">Discovery source</a>`:''}</div></div></article>`;
  }).join(''):'<div class="empty">No public discoveries loaded.</div>';
  setTimeout(()=>window.instgrm?.Embeds?.process(),100);
 }).catch(()=>{count.textContent='Unavailable';grid.innerHTML='<div class="empty">Public discovery feed is temporarily unavailable.</div>'});
})();
