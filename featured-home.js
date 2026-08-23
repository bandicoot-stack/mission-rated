(()=>{
  const marker='mr-featured-partners';
  if(document.getElementById(marker)) return;
  const main=document.querySelector('main.wrap.main');
  if(!main) return;

  const section=document.createElement('section');
  section.id=marker;
  section.setAttribute('aria-labelledby','mr-featured-title');
  section.innerHTML=`
    <style>
      #${marker}{margin:0 0 24px;border:1px solid #8d742a;border-radius:18px;overflow:hidden;background:linear-gradient(135deg,#0a2031,#071824);box-shadow:0 18px 55px #0005}
      #${marker} .mr-f-head{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:18px 20px;border-bottom:1px solid #745f28;background:linear-gradient(90deg,#172116,#092033)}
      #${marker} .mr-f-kicker{font-size:10px;font-weight:950;letter-spacing:.14em;color:#ffd36d}
      #${marker} h2{margin:5px 0 0;font-size:27px;line-height:1.05}
      #${marker} .mr-f-all{white-space:nowrap;text-decoration:none;border:1px solid #796629;border-radius:999px;padding:9px 12px;font-size:9px;font-weight:950;color:#ffd36d}
      #${marker} .mr-f-card{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;padding:22px 20px}
      #${marker} .mr-f-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px}
      #${marker} .mr-f-badge{font-size:8px;font-weight:900;padding:5px 7px;border-radius:6px;border:1px solid #2e6f62;color:#8affdc}
      #${marker} .mr-f-badge.gold{border-color:#796629;color:#ffd36d;background:#1a1b17}
      #${marker} h3{font-size:23px;margin:0 0 7px}
      #${marker} p{font-size:10px;line-height:1.55;color:#b4c5cc;margin:0;max-width:690px}
      #${marker} .mr-f-offer{text-align:right;min-width:190px}
      #${marker} .mr-f-value{font-size:44px;line-height:.9;font-weight:950;color:#ffd36d}
      #${marker} .mr-f-label{font-size:10px;font-weight:900;margin-top:7px}
      #${marker} .mr-f-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin-top:13px}
      #${marker} .mr-f-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border:1px solid #3b6a82;border-radius:8px;padding:9px 11px;font-size:9px;font-weight:900;background:#08263a}
      #${marker} .mr-f-btn.primary{background:#00e5ff;color:#02101d;border-color:#00e5ff}
      #${marker} .mr-f-note{padding:10px 20px;border-top:1px solid #244759;font-size:8px;color:#8298a3}
      @media(max-width:680px){#${marker} .mr-f-head{align-items:flex-start}#${marker} .mr-f-card{grid-template-columns:1fr}#${marker} .mr-f-offer{text-align:left;min-width:0}#${marker} .mr-f-actions{justify-content:flex-start}#${marker} h2{font-size:23px}}
    </style>
    <div class="mr-f-head">
      <div><div class="mr-f-kicker">★ FEATURED PARTNERS</div><h2 id="mr-featured-title">Businesses stepping up for military families.</h2></div>
      <a class="mr-f-all" href="/featured">VIEW FEATURED →</a>
    </div>
    <article class="mr-f-card">
      <div>
        <div class="mr-f-badges"><span class="mr-f-badge gold">FEATURED PARTNER</span><span class="mr-f-badge">Veteran-owned</span><span class="mr-f-badge">Directly confirmed</span></div>
        <h3>Yorktown Tools</h3>
        <p>Yorktown Tools stepped up with a confirmed military discount for the Hampton Roads community. Featured status highlights the partnership and benefit—it does not affect Mission Rated scores or rankings.</p>
      </div>
      <div class="mr-f-offer">
        <div class="mr-f-value">10% OFF</div>
        <div class="mr-f-label">MILITARY DISCOUNT</div>
        <div class="mr-f-actions"><a class="mr-f-btn primary" href="/featured">Get the deal →</a><a class="mr-f-btn" href="https://yorktowntools.com/" target="_blank" rel="noopener noreferrer">Yorktown Tools ↗</a></div>
      </div>
    </article>
    <div class="mr-f-note">Featured placement never changes ratings. Mission Rated ratings are earned, never sold.</div>`;

  main.prepend(section);
})();
