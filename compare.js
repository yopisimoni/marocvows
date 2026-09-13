(()=>{
const providers=window.MAROCVOWS_PROVIDERS||[];
const params=new URLSearchParams(location.search);
const slugs=(params.get('slugs')||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,3);
const list=slugs.map(s=>providers.find(p=>p.slug===s)).filter(Boolean);
const grid=document.querySelector('#compareGrid');
const esc=s=>{const d=document.createElement('div');d.textContent=String(s??'');return d.innerHTML;};
function contact(p){
 const out=[];
 if(p.phone)out.push('<a class="primary-btn" data-provider-slug="'+p.slug+'" data-provider-action="call" href="tel:'+p.phone+'">Call</a>');
 if(p.whatsapp)out.push('<a class="secondary-btn" data-provider-slug="'+p.slug+'" data-provider-action="whatsapp" href="https://wa.me/'+p.whatsapp.replace(/\\D/g,'')+'" target="_blank" rel="noopener">WhatsApp</a>');
 if(p.email)out.push('<a class="secondary-btn" data-provider-slug="'+p.slug+'" data-provider-action="email" href="mailto:'+esc(p.email)+'">Email</a>');
 if(p.website)out.push('<a class="secondary-btn" data-provider-slug="'+p.slug+'" data-provider-action="website" href="'+esc(p.website)+'" target="_blank" rel="noopener">Website</a>');
 out.push('<a class="secondary-btn" href="'+(p.verified?('/providers/'+encodeURIComponent(p.slug)+'.html'):('/vendor-profile.html?slug='+encodeURIComponent(p.slug)))+'">Full profile</a>');
 return out.join('');
}
if(!list.length){grid.outerHTML='<div class="compare-empty"><strong>No providers selected.</strong><p>Return to the directory and add up to three providers to compare.</p><a class="primary-btn" href="/">Browse providers</a></div>';return;}
grid.innerHTML=list.map(p=>{
 const review=p.reviewCount?(Number(p.averageRating||0).toFixed(1)+' ★ · '+p.reviewCount+' reviews'):'New · no approved reviews yet';
 const verification=p.verified?'Verified by MarocVows':(p.verifiedAt?('Public details checked '+p.verifiedAt):'Not yet verified by MarocVows');
 const services=p.services&&p.services.length?'<div><strong>Services</strong><div class="compare-services">'+p.services.slice(0,7).map(s=>'<span>'+esc(s)+'</span>').join('')+'</div></div>':'';
 return '<article class="compare-card"><div><span class="pill">'+esc(p.city)+'</span></div><h2>'+esc(p.name)+'</h2><div class="category">'+esc(p.categoryLabel||'Wedding & event service')+'</div><div class="compare-facts"><div class="compare-fact"><small>MarocVows reviews</small><strong>'+review+'</strong></div><div class="compare-fact"><small>Profile status</small><strong>'+(p.claimed?'Claimed profile':'Unclaimed listing')+'</strong></div><div class="compare-fact"><small>Contact check</small><strong>'+verification+'</strong></div><div class="compare-fact"><small>Location</small><strong>'+esc(p.address||p.city)+'</strong></div></div>'+services+'<div class="compare-actions">'+contact(p)+'</div></article>';
}).join('');
})();