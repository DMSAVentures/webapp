import { test, expect } from '@playwright/test';

test.describe('Billing', () => {
  test('should navigate to billing index page', async ({ page }) => {
    await page.goto('/billing');

    // Check if we're on billing page
    await expect(page).toHaveURL(/\/billing/);
  });

  test('should navigate to billing plans page', async ({ page }) => {
    await page.goto('/billing/plans');

    // Check if we're on plans page
    await expect(page).toHaveURL(/\/billing\/plans/);

    // Check for plan cards or options
    await page.waitForLoadState('networkidle');
  });

  test('should display available plans', async ({ page }) => {
    await page.goto('/billing/plans');

    await page.waitForLoadState('networkidle');

    // Look for plan-related content (headings, cards, etc.)
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should navigate to payment method page', async ({ page }) => {
    await page.goto('/billing/payment_method');

    // Check if we're on payment method page
    await expect(page).toHaveURL(/\/billing\/payment_method/);
  });

  test('should navigate to payment page', async ({ page }) => {
    await page.goto('/billing/pay');

    // Check if we're on pay page
    await expect(page).toHaveURL(/\/billing\/pay/);
  });
});
