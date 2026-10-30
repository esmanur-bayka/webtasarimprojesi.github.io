import { test, expect } from "@playwright/test";
for (const width of [375, 768, 1280]) {
  test("layout " + width + "px: no horizontal overflow and key sections visible", async ({page}) => {
    await page.setViewportSize({width, height:900});
    await page.goto("/");
    await expect(page.getByRole("heading", {level:1})).toBeVisible();
    await expect(page.getByRole("heading", {name:/Gerçek Projelerim/})).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
test("Mobile menu supports keyboard, Escape and link closing", async ({page}) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto("/");
  const menu=page.getByRole("button",{name:"Menüyü aç"});
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded","true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded","false");
  await expect(menu).toBeFocused();
  await page.keyboard.press("Space");
  await expect(menu).toHaveAttribute("aria-expanded","true");
  await page.getByRole("navigation",{name:"Ana menü"}).getByRole("link",{name:"Projeler"}).click();
  await expect(menu).toHaveAttribute("aria-expanded","false");
  await expect(page).toHaveURL(/#projects$/);
});
test("Projects and links have real targets, no fake CV", async ({page}) => {
  await page.goto("/");
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.locator("#projects article")).toHaveCount(2);
  await expect(page.getByRole("link",{name:"CV"})).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Projelerimi Gör"})).toHaveAttribute("href","#projects");
});
test("Contact form validates and produces user-approved WhatsApp draft", async ({page}) => {
  await page.addInitScript(() => {
    window.__whatsAppDraft = null;
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.href.startsWith("https://wa.me/")) {window.__whatsAppDraft=this.href;return;}
      return click.call(this);
    };
  });
  await page.goto("/");
  await page.getByRole("button",{name:"WhatsApp'ta mesajı hazırla"}).click();
  expect(await page.locator("#contact-name").evaluate(el=>el.validity.valid)).toBe(false);
  await page.locator("#contact-name").fill("Test Kullanıcı");
  await page.locator("#contact-message").fill("Merhaba, portföy hakkında görüşmek istiyorum.");
  await page.getByRole("button",{name:"WhatsApp'ta mesajı hazırla"}).click();
  await expect(page.getByRole("status")).toContainText("Mesaj ancak siz gönderirseniz iletilir");
  const draft=await page.evaluate(()=>window.__whatsAppDraft);
  expect(draft).toContain("wa.me/905467710162?text=");
  expect(decodeURIComponent(draft)).toContain("Test Kullanıcı");
});
