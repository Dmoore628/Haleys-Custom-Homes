import { test, expect } from './fixtures';

test('about awards: four jumbo marks alternating sides, a quarter of the section each', async ({
  page,
  isMobile,
}) => {
  await page.goto('/about');
  const rows = page.getByTestId('award-row');
  await expect(rows).toHaveCount(4);
  const sides = await rows.evaluateAll((els) => els.map((e) => e.getAttribute('data-side')));
  expect(sides).toEqual(['left', 'right', 'left', 'right']);
  test.skip(isMobile, 'phones stack and center');
  const section = (await page.locator('section:has(#awards-heading) ul').first().boundingBox())!;
  for (let i = 0; i < 4; i++) {
    const row = rows.nth(i);
    await row.scrollIntoViewIfNeeded();
    const rb = (await row.boundingBox())!;
    expect(Math.abs(rb.height - section.height / 4)).toBeLessThan(4);
    const mark = (await row.locator('img').boundingBox())!;
    expect(mark.height).toBeGreaterThan(90);
    if (i % 2 === 0) expect(mark.x - section.x).toBeLessThan(4);
    else expect(section.x + section.width - (mark.x + mark.width)).toBeLessThan(4);
  }
});
