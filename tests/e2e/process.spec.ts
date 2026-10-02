import { test, expect } from './fixtures';

for (const route of ['/', '/process']) {
  test(`build timeline on ${route}: scrubbing closes stages 1-5 in turn, Move-In stays open, and scrubbing back reopens them`, async ({
    page,
  }) => {
    await page.goto(route);
    const timeline = page.getByTestId('build-timeline');
    const stages = timeline.getByTestId('build-stage');
    await expect(stages).toHaveCount(6);
    // Every stage, framed as Haley's commitment (no "typical build" risks), and the milestones.
    await expect(timeline.getByText(/typical build risks/)).toHaveCount(0);
    await expect(
      timeline.getByText(/We ensure there are no surprise mid.build changes to layout or finishes/),
    ).toHaveCount(1);
    for (const name of [
      'Design and Spec Lock',
      'Pre-Construction Sequencing',
      'Framing',
      'Trade Sequencing',
      'Finish Work',
      'Move-In',
    ]) {
      await expect(timeline.getByRole('heading', { level: 3, name: new RegExp(name) })).toHaveCount(
        1,
      );
    }
    await expect(timeline.getByText('Permit applied for')).toHaveCount(1);
    await expect(timeline.getByText('Keys handed over')).toHaveCount(1);
    await expect(stages.first()).toHaveAttribute('data-status', 'open');

    const scrubTo = (el: import('@playwright/test').Locator) =>
      el.evaluate((node) => {
        const r = node.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + r.bottom - window.innerHeight * 0.6 + 4);
      });
    // Scrub to the end of Framing: stages 1 to 3 closed, 4 still open.
    await scrubTo(stages.nth(2).getByText('Framing inspected'));
    await expect(stages.nth(2)).toHaveAttribute('data-status', 'closed');
    await expect(stages.nth(3)).toHaveAttribute('data-status', 'open');
    // Scrub back up: they reopen.
    await scrubTo(stages.first().getByText('Plans and finishes locked'));
    await expect(stages.nth(2)).toHaveAttribute('data-status', 'open');
    // Scrub to move-in: five closed, Move-In open, with the way to close it and the quote.
    await scrubTo(stages.last().getByText('Keys handed over'));
    await expect(timeline).toHaveAttribute('data-arrived', 'true');
    for (let i = 0; i < 5; i++)
      await expect(stages.nth(i)).toHaveAttribute('data-status', 'closed');
    await expect(stages.last()).toHaveAttribute('data-status', 'open');
    await expect(timeline.getByRole('link', { name: /Start the Conversation/ })).toBeVisible();
    await expect(timeline.getByText(/a month earlier than scheduled/)).toBeVisible();
  });
}

test('reduced motion: the build timeline renders finished', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/process');
  const stages = page.getByTestId('build-stage');
  await expect(stages.nth(4)).toHaveAttribute('data-status', 'closed');
  await expect(stages.last()).toHaveAttribute('data-status', 'open');
  await expect(page.getByTestId('build-timeline')).toHaveAttribute('data-arrived', 'true');
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
});
