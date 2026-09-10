(()=>{
const slugify=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const cityRoutes={khenifra:'/wedding-caterers-khenifra.html',fes:'/wedding-caterers-fes.html',meknes:'/wedding-caterers-meknes.html'};
function enhanceCards(){
 document.querySelectorAll('.vendor-card').forEach(card=>{
   const title=card.querySelector('h2,h3,.vendor-name,strong');
   if(!title)return;
   const name=title.textContent.trim();
   if(!name)return;
   const slug=slugify(name);
   const href=`/vendors/${slug}/`;
   if(title.tagName==='H2'||title.tagName==='H3'){
     if(!title.querySelector('a')) title.innerHTML=`<a class="vendor-title-link" href="${href}">${title.textContent}</a>`;
   }
   if(!card.querySelector('.vendor-profile-cta')){
     const a=document.createElement('a');a.href=href;a.className='secondary-btn vendor-profile-cta';a.textContent='View profile';
     const actions=card.querySelector('.vendor-actions,.card-actions,.actions');
     (actions||card).appendChild(a);
   }
 });
}
function linkCityHeadings(){
 document.querySelectorAll('[data-city-section]').forEach(section=>{
   const city=section.getAttribute('data-city-section');
   const h2=section.querySelector('.city-heading h2');
   if(h2&&cityRoutes[city]&&!h2.querySelector('a')) h2.innerHTML=`<a class="city-title-link" href="${cityRoutes[city]}">${h2.textContent}</a>`;
   const head=section.querySelector('.city-heading');
   if(head&&cityRoutes[city]&&!head.querySelector('.city-explore-link')){
     const a=document.createElement('a');a.href=cityRoutes[city];a.className='secondary-btn city-explore-link';a.textContent='Explore city guide';head.appendChild(a);
   }
 });
}
const run=()=>{enhanceCards();linkCityHeadings();};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{run();setTimeout(run,400);});else{run();setTimeout(run,400);}
const observer=new MutationObserver(()=>run());
observer.observe(document.documentElement,{childList:true,subtree:true});
})();