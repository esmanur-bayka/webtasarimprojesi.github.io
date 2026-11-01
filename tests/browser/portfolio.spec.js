import {test,expect} from '@playwright/test';
for(const width of [360,390,575,768,896,1024,1280]){
 test(`approved portfolio at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator('.certificate-entry')).toHaveCount(15);
  await expect(page.locator('.publication-list a')).toHaveCount(7);
 });
}
test('homepage hero stays balanced across mobile and tablet widths',async({page})=>{
 for(const width of [360,390,575,768,896]){
  await page.setViewportSize({width,height:900});await page.goto('/');
  const hero=page.locator('#home'),image=hero.locator('.home-img img'),intro=hero.locator('.home-intro');
  await expect(hero.getByRole('heading',{level:1})).toBeVisible();
  expect(await image.evaluate(element=>element.getBoundingClientRect().width)).toBeLessThanOrEqual(Math.min(width*.65,320));
  expect(await hero.getByRole('heading',{level:1}).evaluate(element=>parseFloat(getComputedStyle(element).fontSize))).toBeLessThanOrEqual(56);
  expect(await intro.evaluate(element=>parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
  expect(await hero.evaluate(element=>element.getBoundingClientRect().height)).toBeLessThan(1200);
  await expect(hero.getByRole('link',{name:'CV’mi incele'})).toBeVisible();
  await expect(hero.getByRole('link',{name:'İletişime geç'})).toBeVisible();
 }
});
test('mobile navigation opens with keyboard and closes with Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const menu=page.locator('#menu-icon');await menu.focus();await page.keyboard.press('Enter');
 await expect(menu).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');
 await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();
});
test('certificate filters preserve document links',async({page})=>{
 await page.goto('/#certificates');
 await expect(page.getByRole('status')).toHaveText('15 belge gösteriliyor');
 await page.getByRole('button',{name:'Etkinlik katılımları',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('5 belge gösteriliyor');
 await page.getByRole('button',{name:'Eğitimler ve rozetler',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('10 belge gösteriliyor');
 await expect(page.locator('a[href="certificates/b2-ingilizce.pdf"]').first()).toBeVisible();
 const pdf=await page.request.get('/certificates/b2-ingilizce.pdf');expect(pdf.status()).toBe(200);
});

test('technology cards keep their text readable when hovered or clicked',async({page})=>{
 await page.goto('/#services');
 const card=page.locator('.service-box').first();
 await card.hover();
 await expect(card).toHaveCSS('background-color','rgb(255, 255, 255)');
 await expect(card.locator('h3')).toHaveCSS('color','rgb(17, 17, 17)');
 for(const paragraph of await card.locator('p').all()){
  await expect(paragraph).toHaveCSS('color','rgb(17, 17, 17)');
 }
 await page.mouse.down();
 await expect(card.locator('p').last()).toHaveCSS('color','rgb(17, 17, 17)');
 await page.mouse.up();
});

test('CV content, responsive layout and print action are available',async({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.addInitScript(()=>{window.print=()=>{window.printWasCalled=true}});
 await page.goto('/cv.html');
 await expect(page.getByRole('heading',{name:'Esmanur Bayka'})).toBeVisible();
 await expect(page.getByText('Web Tasarımı ve Kodlama öğrencisi · 2. sınıf')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 await page.getByRole('button',{name:'Yazdır / PDF olarak kaydet'}).click();
 expect(await page.evaluate(()=>window.printWasCalled)).toBe(true);
});

test('skip link reaches main and section navigation reports current location',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'Ana içeriğe geç'})).toBeFocused();
 await page.keyboard.press('Enter');await expect(page.locator('main')).toBeFocused();
 await page.locator('#projects').scrollIntoViewIfNeeded();
 await expect(page.locator('.navbar a[aria-current="location"]')).toHaveAttribute('href','#projects');
 await expect(page.locator('.navbar a[aria-current]')).toHaveCount(1);
});
