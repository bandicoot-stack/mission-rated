(()=>{
  'use strict';
  const STYLE_ID='mr-partner-logo-style';
  function ensureStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      .mr-partner-logo{display:flex;align-items:center;justify-content:center;width:min(100%,420px);min-height:140px;margin:16px 0 22px;padding:14px 18px;border:2px solid #d0a93a;border-radius:16px;background:#fff;overflow:hidden}
      .mr-partner-logo img{display:block;max-width:100%;width:auto;height:auto;max-height:170px;object-fit:contain}
      .mr-partner-logo[data-partner-logo="yorktown-tools"]{width:min(100%,360px);min-height:112px;padding:14px 20px}
      .mr-partner-logo[data-partner-logo="yorktown-tools"] img{max-width:100%;max-height:112px}
      .mr-partner-logo-fallback{display:none;align-items:center;justify-content:center;width:100%;min-height:110px;padding:20px;text-align:center;font-weight:950;font-size:clamp(22px,5vw,34px);line-height:1.05;color:#0a315e;background:linear-gradient(145deg,#fff,#eef4f7)}
      .mr-partner-logo.is-fallback img{display:none}
      .mr-partner-logo.is-fallback .mr-partner-logo-fallback{display:flex}
      @media(max-width:680px){.mr-partner-logo{width:100%;min-height:104px;margin:14px 0 18px;padding:10px 14px}.mr-partner-logo img{max-height:130px}.mr-partner-logo[data-partner-logo="yorktown-tools"]{width:100%;min-height:96px;padding:10px 14px}.mr-partner-logo[data-partner-logo="yorktown-tools"] img{max-height:96px}.mr-partner-logo-fallback{min-height:92px}}
    `;
    document.head.append(style);
  }
  function fallback(container){
    if(!container) return;
    container.classList.add('is-fallback');
    container.dataset.partnerLogoState='fallback';
  }
  function render(target,partner,options={}){
    if(!target||!partner) return null;
    ensureStyles();
    target.textContent='';
    target.classList.add('mr-partner-logo');
    target.dataset.partnerLogo=partner.slug;
    target.dataset.partnerLogoState='loading';
    if(options.className) target.classList.add(options.className);

    const img=document.createElement('img');
    img.src=partner.logo||'';
    img.alt=partner.logoAlt||`${partner.name||'Featured partner'} logo`;
    img.loading=options.eager?'eager':'lazy';
    img.decoding='async';
    if(options.eager) img.fetchPriority='high';

    const fallbackEl=document.createElement('div');
    fallbackEl.className='mr-partner-logo-fallback';
    fallbackEl.setAttribute('role','img');
    fallbackEl.setAttribute('aria-label',partner.name||'Featured partner');
    fallbackEl.textContent=partner.name||'Featured partner';

    const markLoaded=()=>{
      if(img.naturalWidth>0&&img.naturalHeight>0){
        target.classList.remove('is-fallback');
        target.dataset.partnerLogoState='loaded';
      }else fallback(target);
    };
    img.addEventListener('load',markLoaded,{once:true});
    img.addEventListener('error',()=>fallback(target),{once:true});
    target.append(img,fallbackEl);
    if(img.complete) markLoaded();
    return img;
  }
  window.MRPartnerLogo=Object.freeze({render,fallback});
})();
