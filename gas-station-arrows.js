(()=>{
  if(location.pathname!=='/gas.html') return;
  const style=document.createElement('style');
  style.textContent='.mr-gas-arrows{display:flex;gap:6px;margin-top:10px}.mr-gas-arrow{width:auto;min-width:42px;padding:7px 10px;border:1px solid #3b6a82;border-radius:8px;background:#08263a;color:#dff7ff;font-weight:950;cursor:pointer}.mr-gas-arrow.up{color:#8affdc}.mr-gas-arrow.down{color:#ff9e9e}.mr-gas-arrow:focus-visible{outline:2px solid #ffd36d;outline-offset:2px}.mr-gas-arrow[disabled]{opacity:.55;cursor:default}';
  document.head.appendChild(style);
  const key=x=>`${x.station_name||''}|${x.location_text||''}|${x.fuel_type||''}`;
  const voted=new Set();
  function enhance(){
    document.querySelectorAll('#grid .card').forEach(card=>{
      if(card.querySelector('.mr-gas-arrows'))return;
      const title=card.querySelector('h2')?.textContent?.trim()||'';
      const meta=card.querySelector('.muted')?.textContent||'';
      const price=card.querySelector('.price')?.textContent||'';
      const wrap=document.createElement('div');wrap.className='mr-gas-arrows';wrap.setAttribute('aria-label','Rate this gas price report');
      [['up','▲'],['down','▼']].forEach(([vote,label])=>{const b=document.createElement('button');b.type='button';b.className=`mr-gas-arrow ${vote}`;b.textContent=label;b.title=vote==='up'?'Price looks accurate':'Price looks wrong or outdated';b.setAttribute('aria-label',b.title);b.onclick=()=>{const k=`${title}|${meta}|${price}`;if(voted.has(k))return;voted.add(k);wrap.querySelectorAll('button').forEach(x=>x.disabled=true);b.textContent=vote==='up'?'▲ ✓':'▼ ✓';try{window.mrTrack?.('gas_price_vote',{station:title,price_report:price,response:vote,context:meta})}catch{}};wrap.appendChild(b)});
      (card.querySelector('.actions')||card).before(wrap);
    });
  }
  new MutationObserver(enhance).observe(document.getElementById('grid')||document.body,{childList:true,subtree:true});
  enhance();
})();
