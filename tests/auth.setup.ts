import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

/**
 * Authentication setup for Playwright tests
 * This will sign in using Google SSO before running tests
 */
setup('authenticate', async ({ page }) => {
  // Navigate to the sign-in page
  await page.goto('/signin');

  // Click on "Sign in with Google" button
  await page.getByRole('link', { name: 'Sign in with Google' }).click();

  // Wait for Google OAuth page to load
  await page.waitForURL(/accounts\.google\.com/);

  // Fill in Google credentials from environment variables
  const email = process.env.GOOGLE_TEST_EMAIL;
  const password = process.env.GOOGLE_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('GOOGLE_TEST_EMAIL and GOOGLE_TEST_PASSWORD must be set in environment variables');
  }

  // Enter email
  await page.fill('input[type="email"]', email);
  await page.click('#identifierNext');

  // Wait for password field to appear
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });

  // Enter password
  await page.fill('input[type="password"]', password);
  await page.click('#passwordNext');

  // Wait for redirect back to the app
  await page.waitForURL('https://protoapp.xyz/**', { timeout: 30000 });

  // Verify we're authenticated by checking for user-specific content
  // Adjust this selector based on your app's authenticated state
  await expect(page.getByText(/Welcome back/i)).toBeVisible({ timeout: 10000 });

  // Save signed-in state to reuse in tests
  await page.context().storageState({ path: authFile });
});
