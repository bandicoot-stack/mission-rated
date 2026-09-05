(()=>{
'use strict';
const decorate=()=>{
  const section=document.getElementById('mrLocalLaborDeals');
  if(!section)return false;
  section.querySelectorAll('a.mrDealVerify').forEach(link=>{
    link.dataset.dealAction='get-deal';
    link.dataset.dealSource='verified-source';
  });
  return true;
};
if(decorate())return;
const observer=new MutationObserver(()=>{if(decorate())observer.disconnect()});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();
