(()=>{
const vendors={
  'traiteur-el-moutaouakil':{name:'Traiteur El Moutaouakil',city:'Khénifra',address:'CARREFOUR, Khénifra 54000',phone:'+212660389807'},
  'traiteur-el-ghrabli':{name:'Traiteur El Ghrabli',city:'Khénifra',address:'Idriss II, Khénifra 54000',phone:'+212661714324'},
  'lux-atlas-events':{name:'Lux Atlas Events',city:'Khénifra',address:'4 Rue Oum Rabiaa, Hamria, Khénifra'},
  'deguste':{name:'Deguste',city:'Khénifra',address:'Quartier des F.A.R., 1st floor, Khénifra'},
  'doreve-events-traiteur':{name:'DOREVE EVENTS Traiteur',city:'Fès',address:'Etg 2, Fatima Zahrae VN, Ville Nouvelle 1, Bureau 10 Rue Lalla Fatima Zahra, Fès 30000, Morocco',phone:'+212657073073',publicCategory:'Caterer & event planner',publicRating:4.8,publicReviewCount:250,verifiedAt:'10 Sep 2026'},
  'traiteur-afrah-metarhri':{name:'Traiteur AFRAH.METARHRI',city:'Fès',address:'Jabal Tghat 2, Fès 30090',phone:'+212690989593'},
  'afrah-noujoum-fes':{name:'Afrah Noujoum Fès',city:'Fès',address:'Atlas, Route de Sefrou, Fès 30000',phone:'+212662078275'},
  'traiteur-fes-damo':{name:'Traiteur Fès Damo',city:'Fès',address:'Fès, Morocco',phone:'+212674068196'},
  'la-gala-luxury-events':{name:'La Gala Luxury Events',city:'Fès',address:'Champs De Course, Magasin 6, 23 Lot Yacouta Bled Tazi Entree Droite, Fès 30000, Morocco',phone:'+212662808900',publicCategory:'Caterer',publicRating:5.0,publicReviewCount:3,verifiedAt:'10 Sep 2026'},
  'chhiouate-fes':{name:'Chhiouate Fès',city:'Fès',address:'Fès 30000',phone:'+212661986633'},
  'arab-events-traiteur':{name:'Arab Events Traiteur',city:'Fès',address:'Moulay Driss Zerhoun, Fès, Morocco',phone:'+212649487580',publicCategory:'Caterer',verifiedAt:'10 Sep 2026'},
  'traiteur-bensalem-fes':{name:'Traiteur Bensalem Fès',city:'Fès',address:'Avenue Med El Fassi, Fès 30500',phone:'+212661407045'},
  'arizona-events':{name:'Arizona Events',city:'Fès',address:'Fès 30050',phone:'+212661397454'},
  'touche-de-vie-traiteur':{name:'Touche de Vie Traiteur',city:'Fès',address:'Rue Abdelkrim Benjelloun, Fès 30000',phone:'+212644677988'},
  'mounirs-traiteur-meknes':{name:"Mounir's Traiteur Meknes",city:'Meknès',address:'Magazin N 2, Avenue Zerektouni, Route Hopital Mohamed V, Meknès 50000, Morocco',phone:'+212660404490',publicCategory:'Caterer',publicRating:4.7,publicReviewCount:181,verifiedAt:'10 Sep 2026',website:'https://traiteur-meknes-mounirs.com/',services:['Weddings','Private events','Corporate events','Decoration','Art de la table','Maître d’hôtel']},
  'allo-pastilla-maroc-group':{name:'Allo Pastilla Maroc Group',city:'Meknès',address:'1 IMM A2 APPRT 3, RES IBN SINA, Meknès 50100, Morocco',phone:'+212687803551',publicCategory:'Caterer',publicRating:5.0,publicReviewCount:6,verifiedAt:'10 Sep 2026'},
  'traiteur-family-hamdoune-meknes':{name:'Traiteur Family Hamdoune Meknès',city:'Meknès',address:'Kamilia, Rue Belair, Meknès 50000',phone:'+212665874447'},
  'dar-bennouna-traiteur':{name:'Dar Bennouna Traiteur',city:'Meknès',address:'Meknès, Morocco',phone:'+212661948284'},
  'fidelity-events-and-traiteur':{name:'Fidelity Events & Traiteur',city:'Meknès',address:'Ismalia 2, Rue de Fès, Meknès 50000',phone:'+212611348724'},
  'al-akhawayn-traiteur-meknes':{name:'Al-Akhawayn Traiteur Meknes',city:'Meknès',address:'Rue Haroun Errachid, Ville Nouvelle, Meknès 50000',phone:'+212666035056'},
  'bennouna-maitre-traiteur':{name:'Bennouna Maître Traiteur',city:'Meknès',address:'107 Rue Lahboul, Meknès 50000',phone:'+212618031131'},
  'harfi-afrah':{name:'HARFI AFRAH',city:'Meknès',address:'Meknès, Morocco',phone:'+212679394928'},
  'traiteur-la-belle-famille':{name:'Traiteur La Belle Famille',city:'Meknès',address:'Haye Asskari, Meknès',phone:'+212660331695'},
  'traiteur-el-mamounia':{name:'Traiteur El Mamounia',city:'Meknès',address:'Meknès, Morocco',phone:'+212617169650'},
  'traiteur-brahim-event':{name:'Traiteur Brahim Event',city:'Meknès',address:'Ryad, Meknès',phone:'+212665971050'}
};
const qs=new URLSearchParams(location.search);
const slug=qs.get('slug');
const v=vendors[slug];
const $=s=>document.querySelector(s);
if(!v){$('#profile').innerHTML='<h1>Vendor not found</h1><p><a href="/">Return to the MarocVows directory</a>.</p>';return;}
const publicUrl=`https://www.marocvows.com/vendor-profile.html?slug=${encodeURIComponent(slug)}`;
document.title=`${v.name} | ${v.city} Wedding Caterer | MarocVows`;
const desc=`View contact and location details for ${v.name}, a wedding caterer listed in ${v.city}, Morocco. Confirm availability, pricing and services directly.`;
let meta=document.querySelector('meta[name="description"]');if(meta)meta.content=desc;
let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}canonical.href=publicUrl;
$('#name').textContent=v.name;$('#city').textContent=v.city;$('#address').textContent=v.address;$('#crumb').textContent=v.name;
$('#category').textContent=v.publicCategory||'Wedding caterer & event service';
$('#phoneRow').innerHTML=v.phone?`<a class="primary-btn" href="tel:${v.phone.replace(/\s+/g,'')}">Call ${v.phone}</a>`:'<span class="soft-note">Phone number not currently listed. Confirm contact details independently.</span>';
$('#mapLink').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(v.address);
if(v.website){const w=$('#websiteLink');w.href=v.website;w.hidden=false;}
if(v.services&&v.services.length){$('#servicesBlock').hidden=false;$('#services').innerHTML=v.services.map(s=>`<span>${s}</span>`).join('');}
if(v.publicCategory||v.publicRating||v.verifiedAt){const box=$('#publicSnapshot');const bits=[];if(v.publicCategory)bits.push(v.publicCategory);if(v.publicRating)bits.push(`${v.publicRating}/5 from ${v.publicReviewCount||0} public reviews`);$('#snapshotText').textContent=bits.join(' · ');$('#verifiedStamp').textContent=v.verifiedAt?`Public listing checked ${v.verifiedAt}. Ratings and review counts can change.`:'';box.classList.add('visible');}
const ld={"@context":"https://schema.org","@type":"LocalBusiness","name":v.name,"address":v.address,"areaServed":v.city,"url":publicUrl};if(v.phone)ld.telephone=v.phone;if(v.website)ld.sameAs=[v.website];document.getElementById('vendorSchema').textContent=JSON.stringify(ld);
})();