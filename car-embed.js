(()=>{
'use strict';
const params=new URLSearchParams(location.search);
if(params.get('embedded')!=='1')return;
document.documentElement.classList.add('mrEmbeddedCar');
const style=document.createElement('style');style.textContent=`
html.mrEmbeddedCar body{background:transparent}.mrEmbeddedCar .top,.mrEmbeddedCar .hero,.mrEmbeddedCar #mrLifestyleNav{display:none!important}.mrEmbeddedCar .main{padding:0}.mrEmbeddedCar .wrap{max-width:none;padding:0}.mrEmbeddedCar .tool{margin-bottom:0}.mrEmbeddedCar body{padding-bottom:0!important}
`;document.head.appendChild(style);
const sendHeight=()=>{try{parent.postMessage({type:'mr-car-height',height:Math.ceil(document.documentElement.scrollHeight)},location.origin)}catch{}};
window.addEventListener('load',sendHeight,{once:true});
new ResizeObserver(sendHeight).observe(document.body);
setTimeout(sendHeight,500);setTimeout(sendHeight,1500);
})();
