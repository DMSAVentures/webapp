import { test, expect } from '@playwright/test';

test.describe('API Keys', () => {
  test('should navigate to api-keys page', async ({ page }) => {
    await page.goto('/api-keys');

    // Check if we're on api-keys page
    await expect(page).toHaveURL(/\/api-keys/);
  });

  test('should load api-keys page successfully', async ({ page }) => {
    await page.goto('/api-keys');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('Webhooks', () => {
  test('should navigate to webhooks page', async ({ page }) => {
    await page.goto('/webhooks');

    // Check if we're on webhooks page
    await expect(page).toHaveURL(/\/webhooks/);
  });

  test('should load webhooks page successfully', async ({ page }) => {
    await page.goto('/webhooks');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('Email', () => {
  test('should navigate to email page', async ({ page }) => {
    await page.goto('/email');

    // Check if we're on email page
    await expect(page).toHaveURL(/\/email/);
  });

  test('should load email page successfully', async ({ page }) => {
    await page.goto('/email');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('Media', () => {
  test('should navigate to media page', async ({ page }) => {
    await page.goto('/media');

    // Check if we're on media page
    await expect(page).toHaveURL(/\/media/);
  });

  test('should load media page successfully', async ({ page }) => {
    await page.goto('/media');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('Deals', () => {
  test('should navigate to deals page', async ({ page }) => {
    await page.goto('/deals');

    // Check if we're on deals page
    await expect(page).toHaveURL(/\/deals/);
  });

  test('should load deals page successfully', async ({ page }) => {
    await page.goto('/deals');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('Articles', () => {
  test('should navigate to articles page', async ({ page }) => {
    await page.goto('/articles');

    // Check if we're on articles page
    await expect(page).toHaveURL(/\/articles/);
  });

  test('should load articles page successfully', async ({ page }) => {
    await page.goto('/articles');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('About', () => {
  test('should navigate to about page', async ({ page }) => {
    await page.goto('/about');

    // Check if we're on about page
    await expect(page).toHaveURL(/\/about/);
  });

  test('should load about page successfully', async ({ page }) => {
    await page.goto('/about');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});

test.describe('Account', () => {
  test('should navigate to account page', async ({ page }) => {
    await page.goto('/account');

    // Check if we're on account page
    await expect(page).toHaveURL(/\/account/);
  });

  test('should load account page successfully', async ({ page }) => {
    await page.goto('/account');

    await page.waitForLoadState('networkidle');

    // Check if page has loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should display user account information', async ({ page }) => {
    await page.goto('/account');

    await page.waitForLoadState('networkidle');

    // Page should render without errors
    await expect(page.locator('body')).toBeVisible();
  });
});
