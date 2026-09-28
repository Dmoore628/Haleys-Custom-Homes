import { test, expect } from './fixtures';

for (const route of ['/', '/process']) {
  test(`punch list on ${route}: closes stages 1-5 in turn and leaves Move-In open`, async ({
    page,
  }) => {
    await page.goto(route);
    const list = page.getByTestId('punch-list');
    const rows = list.getByTestId('punch-row');
    await expect(rows).toHaveCount(6);
    await expect(rows.first()).toHaveAttribute('data-status', 'open');
    await list.scrollIntoViewIfNeeded();
    for (let i = 0; i < 5; i++) {
      await expect(rows.nth(i)).toHaveAttribute('data-status', 'closed');
    }
    await expect(rows.last()).toHaveAttribute('data-status', 'open');
    await expect(rows.last().getByText('Open', { exact: true })).toBeVisible();
    await expect(list.getByRole('link', { name: /Start the Conversation/ })).toBeVisible();
    await expect(list.locator('[aria-live]')).toContainText('05');
  });

  test(`move-in timeline on ${route}: works through the build schedule to move-in`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    await page.goto(route);
    const timeline = page.getByTestId('move-in-timeline');
    await timeline.scrollIntoViewIfNeeded();
    const visible = (text: string) =>
      timeline.getByText(text, { exact: true }).filter({ visible: true });
    await expect(visible('An illustrative build schedule')).toBeVisible();
    await expect(visible('Permit applied for')).toBeVisible();
    // The calendar, not the punch list again: none of the six stage names repeat here.
    for (const stage of [
      'Design and Spec Lock',
      'Pre-Construction Sequencing',
      'Trade Sequencing',
      'Finish Work',
    ]) {
      await expect(timeline.getByText(stage)).toHaveCount(0);
    }
    await expect(timeline).toHaveAttribute('data-arrived', 'false');
    await expect(timeline).toHaveAttribute('data-arrived', 'true', { timeout: 25000 });
    await expect(visible('Moved in')).toBeVisible();
    // No scheduled-date marker or one-month-early bracket: the quote carries that.
    await expect(timeline.getByText(/One month early|Scheduled move-in/)).toHaveCount(0);
    await expect(timeline.getByText(/a month earlier than scheduled/)).toBeVisible();
    await expect(page.getByText('Yes, that is correct.')).toHaveCount(0);
  });
}

test('reduced motion: the punch list and timeline render finished', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/process');
  const rows = page.getByTestId('punch-row');
  await expect(rows.nth(4)).toHaveAttribute('data-status', 'closed');
  await expect(rows.last()).toHaveAttribute('data-status', 'open');
  await expect(page.getByTestId('move-in-timeline')).toHaveAttribute('data-arrived', 'true');
});

test('process hero: the elevation draws through all six stages, then rests lit', async ({
  page,
}) => {
  test.setTimeout(45000);
  await page.goto('/process');
  const hero = page.getByTestId('process-hero');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('A Build That Moves in Order');
  await expect(hero.getByRole('img', { name: /architectural elevation/ })).toBeVisible();
  const drawing = hero.locator('[data-done]');
  await expect(drawing).toHaveAttribute('data-done', 'true', { timeout: 20000 });
  // Just the house: no stage ticker beneath it.
  await expect(hero.getByText('Move-In', { exact: true })).toHaveCount(0);
  await expect(page.getByTestId('accent-framing-square')).toHaveCount(0);
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
