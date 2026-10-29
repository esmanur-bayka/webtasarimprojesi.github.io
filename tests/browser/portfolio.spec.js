import { test, expect } from '@playwright/test';

for (const width of [375, 768, 1280]) {
  test(`layout ${width}px: no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Üreterek öğreniyorum.' })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('mobile menu is keyboard accessible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page.locator('#menu-toggle');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await page.keyboard.press('Space');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('navigation', { name: 'Ana menü' }).getByRole('link', { name: 'Projeler' }).click();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(page).toHaveURL(/#projects$/);
});

test('project case studies and links are usable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.locator('article.project-card')).toHaveCount(2);
  await page.getByText('Projenin teknik ayrıntıları').click();
  await expect(page.getByText(/localStorage alanında tutuluyor/)).toBeVisible();
});

test('contact form validates before WhatsApp draft', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /WhatsApp'ta mesajı hazırla/ }).click();
  expect(await page.locator('#contact-name').evaluate(el => el.validity.valid)).toBe(false);
  await page.locator('#contact-name').fill('Test Kullanıcı');
  await page.locator('#contact-message').fill('Merhaba, portföy hakkında görüşmek istiyorum.');
  await page.getByRole('button', { name: /WhatsApp'ta mesajı hazırla/ }).click();
  await expect(page.getByRole('status')).toContainText('Mesaj ancak siz gönderirseniz iletilir.');
});
