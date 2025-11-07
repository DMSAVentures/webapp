import { test, expect } from '@playwright/test';

test.describe('ReferralLink Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/referral-link');
    await page.waitForSelector('[data-testid="referral-link"]', { timeout: 10000 });
  });

  test('should display the referral link label', async ({ page }) => {
    await expect(page.getByText('Your Referral Link')).toBeVisible();
  });

  test('should display the complete referral URL', async ({ page }) => {
    await expect(page.getByText('https://example.com?ref=TEST123')).toBeVisible();
  });

  test('should display Copy button', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: 'Copy referral link' });
    await expect(copyButton).toBeVisible();
    await expect(copyButton.getByText('Copy')).toBeVisible();
  });

  test('should display QR Code button', async ({ page }) => {
    const qrButton = page.getByRole('button', { name: 'Show QR code' });
    await expect(qrButton).toBeVisible();
    await expect(qrButton.getByText('QR Code')).toBeVisible();
  });

  test('should copy link to clipboard when Copy button is clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyButton = page.getByRole('button', { name: 'Copy referral link' });
    await copyButton.click();

    // Wait for the copy operation to complete
    await page.waitForTimeout(100);

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe('https://example.com?ref=TEST123');
  });

  test('should show "Copied!" feedback after copying', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyButton = page.getByRole('button', { name: 'Copy referral link' });
    await copyButton.click();

    // Check for copied feedback
    await expect(page.getByText('Copied!')).toBeVisible();

    // Feedback should disappear after 2 seconds
    await page.waitForTimeout(2500);
    await expect(page.getByText('Copied!')).not.toBeVisible();
  });

  test('should trigger onCopy callback when copy is successful', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const copyButton = page.getByRole('button', { name: 'Copy referral link' });
    await copyButton.click();

    // Check that the copy count increased
    await expect(page.getByTestId('copy-count')).toBeVisible();
    await expect(page.getByText('Copied 1 time')).toBeVisible();
  });

  test('should open QR code modal when QR Code button is clicked', async ({ page }) => {
    const qrButton = page.getByRole('button', { name: 'Show QR code' });
    await qrButton.click();

    // Check for modal
    await expect(page.getByText('Scan QR Code')).toBeVisible();
    await expect(page.getByText('Share your referral link by scanning this QR code')).toBeVisible();
  });

  test('should display QR code image in modal', async ({ page }) => {
    const qrButton = page.getByRole('button', { name: 'Show QR code' });
    await qrButton.click();

    // Check for QR code image
    const qrImage = page.getByAltText('Referral QR Code');
    await expect(qrImage).toBeVisible();

    // Verify the image src contains the correct URL
    const src = await qrImage.getAttribute('src');
    expect(src).toContain('qrserver.com');
    expect(src).toContain(encodeURIComponent('https://example.com?ref=TEST123'));
  });

  test('should close QR code modal when Close button is clicked', async ({ page }) => {
    const qrButton = page.getByRole('button', { name: 'Show QR code' });
    await qrButton.click();

    // Modal should be visible
    await expect(page.getByText('Scan QR Code')).toBeVisible();

    // Click close button
    const closeButton = page.getByRole('button', { name: 'Close' });
    await closeButton.click();

    // Modal should be closed
    await expect(page.getByText('Scan QR Code')).not.toBeVisible();
  });
});
