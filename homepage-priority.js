(()=>{
  const order=[
    {label:"Today's Deals",href:'#mrTodayDeals',active:true},
    {label:'Labor Day',href:'#mrLaborDay'},
    {label:'Local Deals',href:'/savings.html?view=local'},
    {label:'Everyday Deals',href:'/savings.html?view=everyday'},
    {label:'Places',href:'#places'},
    {label:'Businesses',href:'/business.html'},
    {label:'Schools',href:'#schools'}
  ];
  const style=document.createElement('style');
  style.textContent='.tabrow a.tab{text-decoration:none;display:inline-flex;align-items:center}.tabrow a.tab.active{background:#ffd36d;color:#02101d;border-color:#ffd36d}#mrTodayDeals{scroll-margin-top:120px}#mrLaborDay,.section{scroll-margin-top:120px}';
  document.head.appendChild(style);
  function apply(){
    const tabs=document.querySelector('.tabrow'),header=document.querySelector('header.top'),today=document.getElementById('mrTodayDeals'),labor=document.getElementById('mrLaborDay');
    if(!tabs||!header)return false;
    tabs.innerHTML=order.map(x=>`<a class="tab${x.active?' active':''}" href="${x.href}" aria-current="${x.active?'page':'false'}">${x.label}</a>`).join('');
    if(today&&header.nextElementSibling!==today)header.insertAdjacentElement('afterend',today);
    if(today&&labor&&today.nextElementSibling!==labor)today.insertAdjacentElement('afterend',labor);
    return Boolean(today&&labor);
  }
  if(apply())return;
  const observer=new MutationObserver(()=>{if(apply())observer.disconnect()});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>{apply();observer.disconnect()},5000);
})();
