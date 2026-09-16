(()=>{
const cfg=window.MAROCVOWS_CONFIG||{};
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
let supabase=null;
let user=null;
let recoveryMode=false;
const callbackParams=new URLSearchParams(location.search);
const callbackErrorCode=callbackParams.get('error_code')||'';
const t=(key,fallback)=>window.MarocVowsLocale?.t?.(key,fallback)||fallback;

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
    user=session?.user||null;
    renderAuthState();
  });
  const {data}=await supabase.auth.getSession();
  user=data.session?.user||null;
  return supabase;
}

function portalEnabled(){return cfg.portalFeaturesEnabled===true;}
function oauthProviders(){return Array.isArray(cfg.oauthProviders)?cfg.oauthProviders:[];}\nfunction whatsappEnabled(){return cfg.whatsappAuthEnabled===true;}\nlet whatsappPhone='';
function authReturnUrl(){
  const base=(cfg.domain||location.origin).replace(/\/$/,'');
  return base+'/account.html';
}
function postAuthDestination(){
  const params=new URLSearchParams(location.search);
  if(params.get('onboarded')==='1')return '';
  if(location.pathname.endsWith('/account.html'))return 'welcome.html';
  return '';
}

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
    btn.textContent=t('Show','Show');
    btn.setAttribute('aria-label',t('Show password','Show password'));
    btn.addEventListener('click',()=>{
      const showing=input.type==='text';
      input.type=showing?'password':'text';
      btn.textContent=showing?t('Show','Show'):t('Hide','Hide');
      btn.setAttribute('aria-label',showing?t('Show password','Show password'):t('Hide password','Hide password'));
    });
    wrap.appendChild(btn);
  });
}

function ensureResendConfirmation(){
  const signUp=$('#signUpForm');
  if(!signUp||$('#resendConfirmationForm'))return;
  const wrap=document.createElement('details');
  wrap.className='auth-details';
  wrap.innerHTML=`<summary class="auth-text-link">Didn't receive the confirmation email?</summary>
    <form id="resendConfirmationForm" class="review-form compact-form">
      <label>Email<input name="email" type="email" autocomplete="email" maxlength="254" placeholder="you@example.com" required></label>
      <div class="status"></div>
      <button class="auth-secondary-btn" type="submit">Resend confirmation email</button>
    </form>`;
  signUp.insertAdjacentElement('afterend',wrap);
  $('#resendConfirmationForm')?.addEventListener('submit',resendConfirmation);
}

function renderOauthButtons(){
  const enabled=oauthProviders();
  const buttons=[...document.querySelectorAll('[data-oauth-provider]')];
  const row=$('.simple-social-row');
  const divider=$('.auth-divider');
  const whatsapp=$('#whatsappStartButton');
  const hasFastMethod=enabled.length>0||whatsappEnabled();
  if(row)row.hidden=!hasFastMethod;
  if(divider)divider.hidden=!hasFastMethod;
  buttons.forEach(btn=>{
    const provider=btn.dataset.oauthProvider;
    const active=enabled.includes(provider);
    btn.hidden=!active;
    btn.disabled=!active;
  });
  if(whatsapp)whatsapp.hidden=!whatsappEnabled();
  if(!whatsappEnabled()&&$('#whatsappAuthPanel'))$('#whatsappAuthPanel').hidden=true;
}

function renderRoleState(){
  const current=$('#currentRole');
  const saved=user?.user_metadata?.marocvows_role||'';
  if(current){
    current.textContent=saved==='client'?'Last choice: looking for wedding services':saved==='provider'?'Last choice: offering wedding services':'';
    current.hidden=!saved;
  }
}

