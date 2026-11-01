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
test('mobile navigation opens with keyboard and closes with Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const menu=page.locator('#menu-icon');await menu.focus();await page.keyboard.press('Enter');
 await expect(menu).toHaveAttribute('aria-expanded','true');await page.keyboard.press('Escape');
 await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();
});
test('certificate filters preserve document links',async({page})=>{
 await page.goto('/#certificates');
 await page.getByRole('button',{name:'Etkinlik katılımları',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('5 belge gösteriliyor');
 await page.getByRole('button',{name:'Eğitim ve rozetler',exact:true}).click();
 await expect(page.getByRole('status')).toHaveText('10 belge gösteriliyor');
 await expect(page.locator('a[href="certificates/b2-ingilizce.pdf"]').first()).toBeVisible();
 const pdf=await page.request.get('/certificates/b2-ingilizce.pdf');expect(pdf.status()).toBe(200);
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
