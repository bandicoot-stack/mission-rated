(()=>{
'use strict';
const clean=s=>String(s??'').trim();
const referralUrl=(url=location.href)=>{
  if(typeof window.mrReferralUrl==='function')return window.mrReferralUrl(url);
  try{
    const dest=new URL(url,location.href);
    // Referral attribution belongs only on Mission Rated links. If analytics.js
    // is unavailable, preserve the same privacy boundary as mrReferralUrl so a
    // merchant/source URL is never decorated with Mission Rated tracking data.
    if(dest.origin!==location.origin)return dest.toString();
    if(!dest.searchParams.get('utm_source'))dest.searchParams.set('utm_source','mission-rated-share');
    if(!dest.searchParams.get('utm_medium'))dest.searchParams.set('utm_medium','referral');
    return dest.toString();
  }catch{return url}
};
const share=async({url=location.href,title='Mission Rated military deal',text='Check this verified military value on Mission Rated.',targetType='deal',targetId=null}={})=>{
  const shareUrl=referralUrl(url);
  let method='copy';
  try{
    if(navigator.share){
      await navigator.share({title,text,url:shareUrl});
      method='native';
    }else if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(shareUrl);
    }else{
      const input=document.createElement('textarea');
      input.value=shareUrl;input.setAttribute('readonly','');input.style.position='fixed';input.style.opacity='0';
      document.body.appendChild(input);
      input.select();
      const copied=document.execCommand('copy');
      input.remove();
      if(!copied)throw new Error('copy_failed');
    }
    // The shared analytics click listener records share_action as observed intent.
    // Do not emit the same event here after native share/copy success: that would
    // double-count one user interaction and mix intent with completion semantics.
    return {ok:true,method,url:shareUrl};
  }catch(err){
    if(err?.name==='AbortError')return {ok:false,cancelled:true,url:shareUrl};
    return {ok:false,error:clean(err?.message)||'share_failed',url:shareUrl};
  }
};
window.mrDealShare=share;
})();