function renderAuthState(){
  const gate=$('#portalGate');
  const authShell=$('#authShell');
  const memberShell=$('#memberShell');
  const userEmail=$('#userEmail');
  const signOut=$('#signOut');

  // A successful confirmation callback creates a session on account.html.
  // Route that confirmed user into onboarding even while the public portal flag remains off.
  if(user&&portalEnabled()){
    const destination=postAuthDestination();
    if(destination){location.replace(destination);return;}
  }

  if(!portalEnabled()){
    if(gate){
      gate.hidden=false;
      if(callbackErrorCode==='otp_expired'){
        gate.innerHTML=t('expiredConfirmation','That confirmation link has expired or was already used. Return to this page and request a fresh confirmation email when account access opens.');
      }else{
        gate.textContent=t('portalClosed','The MarocVows account portal is built but not publicly open yet. We are finishing the final launch checks before collecting account data.');
      }
    }
    if(authShell)authShell.hidden=true;
    if(memberShell)memberShell.hidden=true;
    $$('[data-auth-only]').forEach(el=>el.hidden=true);
    return;
  }

  if(gate)gate.hidden=true;
  if(authShell)authShell.hidden=!!user;
  if(memberShell)memberShell.hidden=!user;
  if(userEmail)userEmail.textContent=user?.email||user?.phone||'';
  if(signOut)signOut.hidden=!user;
  $$('[data-auth-only]').forEach(el=>el.hidden=!user);

  if(user){
    $$('input[data-account-email]').forEach(input=>{input.value=user.email||'';input.readOnly=true;});
    renderRoleState();
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
      status(out,'Account created.','success');
      renderAuthState();
    }else{
      status(out,'Account created. Check your email to confirm it. If the link expires, use Resend confirmation email below.','success');
      const resendEmail=$('#resendConfirmationForm [name="email"]');
      if(resendEmail)resendEmail.value=email;
    }
  }catch(err){status(out,err?.message||'Could not create the account.','error');}
}

async function resendConfirmation(e){
  e.preventDefault();
  const form=e.currentTarget;
  const email=$('[name="email"]',form).value.trim();
  const out=$('.status',form);
  try{
    await loadSupabase();
    const {error}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:authReturnUrl()}});
    if(error)throw error;
    status(out,'A fresh confirmation email has been sent. Use the newest email only.','success');
  }catch(err){status(out,err?.message||'Could not resend the confirmation email.','error');}
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

async function emailAccess(e){
  e.preventDefault();
  const form=e.currentTarget;
  const email=$('[name="email"]',form).value.trim();
  const out=$('.status',form);
  try{
    await loadSupabase();
    const {error}=await supabase.auth.signInWithOtp({
      email,
      options:{shouldCreateUser:true,emailRedirectTo:authReturnUrl()}
    });
    if(error)throw error;
    status(out,t('emailLinkSent','Check your email for a secure MarocVows sign-in link. Use the newest email only.'),'success');
  }catch(err){
    status(out,err?.message||t('emailLinkError','Could not send the secure sign-in link. Please try again.'),'error');
  }
}

function normalizePhone(value){
  const cleaned=String(value||'').replace(/[\s().-]/g,'');
  return /^\+[1-9]\d{7,14}$/.test(cleaned)?cleaned:'';
}

async function sendWhatsappOtp(e){
  e.preventDefault();
  const form=e.currentTarget;
  const out=$('#oauthStatus');
  const phone=normalizePhone(form.phone.value);
  if(!whatsappEnabled()){status(out,'WhatsApp sign-in is not enabled yet.','');return;}
  if(!phone){status(out,'Use an international phone number such as +2126…','error');return;}
  try{
    await loadSupabase();
    const {error}=await supabase.auth.signInWithOtp({phone,options:{channel:'whatsapp'}});
    if(error)throw error;
    whatsappPhone=phone;
    $('#whatsappVerifyForm').hidden=false;
    status(out,'We sent a verification code in WhatsApp.','success');
  }catch(err){status(out,err?.message||'Could not send the WhatsApp code.','error');}
}

async function verifyWhatsappOtp(e){
  e.preventDefault();
  const token=e.currentTarget.token.value.trim();
  const out=$('#oauthStatus');
  if(!whatsappPhone||!token)return;
  try{
    await loadSupabase();
    const {data,error}=await supabase.auth.verifyOtp({phone:whatsappPhone,token,type:'sms'});
    if(error)throw error;
    user=data.user||data.session?.user||null;
    status(out,'Signed in.','success');
    renderAuthState();
  }catch(err){status(out,err?.message||'Could not verify the WhatsApp code.','error');}
}

