(()=>{
  if (document.getElementById('mrGasPromo')) return;
  const path=location.pathname;
  if (!['/','/index.html','/savings.html'].includes(path)) return;
  const a=document.createElement('a');
  a.id='mrGasPromo';a.href='/gas.html';a.textContent='⛽ Find Cheapest Gas';
  a.setAttribute('aria-label','Find cheapest gas in Hampton Roads');
  a.style.cssText='display:inline-flex;align-items:center;justify-content:center;gap:7px;text-decoration:none;font:900 11px/1 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#02101d;background:#ffd36d;border:1px solid #ffd36d;border-radius:999px;padding:11px 15px;box-shadow:0 10px 28px #0007;margin:8px 8px 8px 0;min-height:44px';
  a.addEventListener('click',()=>{try{window.mrTrack?.('gas_entry_click',{source:path==='/'||path==='/index.html'?'home':'savings'})}catch{}});
  if(path==='/savings.html'){
    const loop=document.querySelector('.loop'); if(loop) loop.parentNode.insertBefore(a,loop);
  }else{
    const links=document.querySelector('.viewlinks'); if(links) links.prepend(a); else document.querySelector('.hero .wrap')?.appendChild(a);
  }
})();
