(()=>{
const providers=window.MAROCVOWS_PROVIDERS||[];
const options=[
 ['venue','Venue / hall'],['caterer','Caterer'],['planner','Wedding / event planner'],['dj','DJ / entertainment'],['photographer','Photographer'],['videographer','Videographer'],['decorator','Decoration'],['florist','Flowers'],['beauty','Beauty / makeup'],['henna','Henna'],['band','Live music'],['transport','Transport'],['cake','Cake / pastry'],['rentals','Equipment / rentals']
];
const wrap=document.querySelector('#serviceChecks');
const available=new Set(providers.map(p=>p.category));
wrap.innerHTML=options.map(([value,label])=>'<label class="service-check"><input type="checkbox" value="'+value+'" '+(available.has(value)?'':'disabled')+'><span>'+label+(available.has(value)?'':' · coming soon')+'</span></label>').join('');
['venue','caterer','photographer','dj'].forEach(v=>{const x=wrap.querySelector('input[value="'+v+'"]');if(x&&!x.disabled)x.checked=true;});
document.querySelector('#buildPlan').addEventListener('click',()=>{
 const city=document.querySelector('#planCity').value;
 const selected=[...wrap.querySelectorAll('input:checked')].map(x=>x.value);
 const results=document.querySelector('#planResults');
 if(!selected.length){results.innerHTML='<div class="soft-note">Choose at least one available service.</div>';return;}
 results.innerHTML='<h2>Your provider checklist</h2>'+selected.map(cat=>{
   const label=options.find(x=>x[0]===cat)?.[1]||cat;
   const count=providers.filter(p=>p.category===cat&&p.cityKey===city).length;
   const href='/?category='+encodeURIComponent(cat)+'&city='+encodeURIComponent(city)+'#directory';
   return '<a class="plan-result" href="'+href+'"><div><strong>'+label+'</strong><br><span>'+count+' provider'+(count===1?'':'s')+' currently listed in this city</span></div><b>Browse →</b></a>';
 }).join('');
});
})();