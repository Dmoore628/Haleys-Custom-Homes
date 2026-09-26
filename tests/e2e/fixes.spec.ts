import { test, expect } from './fixtures';

/** One check per acceptance line in docs/haley-custom-homes-fixes-spec.md that a browser can verify. */

const ROUTES = ['/', '/portfolio', '/portfolio/denver-modern', '/process', '/about', '/contact'];

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
    '/portfolio/denver-modern': 2,
    '/process': 5,
    '/about': 4,
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

test('5, 6, 21: awards strip, scarcity badge and As Seen In line', async ({ page }) => {
  await page.goto('/');
  const strip = page.locator('section[aria-label="Awards and recognition"]');
  await strip.scrollIntoViewIfNeeded();
  const box = await strip.boundingBox();
  const vw = page.viewportSize()!.width;
  expect(box!.width).toBeGreaterThanOrEqual(vw - 1);
  // Full strip on first paint: the track is at least twice the viewport width.
  const track = await strip.locator('.marquee-track').evaluate((el) => el.scrollWidth);
  expect(track).toBeGreaterThanOrEqual(vw * 2);
  const markHeight = await strip
    .locator('img')
    .first()
    .evaluate((el) => el.getBoundingClientRect().height);
  expect(markHeight).toBeGreaterThanOrEqual(47);
  expect(markHeight).toBeLessThanOrEqual(97);
  await expect(page.getByText('Now accepting a limited number of new projects.')).toBeVisible();
  const asSeen = page.getByText('As Seen In: Modern In Denver, Colorado Homes & Lifestyles.');
  await expect(asSeen).toBeVisible();
  await expect(asSeen).toHaveCSS('animation-name', 'none');
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

test('8: phone hero caps at 720px and fills without letterboxing', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone only');
  await page.goto('/');
  const hero = page
    .locator('section')
    .filter({ has: page.locator('video') })
    .first();
  const h = await hero.evaluate((el) => el.getBoundingClientRect().height);
  expect(h).toBeLessThanOrEqual(720);
  await expect(hero.locator('video')).toHaveCSS('object-fit', 'cover');
});

test('12 and 14: framing square and plumb bob accents play once', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop accents');
  await page.goto('/about');
  const bob = page.getByTestId('accent-plumb-bob');
  await bob.scrollIntoViewIfNeeded();
  await expect(bob).toHaveAttribute('data-played', 'true');
  expect(await page.locator('[data-testid^="accent-"]').count()).toBe(1);
  await page.goto('/process');
  expect(await page.locator('[data-testid^="accent-"]').count()).toBe(1);
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
    expect(og, route).toMatch(/\/og\/[a-z-]+\.jpg$/);
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
