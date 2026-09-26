import { test, expect } from './fixtures';

/** The in-house SVG service map: Home (after the hero) and Contact. */
for (const route of ['/', '/contact']) {
  test(`service map on ${route}: draws, names every place, responds to the legend`, async ({
    page,
  }) => {
    const mapRequests: string[] = [];
    page.on('request', (r) => {
      if (/mapbox|tiles|googleapis\.com\/maps/i.test(r.url())) mapRequests.push(r.url());
    });
    await page.goto(route);
    const map = page.getByTestId('service-map');
    await map.scrollIntoViewIfNeeded();
    await expect(map.getByRole('img', { name: /Map of Colorado/ })).toBeVisible();
    await expect(map.getByRole('heading', { name: 'Where We Build' })).toBeVisible();

    // Every service area from the site config is named in the legend.
    const legend = map.locator('ul').first();
    for (const name of [
      'Denver Metro',
      'Denver',
      'Cherry Hills Village',
      'Greenwood Village',
      'Centennial',
      'Boulder',
      'Vail',
      'Aspen',
    ]) {
      await expect(legend.getByRole('button', { name, exact: true })).toBeVisible();
    }

    // Defaults to the office; focusing a place shows its coordinates.
    const readout = map.getByTestId('map-readout');
    await expect(readout).toContainText('39.62° N');
    await legend.getByRole('button', { name: 'Aspen', exact: true }).focus();
    await expect(readout).toContainText('39.19° N');
    await expect(readout).toContainText('106.82° W');
    expect(mapRequests).toEqual([]);
  });
}

test('positioning section: statement and reviews beside the map', async ({ page }) => {
  await page.goto('/');
  const section = page.locator('section[aria-labelledby="positioning-heading"]');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('heading', { level: 2 })).toHaveAccessibleName(
    /We build three to five homes a year/,
  );
  await expect(section.getByTestId('houzz-reviews')).toBeVisible();
  await expect(section.getByTestId('service-map')).toBeVisible();
});
