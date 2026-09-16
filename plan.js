(()=>{
const providers=window.MAROCVOWS_PROVIDERS||[];
const catalog=window.MarocVowsCatalog;
if(!catalog)return;

const wrap=document.querySelector('#serviceChecks');
const eventSelect=document.querySelector('#eventType');
const citySelect=document.querySelector('#planCity');
const results=document.querySelector('#planResults');
const note=document.querySelector('#planRecommendationNote');

const copy={
en:{note:'Recommended services are preselected for this event based on providers currently listed in the selected city. You can change them.',none:'Choose at least one available service.',heading:'Your provider checklist',one:'provider currently listed in this city',many:'providers currently listed in this city',browse:'Browse →',unavailable:'not listed in this city yet'},
ar:{note:'تم اختيار الخدمات المقترحة مسبقاً حسب نوع المناسبة ومقدمي الخدمات المدرجين حالياً في المدينة المختارة. يمكنك تغييرها.',none:'اختر خدمة متاحة واحدة على الأقل.',heading:'قائمة مقدمي الخدمات',one:'مقدم خدمة مدرج حالياً في هذه المدينة',many:'مقدمو خدمات مدرجون حالياً في هذه المدينة',browse:'تصفح ←',unavailable:'غير مدرج في هذه المدينة بعد'},
fr:{note:'Les services recommandés sont présélectionnés selon le type d’événement et les prestataires actuellement référencés dans la ville choisie. Vous pouvez les modifier.',none:'Choisissez au moins un service disponible.',heading:'Votre liste de prestataires',one:'prestataire actuellement référencé dans cette ville',many:'prestataires actuellement référencés dans cette ville',browse:'Voir →',unavailable:'pas encore référencé dans cette ville'},
es:{note:'Los servicios recomendados se preseleccionan según el tipo de evento y los proveedores actualmente listados en la ciudad elegida. Puedes cambiarlos.',none:'Elige al menos un servicio disponible.',heading:'Tu lista de proveedores',one:'proveedor actualmente listado en esta ciudad',many:'proveedores actualmente listados en esta ciudad',browse:'Ver →',unavailable:'aún no listado en esta ciudad'}
};

const lang=()=>{
 const value=localStorage.getItem('marocvows-lang')||document.documentElement.lang||'en';
 return copy[value]?value:'en';
};
const txt=()=>copy[lang()];

function citySupply(city){
 return new Set(providers.filter(p=>p.cityKey===city).map(p=>p.category));
}

function renderServices(useRecommendations=false){
 const city=citySelect.value;
 const supply=citySupply(city);
 const selected=useRecommendations
   ?new Set(catalog.recommendations(eventSelect.value).filter(id=>supply.has(id)))
   :new Set([...wrap.querySelectorAll('input:checked')].map(x=>x.value).filter(id=>supply.has(id)));

 wrap.innerHTML=catalog.services.map(service=>{
   const available=supply.has(service.id);
   const checked=available&&selected.has(service.id);
   return '<label class="service-check"><input type="checkbox" value="'+service.id+'" '+(checked?'checked ':'')+(available?'':'disabled ')+'><span>'+catalog.serviceLabel(service.id,'form')+(available?'':' · '+txt().unavailable)+'</span></label>';
 }).join('');

 note.textContent=txt().note;
 window.MarocVowsI18n?.apply(document);
}

function buildPlan(){
 const city=citySelect.value;
 const selected=[...wrap.querySelectorAll('input:checked')].map(x=>x.value);
 if(!selected.length){
   results.innerHTML='<div class="soft-note">'+txt().none+'</div>';
   return;
 }
 results.innerHTML='<h2>'+txt().heading+'</h2>'+selected.map(id=>{
   const count=providers.filter(p=>p.category===id&&p.cityKey===city).length;
   const href='/?category='+encodeURIComponent(id)+'&city='+encodeURIComponent(city)+'#directory';
   return '<a class="plan-result" href="'+href+'"><div><strong>'+catalog.serviceLabel(id,'form')+'</strong><br><span>'+count+' '+(count===1?txt().one:txt().many)+'</span></div><b>'+txt().browse+'</b></a>';
 }).join('');
 window.MarocVowsI18n?.apply(document);
}

function resetForContext(){
 renderServices(true);
 results.innerHTML='';
}

catalog.renderEventSelect(eventSelect);
if(!eventSelect.value)eventSelect.value='wedding';
renderServices(true);

eventSelect.addEventListener('change',resetForContext);
citySelect.addEventListener('change',resetForContext);
document.querySelector('#buildPlan').addEventListener('click',buildPlan);
document.addEventListener('marocvows:languagechange',()=>{
 setTimeout(()=>{
   catalog.renderEventSelect(eventSelect);
   renderServices(false);
   if(results.children.length)buildPlan();
 },0);
});
})();