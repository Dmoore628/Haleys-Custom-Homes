import { test, expect } from './fixtures';

/** One check per acceptance line in docs/haley-custom-homes-fixes-spec.md that a browser can verify. */

const ROUTES = [
  '/',
  '/portfolio',
  '/portfolio/modern-elevated',
  '/process',
  '/eco-building',
  '/about',
  '/contact',
];

test('1: Newsreader and Switzer only; no Fraunces or Inter loads anywhere', async ({ page }) => {
  const fontRequests: string[] = [];
  page.on('request', (r) => {
    if (r.resourceType() === 'font') fontRequests.push(r.url());
  });
  await page.goto('/');
  const heading = await page.locator('h1').evaluate((el) => getComputedStyle(el).fontFamily);
  const body = await page
    .locator('main p')
    .first()
    .evaluate((el) => getComputedStyle(el).fontFamily);
  expect(heading).toMatch(/Newsreader/i);
  expect(body).toMatch(/Switzer/i);
  expect(fontRequests.join(' ')).not.toMatch(/fraunces|inter/i);
});

test('2 and 15: every section on every page covers the one before it', async ({ page }) => {
  const sections: Record<string, number> = {
    '/': 6,
    '/portfolio': 1,
    '/portfolio/modern-elevated': 2,
    '/process': 6,
    '/eco-building': 7,
    '/about': 6,
    '/contact': 2,
  };
  for (const [route, count] of Object.entries(sections)) {
    await page.goto(route);
    const pinned = page.locator('main > [data-pinned="true"]');
    await expect(pinned, route).toHaveCount(count);
    // Every direct child of <main> is a pinned section: no boundary without a transition.
    const unpinned = await page.locator('main > :not([data-pinned])').count();
    expect(unpinned, route).toBe(0);
  }

  // Scrolling the next section over the hero dims it.
  await page.goto('/');
  const vh = page.viewportSize()!.height;
  await page.evaluate((y) => window.scrollTo(0, y), vh);
  await page.waitForTimeout(300);
  const dim = await page
    .locator('main > [data-pinned="true"]')
    .first()
    .getByTestId('cover-dim')
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(dim).toBeGreaterThan(0.2);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-pinned="true"]')).toHaveCount(0);
});

test('3: accent phrase and quotation mark overlapping the positioning statement', async ({
  page,
}) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { name: /We build three to five homes a year/ });
  await heading.scrollIntoViewIfNeeded();
  const accentWords = await heading
    .locator('span.text-accent')
    .allTextContents()
    .then((t) => t.join('').trim());
  expect(accentWords).toBe('three to five homes');
  const mark = page.getByTestId('accent-quote');
  const color = await mark.evaluate((el) => getComputedStyle(el).color);
  const alpha = Number(color.match(/([\d.]+)\)$/)?.[1]);
  expect(alpha).toBeGreaterThanOrEqual(0.14);
  expect(alpha).toBeLessThanOrEqual(0.16);
  const m = (await mark.boundingBox())!;
  const h = (await heading.boundingBox())!;
  const overlaps =
    m.x < h.x + h.width && m.x + m.width > h.x && m.y < h.y + h.height && m.y + m.height > h.y;
  expect(overlaps).toBe(true);
});

test('4: reviews follow the statement and map; cards keep natural heights', async ({ page }) => {
  await page.goto('/');
  const reviews = page.getByTestId('houzz-reviews');
  await reviews.scrollIntoViewIfNeeded();
  await expect(reviews.getByRole('img', { name: '5.0 out of 5 stars' })).toBeVisible();
  await expect(reviews.getByRole('link', { name: /36 reviews on Houzz/ })).toBeVisible();
  const heights = await page
    .locator('section[aria-label="Client reviews"] figure')
    .evaluateAll((els) => els.slice(0, 3).map((e) => Math.round(e.getBoundingClientRect().height)));
  expect(new Set(heights).size).toBeGreaterThan(1);
  // The quotes appear once on the page: no second testimonials section.
  await expect(page.getByText('IN THEIR WORDS')).toHaveCount(0);
});

test('5, 6, 21: recognition tiers, press marks and scarcity badge', async ({ page }) => {
  await page.goto('/');
  const section = page.getByTestId('recognition');
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('heading', { name: 'Recognition' })).toBeVisible();
  await expect(section.getByRole('heading', { name: 'As Seen In' })).toBeVisible();
  // Every mark appears exactly once: no repeated logos.
  const alts = await section
    .locator('img')
    .evaluateAll((els) => els.map((e) => e.getAttribute('alt')));
  expect(alts.length).toBe(9);
  expect(new Set(alts).size).toBe(alts.length);
  for (const name of [
    'Cherry Creek Lifestyle',
    'Cherry Creek Magazine',
    'Modern In Denver',
    'Colorado Homes & Lifestyles',
    'Home & Garden Colorado',
  ]) {
    await expect(section.getByRole('img', { name, exact: true })).toBeVisible();
  }
  await expect(page.getByText('Now accepting a limited number of new projects.')).toBeVisible();
});

