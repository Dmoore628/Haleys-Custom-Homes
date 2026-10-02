import { test, expect } from './fixtures';

test('process sequence: each phase has its months, Haley\u2019s work and its milestones', async ({
  page,
}) => {
  await page.goto('/process');
  // One sequence on the page: the separate timeline is gone.
  await expect(page.getByTestId('build-timeline')).toHaveCount(0);
  const phases = page.getByTestId('phase');
  await expect(phases).toHaveCount(6);
  await expect(phases.first()).toContainText('Month 1');
  await expect(phases.first()).toContainText('Permit applied for');
  await expect(phases.first()).toContainText(/nothing changes mid-build/);
  // Months appear once per phase, as its subheading.
  for (let i = 0; i < 6; i++) {
    const text = (await phases.nth(i).innerText()).replace(/\s+/g, ' ');
    expect(text.match(/Months? \d/gi)?.length ?? 0, `phase ${i + 1}`).toBe(1);
  }
  await expect(phases.nth(2)).toContainText('Months 3\u20136');
  await expect(phases.nth(2).getByTestId('milestones').locator('li')).toHaveCount(3);
  await expect(page.getByText(/typical build risks/)).toHaveCount(0);
  const moveIn = phases.last();
  await expect(moveIn).toContainText('Month 14');
  await expect(moveIn).toContainText('Keys handed over');
  await expect(moveIn.getByRole('link', { name: /Start the Conversation/ })).toBeVisible();
  await expect(page.getByText(/a month earlier than scheduled/)).toBeAttached();
  await expect(page.getByText(/illustrative schedule/)).toBeAttached();
});

test('home: the timeline is replaced by a transition to the Process page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('build-timeline')).toHaveCount(0);
  const teaser = page.getByTestId('process-teaser');
  await expect(teaser.getByRole('heading', { level: 2 })).toHaveText('A Build That Moves in Order');
  await expect(teaser.locator('ol li')).toHaveCount(6);
  await teaser.getByRole('link', { name: 'See the Process' }).click();
  await expect(page).toHaveURL(/\/process$/);
});

test('reduced motion: the rail shows phases 1-5 ticked and Move-In open', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/process');
  const markers = page.getByTestId('rail-marker');
  await expect(markers).toHaveCount(6);
  await expect(markers.nth(4)).toHaveAttribute('data-status', 'closed');
  await expect(markers.last()).toHaveAttribute('data-status', 'open');
});

test('process hero: a Haley home on film fills the screen, headline over it; no repeat below', async ({
  page,
}) => {
  await page.goto('/process');
  const hero = page.getByTestId('process-hero');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText('A Build That Moves in Order');
  const vp = page.viewportSize()!;
  const box = (await hero.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(vp.height - 1);
  const video = hero.locator('video');
  await expect(video).toHaveAttribute('src', '/video/cta-flyover.mp4');
  await expect(video).toHaveCSS('object-fit', 'cover');
  // The drawn elevation is gone, and the flyover appears once on the page.
  await expect(hero.locator('svg')).toHaveCount(0);
  await expect(
    page.locator('video[src="/video/cta-flyover.mp4"], video[poster*="cta-twilight"]'),
  ).toHaveCount(1);
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
  // Passed phases tick off like a punch list; Move-In stays open.
  await expect(markers.first()).toHaveAttribute('data-status', 'closed');
  await expect(markers.last()).toHaveAttribute('data-status', 'open');
});
