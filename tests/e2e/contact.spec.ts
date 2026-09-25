import { test, expect } from './fixtures';

test('required fields show ink-colored messages and nothing is sent', async ({ page }) => {
  let posted = false;
  await page.route('/api/contact', (route) => {
    posted = true;
    return route.fulfill({ json: { ok: true } });
  });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send Inquiry' }).click();
  await expect(page.getByText('This field is required.').first()).toBeVisible();
  await expect(page.getByLabel('Name')).toBeFocused();
  expect(posted).toBe(false);
});

test('a complete submission shows Sending, then the confirmation', async ({ page }) => {
  // With E2E_REAL_SMTP set (CI, against the Mailhog sandbox) this posts to the real route;
  // otherwise the network is stubbed so the UI flow is tested without mail credentials.
  let release: () => void = () => undefined;
  const gate = new Promise<void>((r) => (release = r));
  if (!process.env.E2E_REAL_SMTP) {
    await page.route('/api/contact', async (route) => {
      await gate;
      await route.fulfill({ json: { ok: true } });
    });
  }
  await page.goto('/contact');
  await page.getByLabel('Name').fill('Test Visitor');
  await page.getByLabel('Email').fill('visitor@example.com');
  await page.getByLabel('Phone').fill('303-555-0100');
  await page.getByLabel('Project Type').selectOption('New Custom Home');
  await page.getByLabel('Budget Range').selectOption('$4M+');
  await page.getByRole('button', { name: 'Send Inquiry' }).click();
  if (!process.env.E2E_REAL_SMTP) {
    await expect(page.getByRole('button', { name: 'Sending' })).toBeDisabled();
    release();
  }
  await expect(page.getByTestId('form-confirmation')).toHaveText(
    "Thank you. We'll be in touch within one business day.",
  );
});

test('FAQ accordion keeps only one answer open', async ({ page }) => {
  await page.goto('/contact');
  const q1 = page.getByRole('button', { name: "What's the minimum project size?" });
  const q2 = page.getByRole('button', { name: 'Do you take on remodels as well as new builds?' });
  await q1.scrollIntoViewIfNeeded();
  await q1.click();
  await expect(q1).toHaveAttribute('aria-expanded', 'true');
  await q2.click();
  await expect(q2).toHaveAttribute('aria-expanded', 'true');
  await expect(q1).toHaveAttribute('aria-expanded', 'false');
});
