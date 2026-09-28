import path from 'node:path';
import { test, expect } from './fixtures';

/**
 * The portfolio admin, end to end, against a real database. Runs only when E2E_ADMIN=1 with
 * DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD set (see docs/ADMIN.md, "Testing locally").
 */
test.skip(process.env.E2E_ADMIN !== '1', 'needs a database: E2E_ADMIN=1');
test.describe.configure({ mode: 'serial' });

const email = process.env.ADMIN_EMAIL ?? '';
const password = process.env.ADMIN_PASSWORD ?? '';
const NAME = `Playwright Test Home ${Date.now().toString(36)}`;

test('signed-out visitors are sent to sign-in, and a wrong password is refused', async ({
  page,
  request,
}) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('not-the-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('That email and password don’t match.')).toBeVisible();

  const res = await request.post('/api/admin/upload', { multipart: { projectId: '1' } });
  expect(res.status()).toBe(401);
});

test('create a project, add a photo, publish it, see it on the site, then delete it', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  expect(await page.getByTestId('admin-project-row').count()).toBeGreaterThanOrEqual(13);

  await page.getByRole('link', { name: '+ New project' }).click();
  await page.getByLabel('Project name').fill(NAME);
  await page.getByText('Remodel', { exact: true }).click();
  await page.getByLabel('Location').fill('Denver, CO');
  await page.getByLabel('Description').fill('A test project created by the automated admin test.');
  await page.getByRole('button', { name: 'Create project' }).click();
  await expect(page).toHaveURL(/\/admin\/projects\/\d+/);

  const photo = path.join(process.cwd(), 'public/images/projects/curated-house/01.jpg');
  await page.getByLabel('Choose photos to upload').setInputFiles(photo);
  await expect(page.getByTestId('admin-photo')).toHaveCount(1, { timeout: 30000 });
  await expect(page.getByText('Cover', { exact: true })).toBeVisible();

  await page.getByLabel('Published').check();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toContainText('live on the site');

  await page.goto('/portfolio');
  await page.getByRole('tab', { name: 'Remodels' }).click();
  await expect(page.getByText(NAME)).toBeVisible();
  await page.getByText(NAME).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(NAME);

  await page.goto('/admin');
  await page.getByRole('link', { name: NAME }).click();
  await page.getByRole('button', { name: 'Delete project' }).click();
  await page.getByRole('button', { name: 'Yes, delete' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('link', { name: NAME })).toHaveCount(0);

  await page.goto('/portfolio');
  await page.getByRole('tab', { name: 'Remodels' }).click();
  await expect(page.getByText(NAME)).toHaveCount(0);
});
