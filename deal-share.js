(()=>{
'use strict';
const clean=s=>String(s??'').trim();
const referralUrl=(url=location.href)=>{
  if(typeof window.mrReferralUrl==='function')return window.mrReferralUrl(url);
  try{
    const dest=new URL(url,location.href);
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
      document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();
    }
    // Track only the successful share outcome and stable target identifiers.
    // Do not send the generated URL: it can contain referral/query context that
    // is unnecessary for measuring the growth loop and should stay client-side.
    if(typeof window.mrTrack==='function')window.mrTrack('share_action',{target_type:targetType,target_id:targetId,share_method:method});
    return {ok:true,method,url:shareUrl};
  }catch(err){
    if(err?.name==='AbortError')return {ok:false,cancelled:true,url:shareUrl};
    return {ok:false,error:clean(err?.message)||'share_failed',url:shareUrl};
  }
};
window.mrDealShare=share;
})();
