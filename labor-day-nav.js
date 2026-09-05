(()=>{
  if(!['/','/index.html'].includes(location.pathname)) return;
  const tabs=document.querySelector('.tabrow');
  const section=document.getElementById('mrLocalLaborDeals');
  if(!tabs||!section||tabs.querySelector('[data-view="mrLocalLaborDeals"]')) return;
  const today=tabs.querySelector('[data-view="today"]');
  if(!today) return;
  const button=document.createElement('button');
  button.className='tab';
  button.dataset.view='mrLocalLaborDeals';
  button.setAttribute('aria-selected','false');
  button.textContent='Labor Day Deals';
  button.addEventListener('click',()=>{
    document.querySelectorAll('main.main > .section').forEach(s=>s.hidden=s.id!=='mrLocalLaborDeals');
    tabs.querySelectorAll('.tab').forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
  });
  today.insertAdjacentElement('afterend',button);
})();
