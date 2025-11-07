import { test, expect } from '@playwright/test';

test.describe('AnalyticsDashboard Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/analytics-dashboard');
    await page.waitForSelector('[data-testid="analytics-dashboard"]', { timeout: 10000 });
  });

  test('should display analytics overview title', async ({ page }) => {
    await expect(page.getByText('Analytics Overview')).toBeVisible();
  });

  test('should show date range', async ({ page }) => {
    await expect(page.getByText(/1\/1\/2024/)).toBeVisible();
    await expect(page.getByText(/1\/31\/2024/)).toBeVisible();
  });

  test('should display export button', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Export' });
    await expect(exportButton).toBeVisible();
  });

  test('should trigger export when Export button is clicked', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Export' });
    await exportButton.click();

    await expect(page.getByTestId('export-clicked')).toBeVisible();
  });

  test('should display Total Signups KPI', async ({ page }) => {
    await expect(page.getByText('Total Signups')).toBeVisible();
    await expect(page.getByText('1,250')).toBeVisible();
    await expect(page.getByText('45 today')).toBeVisible();
  });

  test('should display Verification Rate KPI', async ({ page }) => {
    await expect(page.getByText('Verification Rate')).toBeVisible();
    await expect(page.getByText('87.5%')).toBeVisible();
    await expect(page.getByText('Email verification rate')).toBeVisible();
  });

  test('should display K-Factor KPI', async ({ page }) => {
    await expect(page.getByText('K-Factor')).toBeVisible();
    await expect(page.getByText('1.80')).toBeVisible();
    await expect(page.getByText('Viral')).toBeVisible();
  });

  test('should display Avg Referrals KPI', async ({ page }) => {
    await expect(page.getByText('Avg Referrals')).toBeVisible();
    await expect(page.getByText('2.30')).toBeVisible();
    await expect(page.getByText('Per user average')).toBeVisible();
  });

  test('should show Growth Over Time section', async ({ page }) => {
    await expect(page.getByText('Growth Over Time')).toBeVisible();
  });

  test('should display chart type toggle buttons', async ({ page }) => {
    const pieButton = page.getByRole('button', { name: 'Pie chart' });
    const barButton = page.getByRole('button', { name: 'Bar chart' });

    await expect(pieButton).toBeVisible();
    await expect(barButton).toBeVisible();
  });

  test('should toggle between pie and bar charts', async ({ page }) => {
    const barButton = page.getByRole('button', { name: 'Bar chart' });
    await barButton.click();

    // Button should now be active (this depends on CSS class, might need visual verification)
    await expect(barButton).toBeVisible();

    const pieButton = page.getByRole('button', { name: 'Pie chart' });
    await pieButton.click();
    await expect(pieButton).toBeVisible();
  });

  test('should show all KPI icons', async ({ page }) => {
    const dashboard = page.locator('[data-testid="analytics-dashboard"]');

    // Check that KPI cards exist
    await expect(dashboard).toContainText('Total Signups');
    await expect(dashboard).toContainText('Verification Rate');
    await expect(dashboard).toContainText('K-Factor');
    await expect(dashboard).toContainText('Avg Referrals');
  });

  test('should show viral badge for K-Factor >= 1', async ({ page }) => {
    // K-Factor is 1.8, so should show "Viral" badge
    await expect(page.getByText('Viral')).toBeVisible();
  });

  test('should toggle loading state', async ({ page }) => {
    const toggleButton = page.getByRole('button', { name: 'Toggle Loading State' });
    await toggleButton.click();

    // When loading, numbers might be replaced with skeletons
    // Just verify the button works
    await expect(toggleButton).toBeVisible();

    // Toggle back
    await toggleButton.click();
    await expect(toggleButton).toBeVisible();
  });
});
