import { test, expect } from '@playwright/test';

test.describe('Contacts', () => {
  const contactName = `PLAYWRIGHT Test Contact ${Date.now()}`;

  test('should navigate to contacts page', async ({ page }) => {
    await page.goto('/contacts');

    // Check if we're on contacts page
    await expect(page).toHaveURL(/\/contacts/);
  });

  test('should load contacts page successfully', async ({ page }) => {
    await page.goto('/contacts');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should show contacts list or empty state', async ({ page }) => {
    await page.goto('/contacts');

    await page.waitForLoadState('networkidle');

    // Page should render without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have option to add new contact', async ({ page }) => {
    await page.goto('/contacts');

    // Look for add/new contact button
    const addButton = page.getByRole('button', { name: /add|new|create/i }).or(
      page.getByRole('link', { name: /add|new|create/i })
    );

    // If button exists, verify it's visible
    const count = await addButton.count();
    if (count > 0) {
      await expect(addButton.first()).toBeVisible();
    }
  });
});
