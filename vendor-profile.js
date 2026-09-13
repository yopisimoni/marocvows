(()=>{
const vendors=Object.fromEntries((window.MAROCVOWS_PROVIDERS||[]).map(v=>[v.slug,v]));
const qs=new URLSearchParams(location.search);
const slug=qs.get('slug');
const v=vendors[slug];
const $=s=>document.querySelector(s);
if(!v){$('#profile').innerHTML='<h1>Vendor not found</h1><p><a href="/">Return to the MarocVows directory</a>.</p>';return;}
const publicUrl=`https://www.marocvows.com/vendor-profile.html?slug=${encodeURIComponent(slug)}`;
document.title=`${v.name} | ${v.city} | MarocVows`;
const desc=`View contact, location and service details for ${v.name}, a wedding and event provider listed in ${v.city}, Morocco. Confirm availability, pricing and services directly.`;
let meta=document.querySelector('meta[name="description"]');if(meta)meta.content=desc;
let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}canonical.href=publicUrl;
$('#name').textContent=v.name;$('#city').textContent=v.city;$('#address').textContent=v.address;$('#crumb').textContent=v.name;
$('#category').textContent=v.categoryLabel||'Wedding & event service';
$('#phoneRow').innerHTML=v.phone?`<a class="primary-btn" href="tel:${v.phone.replace(/\s+/g,'')}">Call ${v.phone}</a>`:'<span class="soft-note">Phone number not currently listed. Confirm contact details independently.</span>';
$('#mapLink').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(v.address);
if(v.website){const w=$('#websiteLink');w.href=v.website;w.hidden=false;} if(v.whatsapp){const row=$('#phoneRow');row.insertAdjacentHTML('beforeend',`<a class="secondary-btn" href="https://wa.me/${v.whatsapp.replace(/\D/g,'')}" target="_blank" rel="noopener">WhatsApp</a>`);} if(v.email){$('#phoneRow').insertAdjacentHTML('beforeend',`<a class="secondary-btn" href="mailto:${v.email}">Email</a>`);}
if(v.services&&v.services.length){$('#servicesBlock').hidden=false;$('#services').innerHTML=v.services.map(s=>`<span>${s}</span>`).join('');}
if(v.categoryLabel||v.reviewCount||v.verifiedAt||v.claimed){const box=$('#publicSnapshot');const bits=[];if(v.categoryLabel)bits.push(v.categoryLabel);bits.push(v.reviewCount?`${Number(v.averageRating||0).toFixed(1)}/5 from ${v.reviewCount} approved MarocVows reviews`:'New · no approved MarocVows reviews yet');bits.push(v.claimed?'Claimed profile':'Unclaimed listing');$('#snapshotText').textContent=bits.join(' · ');$('#verifiedStamp').textContent=v.verifiedAt?`Listing information last checked ${v.verifiedAt}.`:'Contact details have not yet been marked verified by MarocVows.';box.classList.add('visible');}
const ld={"@context":"https://schema.org","@type":"LocalBusiness","name":v.name,"address":v.address,"areaServed":v.serviceArea||v.city,"url":publicUrl};if(v.phone)ld.telephone=v.phone;const same=[];if(v.website)same.push(v.website);if(v.instagram)same.push(v.instagram);if(same.length)ld.sameAs=same;document.getElementById('vendorSchema').textContent=JSON.stringify(ld);
})();