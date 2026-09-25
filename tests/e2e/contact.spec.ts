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
  await page.getByLabel('Do you have a lot or site selected?').selectOption('Not yet');
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

test('FAQ has exactly the ten questions, in order', async ({ page }) => {
  await page.goto('/contact');
  const expected = [
    "What's the minimum project size?",
    'How long does a typical build take?',
    'Do you take on remodels as well as new builds?',
    'What areas do you build in?',
    'How does the Accelerated Precision Building System actually save time?',
    'Do you provide design and architectural services, or do I need my own architect?',
    'Do I need to already own the lot, or can Haley help me find one?',
    'What does the payment schedule look like?',
    'Is there a warranty after move-in?',
    'How far ahead of a desired groundbreaking date should I reach out?',
  ];
  await expect(page.locator('h3 > button[aria-expanded]')).toHaveText(expected);
  await expect(page.locator('#faq-heading').locator('xpath=ancestor::section')).not.toContainText(
    '[',
  );
});

test('lot field sits between Location and Message and is optional', async ({ page }) => {
  await page.goto('/contact');
  const order = await page.locator('form label').allTextContents();
  const i = order.findIndex((t) => t.startsWith('Location or Neighborhood'));
  expect(order[i + 1]).toContain('Do you have a lot or site selected?');
  expect(order[i + 2]).toContain('Message');
  await expect(page.getByLabel('Do you have a lot or site selected?').locator('option')).toHaveText(
    ['Select', 'Yes', 'Not yet', 'Still deciding'],
  );
});
