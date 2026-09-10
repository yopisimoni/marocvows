(()=>{
function qs(sel,root=document){return root.querySelector(sel)}
function qsa(sel,root=document){return [...root.querySelectorAll(sel)]}
function setTab(name){
  qsa('[data-auth-tab]').forEach(btn=>{
    const active=btn.dataset.authTab===name;
    btn.classList.toggle('is-active',active);
    btn.setAttribute('aria-selected',active?'true':'false');
  });
  qsa('[data-auth-panel]').forEach(panel=>{panel.hidden=panel.dataset.authPanel!==name;});
}
function boot(){
  qsa('[data-auth-tab]').forEach(btn=>btn.addEventListener('click',()=>setTab(btn.dataset.authTab)));
  qsa('[data-open-auth-tab]').forEach(btn=>btn.addEventListener('click',()=>{
    setTab(btn.dataset.openAuthTab);
    qs('#authShell')?.scrollIntoView({behavior:'smooth',block:'start'});
  }));
  setTab(qs('[data-auth-tab].is-active')?.dataset.authTab||'signup');
}
document.addEventListener('DOMContentLoaded',boot);
})();