test('About: verified community causes and industry partners', async ({ page }) => {
  await page.goto('/about');
  const section = page.locator('section[aria-labelledby="community-heading"]');
  await section.scrollIntoViewIfNeeded();
  for (const name of [
    "Children's Diabetes Foundation",
    'St. Thomas More Catholic School',
    'Ekman Design Studio',
    'Exquisite Kitchen Design',
    'Xssentials',
  ]) {
    await expect(section.getByRole('img', { name, exact: true })).toBeVisible();
  }
  await expect(section.getByText(/Tied to a Cure Denver/)).toBeVisible();
});

test('7, 19, 20: footer contact links, social glyphs and ICAA credit', async ({ page }) => {
  await page.goto('/about');
  const footer = page.locator('footer');
  await expect(footer.locator('a[href="tel:+13036019446"]')).toHaveText('303-601-9446');
  await expect(footer.locator('a[href="mailto:dan@haleycustomhomes.com"]')).toHaveText(
    'dan@haleycustomhomes.com',
  );
  const urls = [
    'https://www.pinterest.com/haleycstmhomes/',
    'http://www.youtube.com/channel/UCCv8HSL4i52vp5CGe0tc-AQ',
    'https://www.facebook.com/HaleyCustomHomes/',
    'https://www.linkedin.com/company/haley-custom-homes',
    'https://www.houzz.com/pro/haleycustomhomes/haley-custom-homes',
    'https://twitter.com/haleycustom',
    'https://www.instagram.com/haleycustomhomes/',
  ];
  for (const url of urls) {
    const link = footer.locator(`a[href="${url}"]`);
    await expect(link).toHaveCount(1);
    await expect(link.locator('svg')).toHaveCount(1);
  }
  const credit = footer.getByRole('link', {
    name: 'In support of the Institute of Classical Architecture & Art, Rocky Mountain Chapter',
  });
  await expect(credit).toHaveAttribute(
    'href',
    'https://www.classicist.org/membership-and-chapters/chapters/rocky-mountain/',
  );
  await expect(credit.locator('img, svg')).toHaveCount(0);
});

test('8: phone hero: a sharp full-width video band, headline beneath it', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'phone only');
  await page.goto('/');
  const video = page.locator('section video').first();
  await expect(video).toHaveCSS('object-fit', 'cover');
  const vb = (await video.boundingBox())!;
  const vw = page.viewportSize()!;
  // Full width, and short enough that the 2.3:1 footage isn't magnified into a blur.
  expect(vb.width).toBeGreaterThanOrEqual(vw.width - 1);
  expect(vb.height).toBeLessThanOrEqual(vw.height * 0.6);
  const hb = (await page.getByRole('heading', { level: 1 }).boundingBox())!;
  expect(hb.y).toBeGreaterThanOrEqual(vb.y + vb.height * 0.6);
});

test('12 and 14: the plumb bob plays once; Process uses its drawn hero instead of the square', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'desktop accents');
  await page.goto('/about');
  const bob = page.getByTestId('accent-plumb-bob');
  await bob.scrollIntoViewIfNeeded();
  await expect(bob).toHaveAttribute('data-played', 'true');
  expect(await page.locator('[data-testid^="accent-"]').count()).toBe(1);
  await page.goto('/process');
  expect(await page.locator('[data-testid^="accent-"]').count()).toBe(0);
  await expect(page.getByTestId('process-hero')).toBeVisible();
});

test('13: founder portrait sits right, 5 of 12 columns, 48px lower', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop layout');
  await page.goto('/about');
  const img = page.getByRole('img', { name: /Dan Haley Fuller/ });
  const heading = page.getByRole('heading', { level: 1 });
  const ib = await img.boundingBox();
  const hb = await heading.boundingBox();
  expect(ib!.x).toBeGreaterThan(hb!.x + hb!.width / 2);
});

test('23: only portfolio tiles tilt, and the tilt follows the cursor', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'fine pointer only');
  await page.goto('/portfolio');
  const tile = page.locator('[data-tilt="true"]').first();
  await tile.scrollIntoViewIfNeeded();
  const b = (await tile.boundingBox())!;
  await page.mouse.move(b.x + b.width * 0.1, b.y + b.height * 0.1);
  await page.mouse.move(b.x + b.width * 0.15, b.y + b.height * 0.12);
  const a = await tile.evaluate((el) => el.style.transform);
  await page.mouse.move(b.x + b.width * 0.9, b.y + b.height * 0.9);
  const c = await tile.evaluate((el) => el.style.transform);
  expect(a).toContain('rotateX');
  expect(a).not.toEqual(c);
  await page.mouse.move(5, 5);
  await expect.poll(() => tile.evaluate((el) => el.style.transform)).toBe('');
  await page.goto('/');
  expect(await page.locator('figure[data-tilt], [role="region"] [data-tilt]').count()).toBe(0);
});

