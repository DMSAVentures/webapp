import { test, expect } from '@playwright/test';

test.describe('Home/Dashboard Page', () => {
  test('should load dashboard and show welcome message', async ({ page }) => {
    await page.goto('/');

    // Check if welcome message is visible
    await expect(page.getByText(/Welcome back/i)).toBeVisible();

    // Check for Quick Access section
    await expect(page.getByText('Quick Access')).toBeVisible();

    // Check for Your Role section
    await expect(page.getByText('Your Role')).toBeVisible();
  });

  test('should display user persona badge', async ({ page }) => {
    await page.goto('/');

    // Check if persona badge is displayed
    const personaBadge = page.locator('.personaBadge, [class*="personaBadge"]');
    await expect(personaBadge).toBeVisible();
  });

  test('should have navigation cards for quick access', async ({ page }) => {
    await page.goto('/');

    // Check if navigation cards are present
    const cards = page.locator('.card, [class*="card"]').first();
    await expect(cards).toBeVisible();
  });
});
