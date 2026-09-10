(()=>{
const cfg=window.MAROCVOWS_CONFIG||{};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const params=new URLSearchParams(location.search);
const qaMode=params.get('qa')==='1';
let supabase=null;
let user=null;

function setStatus(msg,type=''){
  const el=$('#onboardingStatus');
  if(!el)return;
  el.textContent=msg||'';
  el.dataset.type=type;
}

async function loadSupabase(){
  if(supabase)return supabase;
  await new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.115.0/dist/umd/supabase.min.js';
    s.onload=resolve;
    s.onerror=reject;
    document.head.appendChild(s);
  });
  supabase=window.supabase.createClient(cfg.supabaseUrl,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:true}});
  return supabase;
}

function setRole(role,scroll=true){
  document.body.dataset.selectedRole=role||'';
  $$('[data-role-choice]').forEach(btn=>{
    const active=btn.dataset.roleChoice===role;
    btn.classList.toggle('is-active',active);
    btn.setAttribute('aria-pressed',active?'true':'false');
  });
  $('#clientProfile').hidden=role!=='client';
  $('#providerProfile').hidden=role!=='provider';
  $('#welcomeQuestion').hidden=!!role;
  $$('[data-change-role]').forEach(btn=>btn.hidden=!role);
  if(role&&scroll){
    const target=role==='client'?$('#clientProfile'):$('#providerProfile');
    target?.scrollIntoView({behavior:'smooth',block:'start'});
  }
}

function selectedValues(name,root=document){
  return $$(`input[name="${name}"]:checked`,root).map(x=>x.value);
}

function setContinueTargets(){
  const client=$('#clientContinue');
  const provider=$('#providerContinue');
  if(qaMode){
    if(client)client.href='qa-portal-20260910.html?onboarded=1#qa-client';
    if(provider)provider.href='qa-portal-20260910.html?onboarded=1#qa-provider';
  }
}

function fillProfile(profile){
  if(!profile)return;
  if(profile.account_type)setRole(profile.account_type,false);
  const common=[['full_name',profile.full_name],['city',profile.city],['phone',profile.phone]];
  common.forEach(([name,value])=>$$(`[name="${name}"]`).forEach(el=>{if(value!=null&&!el.value)el.value=value;}));
  if(profile.event_type&&$('#clientProfile [name="event_type"]'))$('#clientProfile [name="event_type"]').value=profile.event_type;
  if(profile.event_date&&$('#clientProfile [name="event_date"]'))$('#clientProfile [name="event_date"]').value=profile.event_date;
  if(profile.guest_count&&$('#clientProfile [name="guest_count"]'))$('#clientProfile [name="guest_count"]').value=profile.guest_count;
  (profile.client_services||[]).forEach(v=>{const el=$(`#clientProfile input[name="client_services"][value="${v}"]`);if(el)el.checked=true;});
  if(profile.business_name&&$('#providerProfile [name="business_name"]'))$('#providerProfile [name="business_name"]').value=profile.business_name;
  if(profile.service_area&&$('#providerProfile [name="service_area"]'))$('#providerProfile [name="service_area"]').value=profile.service_area;
  (profile.provider_types||[]).forEach(v=>{const el=$(`#providerProfile input[name="provider_types"][value="${v}"]`);if(el)el.checked=true;});
  if(profile.onboarding_completed){
    $('#welcomeTitle').textContent='Welcome back to MarocVows';
    $('#welcomeLead').textContent='We remember why you joined. You can update your details or continue to the right next step.';
    if(profile.account_type==='client')$('#clientContinue').hidden=false;
    if(profile.account_type==='provider')$('#providerContinue').hidden=false;
  }
}

async function loadExistingProfile(){
  const {data,error}=await supabase.from('member_profiles').select('*').eq('user_id',user.id).maybeSingle();
  if(error)throw error;
  fillProfile(data);
}

async function saveClient(e){
  e.preventDefault();
  const form=e.currentTarget;
  const services=selectedValues('client_services',form);
  if(!services.length){setStatus('Choose at least one service you want help finding.','error');return;}
  const payload={user_id:user.id,account_type:'client',full_name:form.full_name.value.trim(),city:form.city.value.trim(),phone:form.phone.value.trim()||null,event_type:form.event_type.value,event_date:form.event_date.value||null,guest_count:form.guest_count.value?Number(form.guest_count.value):null,client_services:services,business_name:null,provider_types:[],service_area:null,onboarding_completed:true,updated_at:new Date().toISOString()};
  try{
    setStatus('Saving your wedding needs…');
    const {error}=await supabase.from('member_profiles').upsert(payload,{onConflict:'user_id'});
    if(error)throw error;
    await supabase.auth.updateUser({data:{marocvows_role:'client'}});
    setStatus('Perfect. MarocVows now knows what kind of help you need.','success');
    $('#clientContinue').hidden=false;
  }catch(err){setStatus(err?.message||'Could not save your profile.','error');}
}

async function saveProvider(e){
  e.preventDefault();
  const form=e.currentTarget;
  const types=selectedValues('provider_types',form);
  if(!types.length){setStatus('Choose at least one wedding service you offer.','error');return;}
  const payload={user_id:user.id,account_type:'provider',full_name:form.full_name.value.trim(),city:form.city.value.trim(),phone:form.phone.value.trim()||null,event_type:null,event_date:null,guest_count:null,client_services:[],business_name:form.business_name.value.trim(),provider_types:types,service_area:form.service_area.value.trim()||null,onboarding_completed:true,updated_at:new Date().toISOString()};
  try{
    setStatus('Saving your professional profile…');
    const {error}=await supabase.from('member_profiles').upsert(payload,{onConflict:'user_id'});
    if(error)throw error;
    await supabase.auth.updateUser({data:{marocvows_role:'provider'}});
    setStatus('Perfect. MarocVows now knows what services you offer.','success');
    $('#providerContinue').hidden=false;
  }catch(err){setStatus(err?.message||'Could not save your profile.','error');}
}

async function signOut(){
  try{await supabase.auth.signOut();}catch(_e){}
  const base=document.body.dataset.authPage||'account.html';
  location.href=qaMode?`${base}?v=simple3`:base;
}

async function boot(){
  setContinueTargets();
  try{
    await loadSupabase();
    const {data,error}=await supabase.auth.getSession();
    if(error)throw error;
    user=data.session?.user||null;
    if(!user){
      const base=document.body.dataset.authPage||'account.html';
      location.replace(qaMode?`${base}?v=simple3`:base);
      return;
    }
    $('#memberEmail').textContent=user.email||'';
    $$('[data-role-choice]').forEach(btn=>btn.addEventListener('click',()=>setRole(btn.dataset.roleChoice)));
    $$('[data-change-role]').forEach(btn=>btn.addEventListener('click',()=>setRole('')));
    $('#clientProfile')?.addEventListener('submit',saveClient);
    $('#providerProfile')?.addEventListener('submit',saveProvider);
    $('#signOutWelcome')?.addEventListener('click',signOut);
    await loadExistingProfile();
  }catch(err){setStatus(err?.message||'The account service is temporarily unavailable.','error');}
}

document.addEventListener('DOMContentLoaded',boot);
})();