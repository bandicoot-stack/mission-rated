(()=>{
  const LOGO='/assets/mission-rated-logo.svg';
  const LABEL='Mission Rated home';
  function logoImage(){
    const img=document.createElement('img');
    img.src=LOGO;
    img.alt='Mission Rated';
    img.width=224;
    img.height=40;
    img.dataset.mrBrandLogo='true';
    img.decoding='async';
    img.style.display='block';
    img.style.width='auto';
    img.style.height='30px';
    img.style.maxWidth='58vw';
    return img;
  }
  function enhanceBrand(brand){
    if(brand.querySelector('[data-mr-brand-logo]'))return;
    const img=logoImage();
    if(brand.tagName==='A'){
      brand.href='/';
      brand.setAttribute('aria-label',LABEL);
      brand.style.display='inline-flex';
      brand.style.alignItems='center';
      brand.replaceChildren(img);
      return;
    }
    const link=document.createElement('a');
    link.href='/';
    link.setAttribute('aria-label',LABEL);
    link.style.display='inline-flex';
    link.style.alignItems='center';
    link.style.textDecoration='none';
    link.append(img);
    brand.replaceChildren(link);
  }
  function apply(){document.querySelectorAll('.brand').forEach(enhanceBrand)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
