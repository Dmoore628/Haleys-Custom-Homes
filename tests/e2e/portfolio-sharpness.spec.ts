/** A wide photo in a tall tile renders wider than the tile; the image served must cover it. */
import { test, expect } from './fixtures';
for (const [w, h, dpr] of [
  [1440, 900, 1],
  [1440, 900, 2],
  [390, 844, 3],
] as const) {
  test(`naturally modern tile is sharp at ${w}px @${dpr}x`, async ({ browser }) => {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: dpr,
    });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem('hch-cookie-consent', 'dismissed'));
    await page.goto('/');
    const img = page.getByRole('img', { name: 'Naturally Modern' }).first();
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth))
      .toBeTruthy();
    const r = await img.evaluate((el: HTMLImageElement) => {
      const box = el.getBoundingClientRect();
      const aspect = el.naturalWidth / el.naturalHeight;
      // object-cover: the photo renders at the larger of the box width and height x aspect
      const rendered = Math.max(box.width, box.height * aspect) * devicePixelRatio;
      // The real pixel width served: the requested w= (Next never upscales past the 2400px source).
      const w = Number(new URL(el.currentSrc).searchParams.get('w'));
      return { served: Math.min(w, 2400), rendered: Math.round(rendered) };
    });
    // The served image covers what's shown (2400 is the largest source there is).
    expect(r.served).toBeGreaterThanOrEqual(Math.min(r.rendered * 0.95, 2400));
    await ctx.close();
  });
}
