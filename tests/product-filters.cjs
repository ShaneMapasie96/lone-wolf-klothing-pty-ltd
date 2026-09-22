const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({channel:'msedge'});
 const page = await browser.newPage();
 await page.route('http://local/**', async route => {
  const fs = require('fs'), file = require('path').join(process.cwd(), new URL(route.request().url()).pathname);
  if(fs.existsSync(file) && fs.statSync(file).isFile()) await route.fulfill({path:file}); else await route.abort();
 });
 await page.route(/^https:/, route => route.abort());
 for (const file of require('fs').readdirSync('clothing-pages')) {
  await page.goto('http://local/clothing-pages/'+file);
  const filters=page.locator('.product-filters');
  await filters.waitFor();
  await page.waitForTimeout(350);
  const designChoices = await filters.getByLabel('Design',{exact:true}).locator('option').allTextContents();
  const designOrder = ['Lone Wolf Emblem - Large Print','Lone Wolf Emblem - Pocket Size','Wolf Head','Lone Wolf Typography','Isolation Breeds Growth'];
  assert.deepEqual(designChoices.filter(name=>name!=='All'),designOrder.filter(name=>designChoices.includes(name)));
  assert(!designChoices.includes('Lone Wolf Emblem'));
  const carouselState = () => page.locator('.item').evaluateAll(items => items.map(item => ({
   image: item.querySelector('img').getAttribute('src'),
   colour: item.querySelector('.selected-color')?.dataset.color,
   variants: item._variants,
   index: item._variantIndex
  })));
  assert.deepEqual(await filters.locator('select').evaluateAll(elements=>elements.map(el=>el.value)),['','','']);
  const total=await page.locator('.item:visible').count();
  const purchase=await page.locator('.item select:not([name="design"])').evaluateAll(elements=>elements.map(el=>el.value));
  const originalDesigns=await page.locator('.item select[name="design"]').evaluateAll(elements=>elements.map(el=>el.value));
  await page.locator('.item select[name="design"]').evaluateAll(elements=>elements.forEach(select=> {
   const option=Array.from(select.options).find(option=>/wolf[ -]head/i.test(option.textContent));
   if(option) { select.value=option.value; select.dispatchEvent(new Event('change',{bubbles:true})); }
  }));
  const expectedCarousel=await carouselState();
  const expectedDesigns=await page.locator('.item select[name="design"]').evaluateAll(elements=>elements.map(el=>el.value));
  const expectedPrices=await page.locator('.item .price').allTextContents();
  await page.locator('.item select[name="design"]').evaluateAll((elements,values)=>elements.forEach((select,index)=> {
   select.value=values[index]; select.dispatchEvent(new Event('change',{bubbles:true}));
  }),originalDesigns);
  await filters.getByLabel('Size',{exact:true}).selectOption('S');
  await filters.getByLabel('Design',{exact:true}).selectOption('Wolf Head');
  assert.deepEqual(await carouselState(),expectedCarousel,'top design filter differs from card carousel handler');
  assert.deepEqual(await page.locator('.item select[name="design"]').evaluateAll(elements=>elements.map(el=>el.value)),expectedDesigns);
  assert.deepEqual(await page.locator('.item .price').allTextContents(),expectedPrices);
  if(file === 't-shirts_and_vests.html') {
   const shirt=page.locator('.item').first();
   assert.equal(await shirt.locator('.selected-color').getAttribute('data-color'),'White');
   assert.equal(await shirt.locator('figure > img').getAttribute('src'),'../t-shirts/white-blk-wolf-head-t-shirt.webp');
   await shirt.getByRole('button',{name:'Next variant',exact:true}).click();
   assert.equal(await shirt.locator('figure > img').getAttribute('src'),'../t-shirts/white-red-wolf-head-t-shirt.webp');
   await shirt.getByRole('button',{name:'Previous variant',exact:true}).click();
  }
  await filters.getByRole('button',{name:file === 'puffer_jackets_and_body_warmers.html' ? 'Black' : 'White',exact:true}).click();
  assert.equal(await filters.locator('.product-filter-tag').count(),3);
  await filters.getByRole('button',{name:'Remove S filter',exact:true}).click();
  assert.equal(await filters.getByLabel('Size',{exact:true}).inputValue(),'');
  assert.equal(await filters.getByLabel('Design',{exact:true}).inputValue(),'Wolf Head');
  assert.deepEqual(await page.locator('.item select:not([name="design"])').evaluateAll(elements=>elements.map(el=>el.value)),purchase);
  assert.deepEqual(await carouselState(),expectedCarousel,'other filters changed carousel or purchase colour');
  await filters.getByLabel('Size',{exact:true}).selectOption('2XL');
  assert(await page.locator('.item:visible').count() > 0, '2XL should match clothing');
  await filters.getByLabel('Size',{exact:true}).selectOption('3XL');
  assert(await page.locator('.item:visible').count() > 0, '3XL should match clothing');
  await filters.getByRole('button',{name:'Clear all',exact:true}).click();
  assert.equal(await page.locator('.item:visible').count(),total);
  assert.equal(await filters.locator('.product-filter-tag').count(),0);
  assert.equal(await filters.getByRole('button',{name:'Clear all',exact:true}).isVisible(),false);
  for (const design of ['Lone Wolf Emblem - Large Print','Lone Wolf Emblem - Pocket Size']) {
   const supported = await page.locator('.item').evaluateAll((items,name)=>items.filter(item=>
    Array.from(item.querySelectorAll('select[name="design"] option')).some(option=>
     (option.textContent.trim() === 'Lone Wolf Emblem' ? 'Lone Wolf Emblem - Pocket Size' : option.textContent.trim()) === name)).length,design);
   assert.equal(await filters.getByLabel('Design',{exact:true}).locator('option').filter({hasText:design}).count(), supported ? 1 : 0);
   if (!supported) continue;
   await page.locator('.item select[name="design"]').evaluateAll((selects,name)=>selects.forEach(select=> {
    const option=Array.from(select.options).find(option=>
     (option.textContent.trim() === 'Lone Wolf Emblem' ? 'Lone Wolf Emblem - Pocket Size' : option.textContent.trim()) === name);
    if(option) { select.value=option.value; select.dispatchEvent(new Event('change',{bubbles:true})); }
   }),design);
   const expected=await carouselState();
   const prices=await page.locator('.item .price').allTextContents();
   await filters.getByLabel('Design',{exact:true}).selectOption('Wolf Head');
   await filters.getByLabel('Design',{exact:true}).selectOption(design);
   assert.equal(await page.locator('.item:visible').count(),supported);
   const actual=await carouselState();
   const visibleIndices=await page.locator('.item').evaluateAll(items=>items.flatMap((item,index)=>item.hidden?[]:[index]));
   for(const index of visibleIndices) assert.deepEqual(actual[index],expected[index]);
   if(file === 'tracksuits.html') {
    const variants = actual[visibleIndices[0]].variants;
    assert(variants.every(path => design === 'Lone Wolf Emblem - Large Print' ? /a4-/.test(path) : !/a4-/.test(path)),
     'tracksuit emblem variants mix large print and pocket size');
   }
   const actualPrices=await page.locator('.item .price').allTextContents();
   for(const index of visibleIndices) assert.equal(actualPrices[index],prices[index]);
   assert(await page.locator('.item:visible select[name="design"]').evaluateAll((selects,name)=>selects.every(select=>
    (select.selectedOptions[0].textContent.trim() === 'Lone Wolf Emblem' ? 'Lone Wolf Emblem - Pocket Size' : select.selectedOptions[0].textContent.trim()) === name),design));
   await filters.getByRole('button',{name:'Clear all',exact:true}).click();
  }
  if(file === 'puffer_jackets_and_body_warmers.html') {
   const colours = () => filters.locator('.product-filter-palette button:visible').evaluateAll(buttons=>buttons.map(button=>button.getAttribute('aria-label')));
   assert.deepEqual(await colours(),['All colours','Black','Grey','Navy Blue','Red']);
   await filters.getByRole('button',{name:'Navy Blue',exact:true}).click();
   assert.equal(await page.locator('.item:visible').count(),1);
   await filters.getByLabel('Product Type',{exact:true}).selectOption('Body Warmers');
   assert.deepEqual(await colours(),['All colours','Black']);
   assert.equal(await filters.getByRole('button',{name:'All colours',exact:true}).getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('.item:visible').count(),1);
   await filters.getByLabel('Product Type',{exact:true}).selectOption('Puffer Jackets');
   assert.deepEqual(await colours(),['All colours','Black','Grey','Navy Blue','Red']);
   await filters.getByRole('button',{name:'Clear all',exact:true}).click();
   assert.equal(await page.locator('.item:visible').count(),2);
  }
  if(file === 't-shirts_and_vests.html') {
   await filters.getByLabel('Product Type',{exact:true}).selectOption('Vests');
   assert.equal(await page.locator('.item:visible').count(),1);
   await filters.getByRole('button',{name:'Baby Pink',exact:true}).click();
   assert.equal(await page.locator('.item:visible').count(),0);
   await filters.getByLabel('Product Type',{exact:true}).selectOption('T-Shirts');
   assert.equal(await page.locator('.item:visible').count(),1);
   await filters.getByRole('button',{name:'Clear all',exact:true}).click();
  }
  if(file === 'sweatpants_and_shorts.html') {
   const shorts = page.locator('.item').nth(1);
   for (const [design, filename] of [['Lone Wolf Emblem','lw-emblem'],['Wolf Head','wolf-head'],['Lone Wolf Typography','lw-type']]) {
    await shorts.locator('select[name="design"]').selectOption({label:design});
    assert.deepEqual(await shorts.locator('.color[data-color]').evaluateAll(swatches=>swatches.map(swatch=>swatch.dataset.color)),
     ['White','Black','Grey','Pink','Red','Royal Blue','Yellow']);
    await shorts.locator('.color[data-color="Royal Blue"]').click();
    const image = shorts.locator('figure > img');
    assert((await image.getAttribute('src')).includes('../shorts/royal-blue-white-'+filename+'-shorts.'));
    await image.evaluate(img=>img.decode());
    assert(await image.evaluate(img=>img.naturalWidth>0));
   }
  }
  assert.equal(await page.locator('.design-selector-row label').filter({hasText:'Select Design:'}).count(),0);
  for (const width of [1280,768,375]) {
   await page.setViewportSize({width,height:900});
   await page.mouse.move(0,0);
   await page.locator('body').click({position:{x:1,y:1}});
   const headingTop = () => page.locator('.product-title').evaluate(el=>el.getBoundingClientRect().top+window.scrollY);
   const before = await headingTop();
   for (const trigger of await page.locator('.custom-dropbtn').all()) {
    await trigger.hover();
    await page.waitForTimeout(50);
    assert.equal(await headingTop(),before,'dropdown hover moved content at '+width);
    await trigger.focus();
    assert.equal(await headingTop(),before,'dropdown focus moved content at '+width);
    await page.locator('.custom-dropdown-content:visible a').first().hover();
    assert.equal(await headingTop(),before,'moving into dropdown moved content');
    await trigger.evaluate(el=>el.blur());
    await page.mouse.move(0,0);
   }
  }
  await page.mouse.move(1200,800);
  await page.setViewportSize({width:375,height:812});
  assert.equal(await filters.locator('.product-filter-panel').isVisible(),false);
  for(const width of [1440,1024,901,768,375,320]) {
   await page.setViewportSize({width,height:900});
   if(width<=900 && !(await filters.locator('.product-filter-panel').isVisible())) await filters.getByRole('button',{name:'Filter products',exact:true}).click();
   assert(await filters.evaluate(el=>el.scrollWidth<=el.clientWidth),'filter overflow at '+width);
   const layout = await filters.locator('.product-filter-controls').evaluate(el=> {
    const bounds=el.getBoundingClientRect();
    const boxes=Array.from(el.querySelectorAll('select,button'),child=>child.getBoundingClientRect());
    return {inside:boxes.every(box=>box.left>=bounds.left-1 && box.right<=bounds.right+1),overlap:boxes.some((a,i)=>boxes.some((b,j)=>i<j && a.left<b.right && a.right>b.left && a.top<b.bottom && a.bottom>b.top))};
   });
   assert(layout.inside && !layout.overlap,'control overlap or overflow at '+width);
   await filters.getByLabel('Size',{exact:true}).focus();
   await page.keyboard.press('Tab');
   assert(await filters.evaluate(el=>el.contains(document.activeElement)),'keyboard focus inaccessible');
  }
  assert.equal(await filters.locator('.product-filter-panel').isVisible(),true);
  assert(await filters.evaluate(el=>el.scrollWidth<=el.clientWidth),'filter overflow');
  await filters.getByLabel('Size',{exact:true}).selectOption('S');
  await page.keyboard.press('Escape');
  assert.equal(await filters.locator('.product-filter-panel').isVisible(),false);
  console.log('PASS '+file);
  await page.setViewportSize({width:1280,height:900});
 }
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
