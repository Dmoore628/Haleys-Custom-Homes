import { test as base } from '@playwright/test';

/** Every test starts with the cookie notice dismissed unless it opts in. */
export const test = base.extend<{ keepCookieNotice: boolean }>({
  keepCookieNotice: [false, { option: true }],
  page: async ({ page, keepCookieNotice }, use) => {
    if (!keepCookieNotice) {
      await page.addInitScript(() =>
        window.localStorage.setItem('hch-cookie-consent', 'dismissed'),
      );
    }
    await use(page);
  },
});
export { expect } from '@playwright/test';
