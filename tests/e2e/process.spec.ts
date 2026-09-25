import { test, expect } from './fixtures';

test('sequencing ledger checks rows one at a time as they scroll up, and never resets', async ({
  page,
}) => {
  await page.goto('/process');
  const rows = page.getByTestId('sequencing-ledger').getByTestId('ledger-row');
  await expect(rows).toHaveCount(6);
  await expect(rows.first()).toHaveAttribute('data-checked', 'false');
  await expect(rows.last()).toHaveAttribute('data-checked', 'false');

  // Bring row 1 above the 60%-up line; later rows stay unchecked.
  await rows.first().evaluate((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - window.innerHeight * 0.3);
  });
  await expect(rows.first()).toHaveAttribute('data-checked', 'true');
  await expect(rows.last()).toHaveAttribute('data-checked', 'false');

  await rows.last().evaluate((el) => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top - window.innerHeight * 0.3);
  });
  await expect(rows.last()).toHaveAttribute('data-checked', 'true');
  // The Early Move-In Marker plays once it scrolls into view; the old caption line is gone.
  const marker = page.getByTestId('early-move-in');
  await marker.scrollIntoViewIfNeeded();
  await expect(marker).toHaveAttribute('data-played', 'true');
  await expect(page.getByText('Yes, that is correct.')).toBeVisible();

  // Scrolling back to the top does not un-check anything.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(rows.first()).toHaveAttribute('data-checked', 'true');
});

test('reduced motion: every ledger row renders already checked', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const rows = page.getByTestId('ledger-row');
  await expect(rows).toHaveCount(6);
  for (let i = 0; i < 6; i++) await expect(rows.nth(i)).toHaveAttribute('data-checked', 'true');
});

test('framing square accent animates once, on first view', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop-only accent');
  await page.goto('/process');
  const square = page.getByTestId('accent-framing-square');
  await expect(square).toBeVisible();
  await expect(square).toHaveAttribute('data-played', 'true');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(square).toHaveAttribute('data-played', 'true');
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
