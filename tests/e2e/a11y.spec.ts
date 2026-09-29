import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

const ROUTES = [
  '/',
  '/portfolio',
  '/portfolio/curated-house',
  '/process',
  '/eco-building',
  '/about',
  '/contact',
  '/builder20',
  '/client-portal',
  '/missing-page',
];

for (const route of ROUTES) {
  test(`no WCAG 2.1 AA violations on ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route);
    // Scroll through so every one-time reveal has played before the audit.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .exclude('nextjs-portal') // Next.js dev overlay, absent in production
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
    );
    expect(summary).toEqual([]);
  });
}

test('reduced motion: marquees stop and render as a static row', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.marquee-track').first()).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.marquee-duplicate').first()).toBeHidden();
});
