(()=>{
const cfg=window.MAROCVOWS_CONFIG||{};
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
let supabase=null;
let user=null;
let recoveryMode=new URLSearchParams(location.search).get('mode')==='recovery';

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
  supabase.auth.onAuthStateChange((event,session)=>{
    if(event==='PASSWORD_RECOVERY')recoveryMode=true;
    user=session?.user||null;
    renderAuthState();
  });
  const {data}=await supabase.auth.getSession();
  user=data.session?.user||null;
  return supabase;
}

function portalEnabled(){return cfg.portalFeaturesEnabled===true;}
function oauthProviders(){return Array.isArray(cfg.oauthProviders)?cfg.oauthProviders:[];}
function authReturnUrl(){return location.origin+'/account.html';}

function enhancePasswordFields(){
  $$('input[type="password"]').forEach(input=>{
    if(input.parentElement?.classList.contains('password-wrap'))return;
    const wrap=document.createElement('span');
    wrap.className='password-wrap';
    input.parentNode.insertBefore(wrap,input);
    wrap.appendChild(input);
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='password-toggle';
    btn.textContent='Show';
    btn.setAttribute('aria-label','Show password');
    btn.addEventListener('click',()=>{
      const showing=input.type==='text';
      input.type=showing?'password':'text';
      btn.textContent=showing?'Show':'Hide';
      btn.setAttribute('aria-label',showing?'Show password':'Hide password');
    });
    wrap.appendChild(btn);
  });
}

function renderOauthButtons(){
  const enabled=oauthProviders();
  $$('[data-oauth-provider]').forEach(btn=>{
    const provider=btn.dataset.oauthProvider;
    const active=enabled.includes(provider);
    btn.disabled=!active;
    btn.title=active?'':`${provider[0].toUpperCase()+provider.slice(1)} sign-in will activate after provider setup in Supabase.`;
  });
}

function renderAuthState(){
  const gate=$('#portalGate');
  const authShell=$('#authShell');
  const memberShell=$('#memberShell');
  const recoveryShell=$('#recoveryShell');
  const userEmail=$('#userEmail');
  const signOut=$('#signOut');

  if(recoveryMode){
    if(gate)gate.hidden=true;
    if(authShell)authShell.hidden=true;
    if(memberShell)memberShell.hidden=true;
    if(recoveryShell)recoveryShell.hidden=false;
    $$('[data-auth-only]').forEach(el=>el.hidden=true);
    $$('[data-guest-only]').forEach(el=>el.hidden=true);
    return;
  }

  if(recoveryShell)recoveryShell.hidden=true;

  if(!portalEnabled()){
    if(gate){gate.hidden=false;gate.textContent='The MarocVows account portal is built but not publicly open yet. We are finishing the final launch checks before collecting account data.';}
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
    const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:authReturnUrl()}});
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

async function quickEmailSignIn(e){
  e.preventDefault();
  const form=e.currentTarget;
  const email=$('[name="email"]',form).value.trim();
  const out=$('.status',form);
  try{
    await loadSupabase();
    const {error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:authReturnUrl()}});
    if(error)throw error;
    status(out,'If that email belongs to a MarocVows account, a secure sign-in link has been sent.','success');
  }catch(err){status(out,err?.message||'Could not send the sign-in link.','error');}
}

async function socialSignIn(e){
  const btn=e.currentTarget;
  const provider=btn.dataset.oauthProvider;
  const out=$('#oauthStatus');
  if(!oauthProviders().includes(provider)){
    status(out,`${provider[0].toUpperCase()+provider.slice(1)} sign-in is prepared but not enabled yet.`, '');
    return;
  }
  try{
    await loadSupabase();
    const {error}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo:authReturnUrl()}});
    if(error)throw error;
  }catch(err){status(out,err?.message||'Could not start social sign-in.','error');}
}

async function forgotPassword(e){
  e.preventDefault();
  const form=e.currentTarget;
  const email=$('[name="email"]',form).value.trim();
  const out=$('.status',form);
  try{
    await loadSupabase();
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/account.html?mode=recovery'});
    if(error)throw error;
    status(out,'If that email belongs to a MarocVows account, a password-reset link has been sent.','success');
  }catch(err){status(out,err?.message||'Could not send the password-reset email.','error');}
}

async function updatePassword(e){
  e.preventDefault();
  const form=e.currentTarget;
  const password=$('[name="password"]',form).value;
  const confirm=$('[name="confirm_password"]',form).value;
  const out=$('.status',form);
  if(password.length<8){status(out,'Use at least 8 characters for your new password.','error');return;}
  if(password!==confirm){status(out,'Passwords do not match.','error');return;}
  try{
    await loadSupabase();
    const {error}=await supabase.auth.updateUser({password});
    if(error)throw error;
    recoveryMode=false;
    history.replaceState({},'',location.pathname);
    status(out,'Password updated successfully.','success');
    renderAuthState();
  }catch(err){status(out,err?.message||'Could not update the password. Open the newest reset link and try again.','error');}
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
  enhancePasswordFields();
  renderOauthButtons();
  $('#signUpForm')?.addEventListener('submit',signUp);
  $('#signInForm')?.addEventListener('submit',signIn);
  $('#magicLinkForm')?.addEventListener('submit',quickEmailSignIn);
  $('#forgotPasswordForm')?.addEventListener('submit',forgotPassword);
  $('#updatePasswordForm')?.addEventListener('submit',updatePassword);
  $$('[data-oauth-provider]').forEach(btn=>btn.addEventListener('click',socialSignIn));
  $('#signOut')?.addEventListener('click',signOut);
  $('#weddingRequestForm')?.addEventListener('submit',submitWeddingRequest);
  $('#providerForm')?.addEventListener('submit',submitProvider);

  if(!portalEnabled()&&!recoveryMode){renderAuthState();return;}
  try{await loadSupabase();renderAuthState();}
  catch(_e){const gate=$('#portalGate');if(gate){gate.hidden=false;gate.textContent='The account service is temporarily unavailable.';}}
}

document.addEventListener('DOMContentLoaded',boot);
})();