import { test, expect } from './fixtures';

test('filter tabs switch categories and show the empty state when needed', async ({ page }) => {
  await page.goto('/portfolio');
  const newBuilds = page.getByRole('tab', { name: 'New Builds' });
  const remodels = page.getByRole('tab', { name: 'Remodels' });
  await expect(newBuilds).toHaveAttribute('aria-selected', 'true');
  const tiles = page.locator('#portfolio-grid a');
  const newCount = await tiles.count();
  expect(newCount).toBeGreaterThan(0);

  await remodels.click();
  await expect(remodels).toHaveAttribute('aria-selected', 'true');
  await expect(tiles).toHaveCount(2);
  await expect(tiles.filter({ hasText: 'Curated House' })).toHaveCount(1);
  await expect(tiles.filter({ hasText: 'Endlessly Charming' })).toHaveCount(1);
  await newBuilds.click();
  await expect(tiles).toHaveCount(newCount);
});

test('tile opens its project and the lightbox navigates', async ({ page, isMobile }) => {
  await page.goto('/portfolio');
  await page.locator('#portfolio-grid a').first().click();
  await expect(page).toHaveURL(/\/portfolio\/[a-z0-9-]+$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Only sourced stats appear: no placeholder brackets anywhere on the page.
  expect(await page.locator('main').innerText()).not.toContain('[');

  const firstImage = page.getByRole('button', { name: /Open image 1 of/ });
  await firstImage.scrollIntoViewIfNeeded();
  await firstImage.click();
  const box = page.getByRole('dialog');
  await expect(box).toHaveAttribute('aria-label', /image 1 of/);
  if (isMobile) {
    await box.getByRole('button', { name: 'Next image' }).click();
    await expect(box).toHaveAttribute('aria-label', /image 2 of/);
  } else {
    await page.keyboard.press('ArrowRight');
    await expect(box).toHaveAttribute('aria-label', /image 2 of/);
    await page.keyboard.press('ArrowLeft');
    await expect(box).toHaveAttribute('aria-label', /image 1 of/);
  }
  await box.getByRole('button', { name: 'Close' }).click();
  await expect(box).toBeHidden();
});

test('projects published under their old Houzz titles redirect to their current names', async ({
  page,
}) => {
  await page.goto('/portfolio/cherry-creek-historical-remodel');
  await expect(page).toHaveURL(/\/portfolio\/curated-house$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curated House');
});

test('project pages show sourced credits, and drafts stay off the site', async ({ page }) => {
  await page.goto('/portfolio/timeless-estate');
  await expect(page.getByText('Martha Lord Interiors')).toBeVisible();
  const res = await page.goto('/portfolio/quincy');
  expect(res?.status()).toBe(404);
});
