import { test, expect } from './fixtures';

test('desktop nav shows all links and the CTA; mobile uses the Menu overlay', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const primary = page.getByRole('navigation', { name: 'Primary' });
  if (!isMobile) {
    for (const label of ['Portfolio', 'Process', 'About', 'Contact']) {
      await expect(primary.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
    await expect(primary.getByRole('link', { name: 'Start the Conversation' })).toBeVisible();
    return;
  }
  await page.getByRole('button', { name: 'Menu' }).click();
  const dialog = page.getByRole('dialog', { name: 'Site menu' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Exit' })).toBeFocused();
  await expect(dialog.getByRole('link', { name: 'Start the Conversation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Process' }).click();
  await expect(page).toHaveURL(/\/process$/);
});

test('nav gains the bone background after 80px of scroll', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header');
  await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(header).toHaveCSS('background-color', 'rgb(239, 233, 222)');
});

test('skip link is the first focusable element', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard flow');
  await page.goto('/about');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test('unknown routes render the designed 404 with a way back', async ({ page }) => {
  const res = await page.goto('/this-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByText('PAGE NOT FOUND')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to Home' })).toBeVisible();
});

test.describe('cookie notice', () => {
  test.use({ keepCookieNotice: true });
  test('appears once and dismisses permanently', async ({ page }) => {
    await page.goto('/');
    const notice = page.getByRole('region', { name: 'Cookie notice' });
    await expect(notice).toBeVisible();
    await notice.getByRole('button', { name: 'Got It' }).click();
    await expect(notice).toBeHidden();
    await page.reload();
    await expect(page.getByRole('region', { name: 'Cookie notice' })).toBeHidden();
  });
});
