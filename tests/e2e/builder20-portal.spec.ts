import { test, expect } from './fixtures';

test('builder 20: the eight peer builders, each with its market; linked from About', async ({
  page,
}) => {
  await page.goto('/about');
  await page.getByRole('link', { name: 'Builder 20 Club member' }).click();
  await expect(page).toHaveURL(/\/builder20$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Building Outside Colorado?');
  const rows = page.getByTestId('builder20-list').locator('li');
  await expect(rows).toHaveCount(8);
  await expect(rows.first()).toContainText('Casas Del Oso');
  await expect(rows.first()).toContainText('Phoenix and Scottsdale, Arizona');
  // External links open in a new tab; Paul Homes' site is down, so it has no link.
  const first = rows.first().getByRole('link');
  await expect(first).toHaveAttribute('target', '_blank');
  await expect(first).toHaveAttribute('rel', /noopener/);
  await expect(rows.filter({ hasText: 'Paul Homes' }).getByRole('link')).toHaveCount(0);
});

test('client portal: one button to Buildertrend sign-in; old /client-login redirects', async ({
  page,
}) => {
  await page.goto('/client-login');
  await expect(page).toHaveURL(/\/client-portal$/);
  const portal = page.getByTestId('client-portal');
  await expect(portal.getByRole('heading', { level: 1 })).toHaveText('Client Portal');
  await expect(portal.getByRole('link', { name: 'Sign In to the Portal' })).toHaveAttribute(
    'href',
    'https://buildertrend.net/app/Login',
  );
  await expect(portal).toContainText('Continues to Buildertrend');
  // No password field on this site: credentials only ever go to the portal provider.
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('footer').getByRole('link', { name: 'Client Portal' })).toBeAttached();
});
