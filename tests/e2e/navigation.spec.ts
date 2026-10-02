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

test('nav gains the white background after 80px of scroll', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('header');
  await expect(header).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(header).toHaveCSS('background-color', 'rgb(255, 255, 255)');
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

test('no tracking: visitors get no cookies, so no cookie banner', async ({ page, context }) => {
  await page.goto('/');
  await page.goto('/contact');
  expect(await context.cookies()).toEqual([]);
  await expect(page.getByRole('region', { name: /cookie/i })).toHaveCount(0);
});

test('legal pages: linked from every footer and from the contact form', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form').getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
    'href',
    '/privacy',
  );
  for (const [name, heading] of [
    ['Privacy', 'Privacy Policy'],
    ['Terms', 'Terms of Use'],
    ['Accessibility', 'Accessibility'],
  ]) {
    await page.locator('footer').getByRole('link', { name, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.getByText(/^Effective /)).toBeVisible();
    // Tokens are filled from the site's business facts.
    await expect(page.getByTestId('legal-page')).not.toContainText('{');
  }
});

test('link previews: every page has a full share card; home adds the hero video', async ({
  page,
  request,
}) => {
  const meta = (p: string) => page.locator(`meta[property="${p}"]`).first().getAttribute('content');
  await page.goto('/');
  expect(await meta('og:site_name')).toBe('Haley Custom Homes');
  const image = (await meta('og:image'))!;
  const video = (await meta('og:video'))!;
  // Absolute URLs on the address the site is served from, and both files exist.
  expect(image).toMatch(/^https?:\/\/[^/]+\/og\/home\.jpg$/);
  expect(video).toMatch(/^https?:\/\/[^/]+\/video\/og-hero\.mp4$/);
  expect(new URL(image).host).toBe(new URL(page.url()).host);
  for (const url of [image, video]) {
    expect((await request.get(new URL(url).pathname)).status()).toBe(200);
  }
  expect(await meta('og:video:type')).toBe('video/mp4');
  for (const [route, card] of [
    ['/builder20', '/og/builder20.jpg'],
    ['/process', '/og/process.jpg'],
    ['/privacy', '/og/home.jpg'],
  ]) {
    await page.goto(route);
    expect(await meta('og:site_name')).toBe('Haley Custom Homes');
    expect(await meta('og:image')).toContain(card);
  }
});
