(()=>{
const providers=window.MAROCVOWS_PROVIDERS||[];
const KEY='marocvows-shortlist';
const max=3;
const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').filter(Boolean).slice(0,max)}catch{return[]}};
const save=v=>localStorage.setItem(KEY,JSON.stringify(v.slice(0,max)));
const bySlug=s=>providers.find(p=>p.slug===s);
function toggle(slug){
  let list=get();
  if(list.includes(slug)) list=list.filter(x=>x!==slug);
  else if(list.length<max) list.push(slug);
  else {alert('You can compare up to 3 providers at a time.');return;}
  save(list);renderAll();
}
function categoryLabel(k){
  return ({caterer:'Caterers',venue:'Venues',planner:'Planners',dj:'DJs',photographer:'Photographers',videographer:'Videographers',decorator:'Decorators',florist:'Florists',beauty:'Beauty',henna:'Henna',band:'Musicians',transport:'Transport',cake:'Cakes',rentals:'Rentals',other:'Other'})[k]||k;
}
function renderCategoryDiscovery(){
  const search=document.querySelector('#directory');
  if(!search||document.querySelector('.service-discovery'))return;
  const counts={};
  providers.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
  const categories=Object.entries(counts).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
  const section=document.createElement('section');
  section.className='service-discovery';
  section.innerHTML='<div class="service-discovery-head"><div><p class="eyebrow">What do you need?</p><h2>Start with the service.</h2></div><p>Choose a category, then narrow by city. Only categories with real provider supply are shown.</p></div><div class="service-chip-grid">'+categories.map(([k,n])=>`<button type="button" data-category-jump="${k}"><strong>${categoryLabel(k)}</strong><span>${n} provider${n===1?'':'s'}</span></button>`).join('')+'</div>';
  search.insertAdjacentElement('afterend',section);
  section.querySelectorAll('[data-category-jump]').forEach(btn=>btn.addEventListener('click',()=>{
    const select=document.querySelector('#categoryFilter');
    if(select){select.value=btn.dataset.categoryJump;select.dispatchEvent(new Event('change',{bubbles:true}));}
    document.querySelector('#directory')?.scrollIntoView({behavior:'smooth',block:'center'});
  }));
}
function enhanceCards(){
  document.querySelectorAll('.vendor-card').forEach(card=>{
    const share=card.querySelector('[data-share]');
    const slug=share?.dataset.share;
    if(!slug)return;
    const actions=card.querySelector('.card-actions')||card;
    let btn=actions.querySelector('.compare-toggle');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.className='compare-toggle';btn.addEventListener('click',()=>toggle(slug));actions.appendChild(btn);}
    const selected=get().includes(slug);
    btn.textContent=selected?'✓ Comparing':'Compare';
    btn.classList.toggle('active',selected);
    btn.setAttribute('aria-pressed',String(selected));
  });
}
function enhanceProfile(){
  if(!document.querySelector('.profile-shell'))return;
  const slug=new URLSearchParams(location.search).get('slug');
  if(!slug||!bySlug(slug))return;
  let btn=document.querySelector('#profileCompareButton');
  if(!btn){
    btn=document.createElement('button');btn.type='button';btn.id='profileCompareButton';btn.className='secondary-btn compare-toggle';
    btn.addEventListener('click',()=>toggle(slug));
    document.querySelector('.profile-actions')?.appendChild(btn);
  }
  const selected=get().includes(slug);btn.textContent=selected?'✓ Added to compare':'Add to compare';btn.classList.toggle('active',selected);
}
function renderDrawer(){
  let drawer=document.querySelector('#compareDrawer');
  if(!drawer){drawer=document.createElement('aside');drawer.id='compareDrawer';drawer.className='compare-drawer';document.body.appendChild(drawer);}
  const list=get().map(bySlug).filter(Boolean);
  if(!list.length){drawer.hidden=true;return;}
  drawer.hidden=false;
  drawer.innerHTML=`<div><strong>Compare providers</strong><span>${list.length}/${max} selected</span></div><div class="compare-drawer-items">${list.map(p=>`<span>${p.name}<button type="button" data-remove-compare="${p.slug}" aria-label="Remove ${p.name}">×</button></span>`).join('')}</div><a class="primary-btn" href="/compare.html?slugs=${encodeURIComponent(list.map(p=>p.slug).join(','))}">Compare now</a>`;
  drawer.querySelectorAll('[data-remove-compare]').forEach(b=>b.addEventListener('click',()=>toggle(b.dataset.removeCompare)));
}
function renderAll(){renderCategoryDiscovery();enhanceCards();enhanceProfile();renderDrawer();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderAll);else renderAll();
new MutationObserver(()=>{enhanceCards();renderDrawer();}).observe(document.documentElement,{subtree:true,childList:true});
})();
