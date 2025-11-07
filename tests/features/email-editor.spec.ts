import { test, expect } from '@playwright/test';

test.describe('EmailEditor Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/email-editor');
    await page.waitForSelector('[data-testid="email-editor"]', { timeout: 10000 });
  });

  test('should display email editor with initial content', async ({ page }) => {
    await expect(page.getByText('Welcome to our campaign!')).toBeVisible();
  });

  test('should show formatting toolbar', async ({ page }) => {
    // Check for formatting buttons
    await expect(page.getByRole('button', { name: 'Bold' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Italic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Underline' })).toBeVisible();
  });

  test('should show insert content buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Insert link' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Insert image' })).toBeVisible();
  });

  test('should show insert variable button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Insert Variable' })).toBeVisible();
  });

  test('should display preview toggle button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Switch to preview mode' })).toBeVisible();
  });

  test('should show device toggle button', async ({ page }) => {
    const deviceButton = page.getByRole('button', { name: /Switch to (mobile|desktop) preview/ });
    await expect(deviceButton).toBeVisible();
  });

  test('should toggle between edit and preview mode', async ({ page }) => {
    const previewButton = page.getByRole('button', { name: 'Switch to preview mode' });
    await previewButton.click();

    // Should switch to edit mode button
    await expect(page.getByRole('button', { name: 'Switch to edit mode' })).toBeVisible();

    // Click to go back to edit
    await page.getByRole('button', { name: 'Switch to edit mode' }).click();
    await expect(page.getByRole('button', { name: 'Switch to preview mode' })).toBeVisible();
  });

  test('should toggle device preview mode', async ({ page }) => {
    // Should start as desktop
    await expect(page.getByRole('button', { name: 'Switch to mobile preview' })).toBeVisible();

    // Click to switch to mobile
    await page.getByRole('button', { name: 'Switch to mobile preview' }).click();

    // Should now show desktop option
    await expect(page.getByRole('button', { name: 'Switch to desktop preview' })).toBeVisible();
  });

  test('should show variables menu when Insert Variable is clicked', async ({ page }) => {
    const insertVariableButton = page.getByRole('button', { name: 'Insert Variable' });
    await insertVariableButton.click();

    // Check for some variable options
    await expect(page.getByText('first_name')).toBeVisible();
    await expect(page.getByText('email')).toBeVisible();
    await expect(page.getByText('referral_code')).toBeVisible();
  });

  test('should display hint text', async ({ page }) => {
    await expect(page.getByText(/Use the toolbar to format text/)).toBeVisible();
  });

  test('should update content length counter', async ({ page }) => {
    await expect(page.getByTestId('content-length')).toBeVisible();
    await expect(page.getByTestId('content-length')).toContainText('Content length:');
  });

  test('should track change count', async ({ page }) => {
    const changeCount = page.getByTestId('change-count');

    // Initially should not show changes
    await expect(changeCount).not.toBeVisible();
  });
});
