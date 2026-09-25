import { test, expect } from './fixtures';

test('comparison slider: drag on desktop, tap-to-toggle on mobile', async ({ page, isMobile }) => {
  await page.goto('/process');
  if (isMobile) {
    const toggle = page.getByTestId('comparison-toggle');
    await toggle.scrollIntoViewIfNeeded();
    const haley = toggle.getByRole('button', { name: "Haley's Process", exact: true });
    await expect(haley).toHaveAttribute('aria-pressed', 'false');
    await haley.click();
    await expect(haley).toHaveAttribute('aria-pressed', 'true');
    return;
  }
  const handle = page.getByTestId('slider-handle');
  await handle.scrollIntoViewIfNeeded();
  await expect(handle).toHaveAttribute('aria-valuenow', '50');
  const track = await page.getByTestId('comparison-slider').boundingBox();
  const h = await handle.boundingBox();
  if (!track || !h) throw new Error('slider not laid out');
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(track.x + track.width * 0.8, h.y + h.height / 2, { steps: 8 });
  await page.mouse.up();
  expect(Number(await handle.getAttribute('aria-valuenow'))).toBeGreaterThan(70);
  await handle.focus();
  await page.keyboard.press('Home');
  await expect(handle).toHaveAttribute('aria-valuenow', '0');
});

test('progress rail markers fill as the phases scroll past', async ({ page }) => {
  await page.goto('/process');
  const markers = page.getByTestId('rail-marker');
  await expect(markers).toHaveCount(6);
  await expect(markers.last()).toHaveAttribute('data-passed', 'false');
  await page
    .getByTestId('phase-sequence')
    .evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().bottom + window.scrollY));
  await expect(markers.last()).toHaveAttribute('data-passed', 'true');
});
