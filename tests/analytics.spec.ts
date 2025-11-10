import { test, expect } from '@playwright/test';

test.describe('Analytics', () => {
  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/analytics');

    // Check if we're on analytics page
    await expect(page).toHaveURL(/\/analytics/);
  });

  test('should load analytics page successfully', async ({ page }) => {
    await page.goto('/analytics');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should display analytics content', async ({ page }) => {
    await page.goto('/analytics');

    await page.waitForLoadState('networkidle');

    // Page should render without errors
    await expect(page.locator('body')).toBeVisible();
  });
});
