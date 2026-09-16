(()=>{
const services=[
{id:'venue',labels:{en:'Venue / wedding hall',ar:'قاعة / فضاء زفاف',fr:'Lieu / salle de mariage',es:'Lugar / salón de boda'},directory:{en:'Venues',ar:'القاعات',fr:'Lieux',es:'Lugares'}},
{id:'caterer',labels:{en:'Caterer',ar:'ممون حفلات',fr:'Traiteur',es:'Catering'},directory:{en:'Caterers',ar:'مموّنو الحفلات',fr:'Traiteurs',es:'Catering'}},
{id:'planner',labels:{en:'Wedding planner / manager',ar:'منظم / مدير زفاف',fr:'Organisateur / manager de mariage',es:'Organizador / coordinador de bodas'},directory:{en:'Planners',ar:'المنظمون',fr:'Organisateurs',es:'Organizadores'}},
{id:'negafa',labels:{en:'Negafa / traditional dressing',ar:'نكافة / اللباس التقليدي',fr:'Negafa / tenue traditionnelle',es:'Negafa / vestimenta tradicional'},directory:{en:'Negafa',ar:'النكافة',fr:'Negafa',es:'Negafa'}},
{id:'cook',labels:{en:'Cook / kitchen team',ar:'طباخ / فريق مطبخ',fr:'Cuisinier / équipe cuisine',es:'Cocinero / equipo de cocina'},directory:{en:'Cooks / kitchen teams',ar:'الطباخون / فرق المطبخ',fr:'Cuisiniers / équipes cuisine',es:'Cocineros / equipos de cocina'}},
{id:'dj',labels:{en:'DJ',ar:'دي جي',fr:'DJ',es:'DJ'},directory:{en:'DJs',ar:'دي جي',fr:'DJs',es:'DJs'}},
{id:'band',labels:{en:'Band / orchestra / traditional music',ar:'فرقة / أوركسترا / موسيقى تقليدية',fr:'Groupe / orchestre / musique traditionnelle',es:'Banda / orquesta / música tradicional'},directory:{en:'Musicians',ar:'الموسيقيون',fr:'Musiciens',es:'Músicos'}},
{id:'photographer',labels:{en:'Photographer',ar:'مصور',fr:'Photographe',es:'Fotógrafo'},directory:{en:'Photographers',ar:'المصورون',fr:'Photographes',es:'Fotógrafos'}},
{id:'videographer',labels:{en:'Videographer',ar:'مصور فيديو',fr:'Vidéaste',es:'Videógrafo'},directory:{en:'Videographers',ar:'مصورو الفيديو',fr:'Vidéastes',es:'Videógrafos'}},
{id:'decorator',labels:{en:'Decoration',ar:'الديكور',fr:'Décoration',es:'Decoración'},directory:{en:'Decorators',ar:'مصممو الديكور',fr:'Décorateurs',es:'Decoradores'}},
{id:'florist',labels:{en:'Florist / flowers',ar:'زهور / بائع زهور',fr:'Fleuriste / fleurs',es:'Florista / flores'},directory:{en:'Florists',ar:'باعة الزهور',fr:'Fleuristes',es:'Floristas'}},
{id:'beauty',labels:{en:'Hair / makeup / beauty',ar:'شعر / مكياج / تجميل',fr:'Coiffure / maquillage / beauté',es:'Peluquería / maquillaje / belleza'},directory:{en:'Beauty & makeup',ar:'التجميل والمكياج',fr:'Beauté & maquillage',es:'Belleza y maquillaje'}},
{id:'henna',labels:{en:'Henna artist',ar:'نقاشة حناء',fr:'Artiste henné',es:'Artista de henna'},directory:{en:'Henna',ar:'الحناء',fr:'Henné',es:'Henna'}},
{id:'cake',labels:{en:'Cake / pastry',ar:'كعك / حلويات',fr:'Gâteau / pâtisserie',es:'Tarta / pastelería'},directory:{en:'Cakes & pastry',ar:'الكعك والحلويات',fr:'Gâteaux & pâtisserie',es:'Tartas y pastelería'}},
{id:'transport',labels:{en:'Wedding cars / transport',ar:'سيارات الزفاف / النقل',fr:'Voitures de mariage / transport',es:'Coches de boda / transporte'},directory:{en:'Transport',ar:'النقل',fr:'Transport',es:'Transporte'}},
{id:'rentals',labels:{en:'Furniture / equipment rental',ar:'تأجير الأثاث / المعدات',fr:'Location mobilier / matériel',es:'Alquiler de mobiliario / equipo'},directory:{en:'Rentals',ar:'التأجير',fr:'Locations',es:'Alquileres'}},
{id:'invitations',labels:{en:'Invitations / guest gifts',ar:'دعوات / هدايا الضيوف',fr:'Invitations / cadeaux invités',es:'Invitaciones / regalos para invitados'},directory:{en:'Invitations & gifts',ar:'الدعوات والهدايا',fr:'Invitations & cadeaux',es:'Invitaciones y regalos'}},
{id:'entertainment',labels:{en:'Entertainment',ar:'ترفيه',fr:'Animation',es:'Entretenimiento'},directory:{en:'Entertainment',ar:'الترفيه',fr:'Animation',es:'Entretenimiento'}},
{id:'other',labels:{en:'Other wedding service',ar:'خدمة زفاف أخرى',fr:'Autre service de mariage',es:'Otro servicio de boda'},directory:{en:'Other services',ar:'خدمات أخرى',fr:'Autres services',es:'Otros servicios'}}
];

const events=[
{id:'wedding',labels:{en:'Wedding',ar:'زفاف',fr:'Mariage',es:'Boda'},recommended:['venue','caterer','planner','negafa','photographer','videographer','dj','band','decorator','florist','beauty','henna','cake','transport']},
{id:'engagement',labels:{en:'Engagement',ar:'خطوبة',fr:'Fiançailles',es:'Compromiso'},recommended:['venue','caterer','planner','negafa','photographer','decorator','florist','beauty','henna','cake']},
{id:'henna',labels:{en:'Henna celebration',ar:'ليلة الحناء',fr:'Cérémonie du henné',es:'Celebración de henna'},recommended:['venue','caterer','negafa','photographer','band','decorator','beauty','henna','cake']},
{id:'birthday',labels:{en:'Birthday',ar:'عيد ميلاد',fr:'Anniversaire',es:'Cumpleaños'},recommended:['venue','caterer','photographer','dj','decorator','cake','entertainment']},
{id:'family',labels:{en:'Family celebration',ar:'احتفال عائلي',fr:'Fête familiale',es:'Celebración familiar'},recommended:['venue','caterer','photographer','band','decorator','cake','entertainment']},
{id:'corporate',labels:{en:'Corporate event',ar:'فعالية مهنية',fr:'Événement professionnel',es:'Evento corporativo'},recommended:['venue','caterer','planner','photographer','dj','decorator','transport','rentals']},
{id:'other',labels:{en:'Other event',ar:'مناسبة أخرى',fr:'Autre événement',es:'Otro evento'},recommended:['venue','caterer','planner','photographer','dj','decorator']}
];

const lang=()=>{const v=localStorage.getItem('marocvows-lang')||document.documentElement.lang||'en';return ['en','ar','fr','es'].includes(v)?v:'en';};
const serviceMap=Object.fromEntries(services.map(x=>[x.id,x]));
const eventMap=Object.fromEntries(events.map(x=>[x.id,x]));

function serviceLabel(id,variant='form',code=lang()){
 const item=serviceMap[id];
 if(!item)return id;
 return (variant==='directory'?item.directory:item.labels)[code]||(variant==='directory'?item.directory:item.labels).en;
}
function eventLabel(id,code=lang()){
 const item=eventMap[id];return item?(item.labels[code]||item.labels.en):id;
}
function recommendations(eventId){return [...(eventMap[eventId]?.recommended||[])];}

function renderServiceSelect(select,{includeAll=false,availableOnly=false,variant='form'}={}){
 if(!select)return;
 const current=select.value;
 const available=new Set((window.MAROCVOWS_PROVIDERS||[]).map(p=>p.category));
 let html=includeAll?'<option value="all">'+({en:'All services',ar:'كل الخدمات',fr:'Tous les services',es:'Todos los servicios'}[lang()])+'</option>':'';
 html+=services.filter(s=>!availableOnly||available.has(s.id)).map(s=>'<option value="'+s.id+'">'+serviceLabel(s.id,variant)+'</option>').join('');
 select.innerHTML=html;
 if([...select.options].some(o=>o.value===current))select.value=current;
}
function renderEventSelect(select){
 if(!select)return;
 const current=select.value;
 select.innerHTML=events.map(e=>'<option value="'+e.id+'">'+eventLabel(e.id)+'</option>').join('');
 if([...select.options].some(o=>o.value===current))select.value=current;else select.value='wedding';
}
function renderChecks(container,{name,className='service-choice',variant='form',selected=[],disabledIds=[]}={}){
 if(!container)return;
 const selectedSet=new Set(selected),disabledSet=new Set(disabledIds);
 container.innerHTML=services.map(s=>'<label class="'+className+'"><input type="checkbox" name="'+name+'" value="'+s.id+'" '+(selectedSet.has(s.id)?'checked ':'')+(disabledSet.has(s.id)?'disabled ':' )+'> '+serviceLabel(s.id,variant)+'</label>').join('');
}
function rerenderManaged(){
 document.querySelectorAll('[data-service-select]').forEach(el=>renderServiceSelect(el,{includeAll:el.dataset.includeAll==='true',availableOnly:el.dataset.availableOnly==='true',variant:el.dataset.serviceVariant||'form'}));
 document.querySelectorAll('[data-event-select]').forEach(renderEventSelect);
 document.querySelectorAll('[data-service-checks]').forEach(el=>{
   const selected=[...el.querySelectorAll('input:checked')].map(x=>x.value);
   renderChecks(el,{name:el.dataset.serviceName||'services',className:el.dataset.serviceClass||'service-choice',variant:el.dataset.serviceVariant||'form',selected});
 });
}
document.addEventListener('marocvows:languagechange',()=>setTimeout(rerenderManaged,0));

window.MarocVowsCatalog={services,events,serviceLabel,eventLabel,recommendations,renderServiceSelect,renderEventSelect,renderChecks,rerenderManaged};
})();