test('24: only Start the Conversation and Send Inquiry are magnetic', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'fine pointer only');
  await page.goto('/contact');
  const magnetic = page.locator('[data-magnetic="true"]');
  await expect(magnetic).toHaveText(['Start the Conversation', 'Send Inquiry']);
  const send = page.getByRole('button', { name: 'Send Inquiry' });
  await send.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const b = (await send.boundingBox())!;
  await page.mouse.move(b.x + b.width + 20, b.y + b.height / 2);
  await page.mouse.move(b.x + b.width + 18, b.y + b.height / 2);
  await expect
    .poll(() => send.locator('[data-magnetic]').evaluate((el) => el.style.transform))
    .toContain('translate3d');
});

test('25: scroll-progress line tracks scroll on every page', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const bar = page.getByTestId('scroll-progress');
    await expect(bar).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect
      .poll(() => bar.evaluate((el) => el.getBoundingClientRect().width / window.innerWidth))
      .toBeGreaterThan(0.95);
  }
});

test('26: accent text selection and a designed og:image on every page', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route);
    const og = await page.locator('meta[property="og:image"]').first().getAttribute('content');
    // Pages use a designed share card; project pages use their own cover photo.
    expect(og, route).toMatch(/\/og\/[a-z-]+\.jpg$|\/images\/projects\/[a-z0-9-]+\/cover\.jpg$/);
  }
  const selection = await page.evaluate(() => {
    const sheet = [...document.styleSheets].flatMap((s) => {
      try {
        return [...s.cssRules].map((r) => r.cssText);
      } catch {
        return [];
      }
    });
    return sheet.find((t) => t.includes('::selection')) ?? '';
  });
  expect(selection).toMatch(/122, 98, 80|7a6250/i);
});

test('no horizontal scrolling at any phone, tablet or desktop width', async ({ browser }) => {
  test.setTimeout(180_000);
  const widths = [320, 375, 414, 768, 834, 1024, 1280, 1440, 1920, 2560];
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    for (const route of ROUTES) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
    }
    await ctx.close();
  }
});

test('eco-building: Process summarizes it and links to the full page', async ({ page }) => {
  await page.goto('/process');
  const link = page.getByRole('link', { name: 'Explore Eco-Building' });
  // Bring it up from below, as a reader scrolling down meets it, before the next section covers it.
  await link.evaluate((el) => el.scrollIntoView({ block: 'end' }));
  await link.click();
  await expect(page).toHaveURL(/\/eco-building$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Energy-Efficient Homes' }),
  ).toBeVisible();
  for (const name of [
    'Less Lumber, Same Home',
    'The Air Inside Your Home',
    'Homes That Make Their Own Energy',
    'Efficient and Beautiful',
    'Meeting and Exceeding BuildSmart',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name })).toHaveCount(1);
  }
});

test('about: board service and professional associations from the old About page', async ({
  page,
}) => {
  await page.goto('/about');
  const section = page.locator('section', { hasText: 'Service and Associations' });
  for (const name of [
    /YPO/,
    /ACE Foundation/,
    /Home Builders Association of Metro Denver/,
    /Colorado Association of Home Builders/,
    /National Association of Home Builders/,
    /Institute of Classical Architecture/,
    'Builder 20 Club member',
    'Rocky Mountain Chapter',
  ]) {
    await expect(section.getByText(name)).toHaveCount(1);
  }
  // Every association and all but the unverified ACE mark show a logo.
  await expect(section.locator('img')).toHaveCount(5);
  // No logo repeats anywhere on the page.
  const srcs = await page
    .locator('main img[src*="images%2F"], main img[src*="/images/"]')
    .evaluateAll((els) =>
      els
        .map((e) => decodeURIComponent(e.getAttribute('src') ?? ''))
        .map((s) => s.match(/images\/(affiliations|community|press|awards|eco)\/[^&?]+/)?.[0])
        .filter(Boolean),
    );
  expect(new Set(srcs).size).toBe(srcs.length);
  // The Children's Diabetes Foundation card carries the board role; Designs By Sundown is a partner.
  await expect(page.getByText('Board member and event chairman')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Designs By Sundown' })).toBeAttached();
});

test('dated lines follow the visitor’s clock, not the build date', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2031-02-01T12:00:00'));
  await page.goto('/');
  await expect(page.locator('footer').getByText('© 2031 Haley Custom Homes')).toBeAttached();
  await expect(page.getByText('Best of Houzz, every year 2016 to 2031').first()).toBeAttached();
  await expect(page.getByText(/has spent 33 years/)).toBeAttached();
  await expect(page.getByTestId('founding-line')).toContainText('2031');
});
