const { test, expect } = require('@playwright/test');

const BASE='https://www.marocvows.com';

function collectRuntimeErrors(page){
  const errors=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message));
  page.on('console',msg=>{ if(msg.type()==='error') errors.push('console: '+msg.text()); });
  return errors;
}

async function open(page,path='/'){
  let last;
  for(let i=0;i<4;i++){
    try{
      const res=await page.goto(BASE+path,{waitUntil:'domcontentloaded',timeout:15000});
      if(res&&res.ok()){
        // Give first-party scripts a short deterministic window to hydrate/render.
        await page.waitForTimeout(350);
        return res;
      }
      last=new Error('HTTP '+(res?res.status():'no response'));
    }catch(e){
      last=e;
      console.log('Navigation attempt '+(i+1)+' failed for '+path+': '+e.message);
    }
    if(i<3)await page.waitForTimeout(1500);
  }
  throw last;
}

async function setLanguage(page,lang){
  const selector=page.locator('#language');
  await expect(selector).toBeVisible();
  await selector.selectOption(lang);
  await page.waitForTimeout(250);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('html')).toHaveAttribute('dir',lang==='ar'?'rtl':'ltr');
}

test.describe('MarocVows production visual QA',()=>{
  test('homepage switches EN → FR → AR → ES without stale copy',async({page})=>{
    const errors=collectRuntimeErrors(page);
    await open(page,'/');
    await expect(page.locator('body')).toContainText('MarocVows');
    await page.screenshot({path:'qa-artifacts/home-en.png',fullPage:true});

    await setLanguage(page,'fr');
    await expect(page.locator('[data-t="find"]')).not.toHaveText('Find providers');
    const frText=await page.locator('[data-t="find"]').innerText();
    await page.screenshot({path:'qa-artifacts/home-fr.png',fullPage:true});

    await setLanguage(page,'ar');
    await expect(page.locator('[data-t="find"]')).not.toHaveText(frText);
    const arText=await page.locator('[data-t="find"]').innerText();
    await page.screenshot({path:'qa-artifacts/home-ar.png',fullPage:true});

    await setLanguage(page,'es');
    await expect(page.locator('[data-t="find"]')).not.toHaveText(arText);
    await expect(page.locator('[data-t="find"]')).not.toHaveText('Find providers');
    await page.screenshot({path:'qa-artifacts/home-es.png',fullPage:true});

    expect(errors).toEqual([]);
  });

  test('canonical service directory is populated from real supply',async({page})=>{
    const errors=collectRuntimeErrors(page);
    await open(page,'/');
    await expect(page.locator('#categoryFilter')).toBeVisible();
    const values=await page.locator('#categoryFilter option').evaluateAll(opts=>opts.map(o=>o.value));
    expect(values).toContain('all');
    expect(values).toContain('caterer');
    expect(values).toContain('venue');
    expect(values).toContain('planner');
    expect(values).toContain('photographer');
    expect(values).not.toContain('negafa');
    expect(values).not.toContain('invitations');
    expect(errors).toEqual([]);
  });

  test('planner recommendations change by event and city',async({page})=>{
    const errors=collectRuntimeErrors(page);
    await open(page,'/plan.html');

    await page.locator('#planCity').selectOption('meknes');
    await page.locator('#eventType').selectOption('birthday');
    await page.waitForTimeout(200);

    await expect(page.locator('#serviceChecks input[value="dj"]')).toBeChecked();
    await expect(page.locator('#serviceChecks input[value="planner"]')).not.toBeChecked();
    await expect(page.locator('#serviceChecks input[value="florist"]')).toBeDisabled();

    await page.locator('#buildPlan').click();
    await expect(page.locator('#planResults')).toContainText('DJ');
    await page.screenshot({path:'qa-artifacts/planner-birthday-meknes.png',fullPage:true});

    await page.locator('#eventType').selectOption('corporate');
    await page.waitForTimeout(200);
    await expect(page.locator('#serviceChecks input[value="planner"]')).toBeChecked();

    await page.locator('#planCity').selectOption('khenifra');
    await page.waitForTimeout(200);
    const checked=await page.locator('#serviceChecks input:checked').evaluateAll(xs=>xs.map(x=>x.value));
    expect(checked).toEqual(['caterer']);
    expect(errors).toEqual([]);
  });

  test('verified provider profile translates and keeps business identity unchanged',async({page})=>{
    const errors=collectRuntimeErrors(page);
    await open(page,'/providers/palais-amani-fes.html');
    await expect(page.locator('h1')).toHaveText('Palais Amani');
    await setLanguage(page,'fr');
    await expect(page.locator('h1')).toHaveText('Palais Amani');
    await expect(page.locator('body')).toContainText('Avant de réserver');
    await page.screenshot({path:'qa-artifacts/provider-palais-amani-fr.png',fullPage:true});
    expect(errors).toEqual([]);
  });

  test('Arabic city page is RTL and translated',async({page})=>{
    const errors=collectRuntimeErrors(page);
    await open(page,'/wedding-caterers-fes.html');
    await setLanguage(page,'ar');
    await expect(page.locator('h1')).not.toHaveText('Wedding caterers in Fès');
    await page.screenshot({path:'qa-artifacts/city-fes-ar.png',fullPage:true});
    expect(errors).toEqual([]);
  });

  test('mobile homepage has no horizontal overflow',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    const errors=collectRuntimeErrors(page);
    await open(page,'/');
    await expect(page.locator('body')).toContainText('MarocVows');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await expect(page.locator('#language')).toBeVisible();
    await page.screenshot({path:'qa-artifacts/mobile-home.png',fullPage:true});
    expect(errors).toEqual([]);
  });

  test('key public routes return successfully',async({page})=>{
    for(const path of ['/','/plan.html','/wedding-caterers-fes.html','/wedding-caterers-meknes.html','/about.html','/contact.html','/providers/palais-amani-fes.html']){
      const res=await open(page,path);
      expect(res.status(),path).toBeLessThan(400);
    }
  });
});
