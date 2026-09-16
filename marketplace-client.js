(()=>{
const providers=window.MAROCVOWS_PROVIDERS||[];
const KEY='marocvows-shortlist';
const max=3;
const lang=()=>localStorage.getItem('marocvows-lang')||'en';
const ui={
 en:{need:'What do you need?',start:'Start with the service.',hint:'Choose a category, then narrow by city. Only categories with real provider supply are shown.',provider:n=>n===1?'1 provider':n+' providers',compare:'Compare',comparing:'✓ Comparing',limit:'You can compare up to 3 providers at a time.',drawer:'Compare providers',selected:n=>n+'/'+max+' selected',now:'Compare now',add:'Add to compare',added:'✓ Added to compare',remove:'Remove'},
 ar:{need:'ماذا تحتاج؟',start:'ابدأ بالخدمة.',hint:'اختر نوع الخدمة ثم حدّد المدينة. نعرض فقط الفئات التي تحتوي على مقدمي خدمات فعليين.',provider:n=>n===1?'مقدم خدمة واحد':n+' مقدمي خدمات',compare:'قارن',comparing:'✓ ضمن المقارنة',limit:'يمكنك مقارنة 3 مقدمي خدمات كحد أقصى.',drawer:'مقارنة مقدمي الخدمات',selected:n=>n+'/'+max+' محدد',now:'قارن الآن',add:'أضف للمقارنة',added:'✓ تمت الإضافة للمقارنة',remove:'إزالة'},
 fr:{need:'De quoi avez-vous besoin ?',start:'Commencez par le service.',hint:'Choisissez une catégorie puis affinez par ville. Seules les catégories avec de vrais prestataires sont affichées.',provider:n=>n===1?'1 prestataire':n+' prestataires',compare:'Comparer',comparing:'✓ En comparaison',limit:'Vous pouvez comparer jusqu’à 3 prestataires.',drawer:'Comparer les prestataires',selected:n=>n+'/'+max+' sélectionnés',now:'Comparer maintenant',add:'Ajouter à la comparaison',added:'✓ Ajouté à la comparaison',remove:'Retirer'},
 es:{need:'¿Qué necesitas?',start:'Empieza por el servicio.',hint:'Elige una categoría y después una ciudad. Solo mostramos categorías con proveedores reales.',provider:n=>n===1?'1 proveedor':n+' proveedores',compare:'Comparar',comparing:'✓ Comparando',limit:'Puedes comparar hasta 3 proveedores.',drawer:'Comparar proveedores',selected:n=>n+'/'+max+' seleccionados',now:'Comparar ahora',add:'Añadir a comparar',added:'✓ Añadido a comparar',remove:'Quitar'}
};
const txt=()=>ui[lang()]||ui.en;
const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]').filter(Boolean).slice(0,max)}catch{return[]}};
const save=v=>localStorage.setItem(KEY,JSON.stringify(v.slice(0,max)));
const bySlug=s=>providers.find(p=>p.slug===s);
function toggle(slug){
  let list=get();
  if(list.includes(slug)) list=list.filter(x=>x!==slug);
  else if(list.length<max) list.push(slug);
  else {alert(txt().limit);return;}
  save(list);renderAll();
}
const categoryLabels={
 en:{caterer:'Caterers',venue:'Venues',planner:'Planners',dj:'DJs',photographer:'Photographers',videographer:'Videographers',decorator:'Decorators',florist:'Florists',beauty:'Beauty',henna:'Henna',band:'Musicians',transport:'Transport',cake:'Cakes',rentals:'Rentals',other:'Other'},
 ar:{caterer:'مموّنو الحفلات',venue:'القاعات',planner:'المنظمون',dj:'دي جي',photographer:'المصورون',videographer:'مصورو الفيديو',decorator:'الديكور',florist:'الزهور',beauty:'التجميل',henna:'الحناء',band:'الموسيقيون',transport:'النقل',cake:'الحلويات',rentals:'التأجير',other:'أخرى'},
 fr:{caterer:'Traiteurs',venue:'Lieux',planner:'Organisateurs',dj:'DJs',photographer:'Photographes',videographer:'Vidéastes',decorator:'Décorateurs',florist:'Fleuristes',beauty:'Beauté',henna:'Henné',band:'Musiciens',transport:'Transport',cake:'Pâtisserie',rentals:'Locations',other:'Autre'},
 es:{caterer:'Catering',venue:'Lugares',planner:'Organizadores',dj:'DJs',photographer:'Fotógrafos',videographer:'Videógrafos',decorator:'Decoradores',florist:'Floristas',beauty:'Belleza',henna:'Henna',band:'Músicos',transport:'Transporte',cake:'Pastelería',rentals:'Alquileres',other:'Otro'}
};
function categoryLabel(k){return (categoryLabels[lang()]||categoryLabels.en)[k]||k;}
function renderCategoryDiscovery(){
  const search=document.querySelector('#directory');
  if(!search||document.querySelector('.service-discovery'))return;
  const counts={};
  providers.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
  const categories=Object.entries(counts).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
  const section=document.createElement('section');
  section.className='service-discovery';
  const t=txt();section.innerHTML='<div class="service-discovery-head"><div><p class="eyebrow">'+t.need+'</p><h2>'+t.start+'</h2></div><p>'+t.hint+'</p></div><div class="service-chip-grid">'+categories.map(([k,n])=>`<button type="button" data-category-jump="${k}"><strong>${categoryLabel(k)}</strong><span>${t.provider(n)}</span></button>`).join('')+'</div>';
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
    const slug=card.dataset.providerSlug||share?.dataset.share;
    if(!slug)return;
    const actions=card.querySelector('.card-actions')||card;
    let btn=actions.querySelector('.compare-toggle');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.className='compare-toggle';btn.addEventListener('click',()=>toggle(slug));actions.appendChild(btn);}
    const selected=get().includes(slug);
    btn.textContent=selected?txt().comparing:txt().compare;
    btn.classList.toggle('active',selected);
    btn.setAttribute('aria-pressed',String(selected));
  });
}
function enhanceProfile(){
  if(!document.querySelector('.profile-shell'))return;
  const dynamicSlug=new URLSearchParams(location.search).get('slug');const staticMatch=location.pathname.match(/\/providers\/([^/]+)\.html$/);const slug=dynamicSlug||(staticMatch?decodeURIComponent(staticMatch[1]):'');
  if(!slug||!bySlug(slug))return;
  let btn=document.querySelector('#profileCompareButton');
  if(!btn){
    btn=document.createElement('button');btn.type='button';btn.id='profileCompareButton';btn.className='secondary-btn compare-toggle';
    btn.addEventListener('click',()=>toggle(slug));
    document.querySelector('.profile-actions')?.appendChild(btn);
  }
  const selected=get().includes(slug);btn.textContent=selected?txt().added:txt().add;btn.classList.toggle('active',selected);
}
function renderDrawer(){
  let drawer=document.querySelector('#compareDrawer');
  if(!drawer){drawer=document.createElement('aside');drawer.id='compareDrawer';drawer.className='compare-drawer';document.body.appendChild(drawer);}
  const list=get().map(bySlug).filter(Boolean);
  if(!list.length){drawer.hidden=true;return;}
  drawer.hidden=false;
  const t=txt();drawer.innerHTML=`<div><strong>${t.drawer}</strong><span>${t.selected(list.length)}</span></div><div class="compare-drawer-items">${list.map(p=>`<span>${p.name}<button type="button" data-remove-compare="${p.slug}" aria-label="${t.remove} ${p.name}">×</button></span>`).join('')}</div><a class="primary-btn" href="/compare.html?slugs=${encodeURIComponent(list.map(p=>p.slug).join(','))}">${t.now}</a>`;
  drawer.querySelectorAll('[data-remove-compare]').forEach(b=>b.addEventListener('click',()=>toggle(b.dataset.removeCompare)));
}
function renderAll(){document.querySelector('.service-discovery')?.remove();renderCategoryDiscovery();enhanceCards();enhanceProfile();renderDrawer();window.MarocVowsI18n?.apply(document);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',renderAll);else renderAll();document.querySelector('#language')?.addEventListener('change',()=>setTimeout(renderAll,0));document.addEventListener('marocvows:languagechange',()=>setTimeout(renderAll,0));
new MutationObserver(()=>{enhanceCards();renderDrawer();}).observe(document.documentElement,{subtree:true,childList:true});
})();
