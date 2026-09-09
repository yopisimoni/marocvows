(()=>{
const cfg=window.MAROCVOWS_CONFIG||{};
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
let supabase=null;
let user=null;

function status(el,msg,type=''){
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
  const {data}=await supabase.auth.getSession();
  user=data.session?.user||null;
  supabase.auth.onAuthStateChange((_event,session)=>{
    user=session?.user||null;
    renderAuthState();
  });
  return supabase;
}

function portalEnabled(){return cfg.portalFeaturesEnabled===true;}

function renderAuthState(){
  const gate=$('#portalGate');
  const authShell=$('#authShell');
  const memberShell=$('#memberShell');
  const userEmail=$('#userEmail');
  const signOut=$('#signOut');

  if(!portalEnabled()){
    if(gate){gate.hidden=false;gate.textContent='The MarocVows account portal is built but not publicly open yet. We are finishing the privacy/contact and production-authentication launch checks before collecting account data.';}
    if(authShell)authShell.hidden=true;
    if(memberShell)memberShell.hidden=true;
    $$('[data-auth-only]').forEach(el=>el.hidden=true);
    $$('[data-guest-only]').forEach(el=>el.hidden=true);
    return;
  }

  if(gate)gate.hidden=true;
  if(authShell)authShell.hidden=!!user;
  if(memberShell)memberShell.hidden=!user;
  if(userEmail)userEmail.textContent=user?.email||'';
  if(signOut)signOut.hidden=!user;

  $$('[data-auth-only]').forEach(el=>el.hidden=!user);
  $$('[data-guest-only]').forEach(el=>el.hidden=!!user);

  if(user){
    $$('input[data-account-email]').forEach(input=>{input.value=user.email||'';input.readOnly=true;});
    loadMemberHistory();
  }
}

async function signUp(e){
  e.preventDefault();
  const form=e.currentTarget;
  const email=$('[name="email"]',form).value.trim();
  const password=$('[name="password"]',form).value;
  const confirm=$('[name="confirm_password"]',form)?.value;
  const out=$('.status',form);
  if(password.length<8){status(out,'Use at least 8 characters for your password.','error');return;}
  if(confirm!==undefined&&password!==confirm){status(out,'Passwords do not match.','error');return;}
  try{
    await loadSupabase();
    const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/account.html'}});
    if(error)throw error;
    if(data.session){
      user=data.user;
      status(out,'Account created. You are signed in.','success');
      renderAuthState();
    }else{
      status(out,'Account created. Check your email to confirm your address, then sign in.','success');
    }
  }catch(err){status(out,err?.message||'Could not create the account.','error');}
}

async function signIn(e){
  e.preventDefault();
  const form=e.currentTarget;
  const email=$('[name="email"]',form).value.trim();
  const password=$('[name="password"]',form).value;
  const out=$('.status',form);
  try{
    await loadSupabase();
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error)throw error;
    user=data.user;
    status(out,'Signed in.','success');
    renderAuthState();
  }catch(err){status(out,err?.message||'Could not sign in.','error');}
}

async function signOut(){
  try{await loadSupabase();await supabase.auth.signOut();user=null;renderAuthState();}
  catch(_e){}
}

async function submitWeddingRequest(e){
  e.preventDefault();
  if(!portalEnabled()||!user)return;
  const form=e.currentTarget;
  const out=$('.status',form);
  const services=$$('input[name="services"]:checked',form).map(x=>x.value);
  const payload={
    user_id:user.id,
    full_name:form.full_name.value.trim(),
    email:user.email||form.email.value.trim(),
    phone:form.phone.value.trim()||null,
    city:form.city.value.trim(),
    event_date:form.event_date.value||null,
    guest_count:form.guest_count.value?Number(form.guest_count.value):null,
    budget_range:form.budget_range.value||null,
    services,
    notes:form.notes.value.trim(),
    status:'new'
  };
  try{
    await loadSupabase();
    const {error}=await supabase.from('wedding_requests').insert(payload);
    if(error)throw error;
    form.reset();
    form.email.value=user.email||'';
    form.email.readOnly=true;
    status(out,'Request received. MarocVows can now review your needs and help shortlist suitable wedding professionals.','success');
    loadMemberHistory();
  }catch(err){status(out,err?.message||'Could not send your request.','error');}
}

async function submitProvider(e){
  e.preventDefault();
  if(!portalEnabled()||!user)return;
  const form=e.currentTarget;
  const out=$('.status',form);
  const payload={
    user_id:user.id,
    business_name:form.business_name.value.trim(),
    provider_type:form.provider_type.value,
    contact_name:form.contact_name.value.trim(),
    email:user.email||form.email.value.trim(),
    phone:form.phone.value.trim()||null,
    whatsapp:form.whatsapp.value.trim()||null,
    city:form.city.value.trim(),
    service_area:form.service_area.value.trim()||null,
    address:form.address.value.trim()||null,
    website:form.website.value.trim()||null,
    instagram:form.instagram.value.trim()||null,
    description:form.description.value.trim(),
    status:'pending'
  };
  try{
    await loadSupabase();
    const {error}=await supabase.from('provider_applications').insert(payload);
    if(error)throw error;
    form.reset();
    form.email.value=user.email||'';
    form.email.readOnly=true;
    status(out,'Application received. It will stay private until MarocVows reviews the business details.','success');
    loadMemberHistory();
  }catch(err){status(out,err?.message||'Could not submit the application.','error');}
}

async function loadMemberHistory(){
  if(!portalEnabled()||!user||!supabase)return;
  const requests=$('#requestHistory');
  const applications=$('#applicationHistory');
  try{
    if(requests){
      const {data,error}=await supabase.from('wedding_requests').select('id,city,event_date,status,created_at').order('created_at',{ascending:false}).limit(10);
      if(error)throw error;
      requests.innerHTML=(data||[]).length?(data||[]).map(r=>`<div class="legal-card"><strong>${escapeHtml(r.city)}</strong><p>${r.event_date?escapeHtml(r.event_date)+' · ':''}${escapeHtml(r.status)}</p></div>`).join(''):'<p class="soft-note">No wedding-help requests yet.</p>';
    }
    if(applications){
      const {data,error}=await supabase.from('provider_applications').select('id,business_name,provider_type,status,created_at').order('created_at',{ascending:false}).limit(10);
      if(error)throw error;
      applications.innerHTML=(data||[]).length?(data||[]).map(r=>`<div class="legal-card"><strong>${escapeHtml(r.business_name)}</strong><p>${escapeHtml(r.provider_type)} · ${escapeHtml(r.status)}</p></div>`).join(''):'<p class="soft-note">No provider applications yet.</p>';
    }
  }catch(err){
    if(requests)requests.innerHTML='<p class="soft-note">History is temporarily unavailable.</p>';
    if(applications)applications.innerHTML='<p class="soft-note">History is temporarily unavailable.</p>';
  }
}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));}

async function boot(){
  $('#signUpForm')?.addEventListener('submit',signUp);
  $('#signInForm')?.addEventListener('submit',signIn);
  $('#signOut')?.addEventListener('click',signOut);
  $('#weddingRequestForm')?.addEventListener('submit',submitWeddingRequest);
  $('#providerForm')?.addEventListener('submit',submitProvider);

  if(!portalEnabled()){renderAuthState();return;}
  try{await loadSupabase();renderAuthState();}
  catch(_e){const gate=$('#portalGate');if(gate){gate.hidden=false;gate.textContent='The account service is temporarily unavailable.';}}
}

document.addEventListener('DOMContentLoaded',boot);
})();