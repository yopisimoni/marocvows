(()=>{
const cfg=window.MAROCVOWS_CONFIG||{};
const providers=window.MAROCVOWS_PROVIDERS||[];
const allowed=new Set(['profile_view','call','whatsapp','email','website','map']);
function provider(slug){return providers.find(p=>p.slug===slug)||{}}
async function record(slug,action){
 if(!cfg.supabaseUrl||!cfg.publishableKey||!slug||!allowed.has(action))return;
 const p=provider(slug);
 const payload={provider_slug:slug,action,city:p.city||null,category:p.category||null,page_path:location.pathname+location.search};
 try{
   await fetch(cfg.supabaseUrl+'/rest/v1/contact_events',{
     method:'POST',
     headers:{'apikey':cfg.publishableKey,'Content-Type':'application/json','Prefer':'return=minimal'},
     body:JSON.stringify(payload),
     keepalive:true
   });
 }catch(_){}
}
window.MarocVowsTrack={record};
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-provider-action][data-provider-slug]');
 if(!el)return;
 record(el.dataset.providerSlug,el.dataset.providerAction);
},{capture:true});
const qs=new URLSearchParams(location.search);
if(location.pathname.endsWith('/vendor-profile.html')||location.pathname.endsWith('vendor-profile.html')){
 const slug=qs.get('slug');
 if(slug)record(slug,'profile_view');
}
})();