async function socialSignIn(e){
  const btn=e.currentTarget;
  const provider=btn.dataset.oauthProvider;
  const out=$('#oauthStatus');
  if(!oauthProviders().includes(provider)){
    status(out,`${provider[0].toUpperCase()+provider.slice(1)} sign-in is not enabled yet.`,'');
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
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:authReturnUrl()});
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

async function chooseRole(e){
  const btn=e.currentTarget;
  const role=btn.dataset.roleChoice;
  const target=btn.dataset.roleTarget||'';
  const out=$('#roleStatus');
  if(!user||!['client','provider'].includes(role))return;
  try{
    await loadSupabase();
    const {data,error}=await supabase.auth.updateUser({data:{marocvows_role:role}});
    if(error)throw error;
    if(data?.user)user=data.user;
    renderRoleState();
    status(out,role==='client'?'Great — tell us what you need for your wedding or event.':'Great — tell us what service you offer.','success');
    if(target.startsWith('#')){
      $$('[data-qa-role]').forEach(el=>el.hidden=true);
      const panel=$(target);
      if(panel){panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'});}
    }else if(target){location.href=target;}
  }catch(err){status(out,err?.message||'Could not save your choice.','error');}
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
  const payload={user_id:user.id,full_name:form.full_name.value.trim(),email:user.email||form.email.value.trim(),phone:form.phone.value.trim()||null,city:form.city.value.trim(),event_date:form.event_date.value||null,guest_count:form.guest_count.value?Number(form.guest_count.value):null,budget_range:form.budget_range.value||null,services,notes:form.notes.value.trim(),status:'new'};
  try{
    await loadSupabase();
    const {error}=await supabase.from('wedding_requests').insert(payload);
    if(error)throw error;
    form.reset();
    form.email.value=user.email||'';
    form.email.readOnly=true;
    status(out,'Request received. MarocVows can now review your needs.','success');
    loadMemberHistory();
  }catch(err){status(out,err?.message||'Could not send your request.','error');}
}

async function submitProvider(e){
  e.preventDefault();
  if(!portalEnabled()||!user)return;
  const form=e.currentTarget;
  const out=$('.status',form);
  const payload={user_id:user.id,business_name:form.business_name.value.trim(),provider_type:form.provider_type.value,contact_name:form.contact_name.value.trim(),email:user.email||form.email.value.trim(),phone:form.phone.value.trim()||null,whatsapp:form.whatsapp.value.trim()||null,city:form.city.value.trim(),service_area:form.service_area.value.trim()||null,address:form.address.value.trim()||null,website:form.website.value.trim()||null,instagram:form.instagram.value.trim()||null,description:form.description.value.trim(),status:'pending'};
  try{
    await loadSupabase();
    const {error}=await supabase.from('provider_applications').insert(payload);
    if(error)throw error;
    form.reset();
    form.email.value=user.email||'';
    form.email.readOnly=true;
    status(out,'Application received. It will stay private until MarocVows reviews it.','success');
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
  renderOauthButtons();
  $('#emailAccessForm')?.addEventListener('submit',emailAccess);
  $('[data-oauth-provider]').forEach(btn=>btn.addEventListener('click',socialSignIn));
  $('#whatsappStartButton')?.addEventListener('click',()=>{$('#whatsappAuthPanel').hidden=false;});
  $('#whatsappSendForm')?.addEventListener('submit',sendWhatsappOtp);
  $('#whatsappVerifyForm')?.addEventListener('submit',verifyWhatsappOtp);
  $$('[data-role-choice]').forEach(btn=>btn.addEventListener('click',chooseRole));
  $('#signOut')?.addEventListener('click',signOut);
  $('#weddingRequestForm')?.addEventListener('submit',submitWeddingRequest);
  $('#providerForm')?.addEventListener('submit',submitProvider);

  const authRuntimeNeeded=portalEnabled()||callbackErrorCode!==''||location.hash.includes('access_token=')||location.hash.includes('error_code=');
  if(!authRuntimeNeeded){renderAuthState();return;}
  try{await loadSupabase();renderAuthState();}
  catch(_e){const gate=$('#portalGate');if(gate){gate.hidden=false;gate.textContent=t('authUnavailable','The account service is temporarily unavailable.');}}
}

document.addEventListener('DOMContentLoaded',boot);
})();