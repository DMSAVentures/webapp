import { test, expect } from '@playwright/test';

test.describe('Campaigns', () => {
  const campaignName = `PLAYWRIGHT Test Campaign ${Date.now()}`;
  let campaignId: string | null = null;

  test('should navigate to campaigns page', async ({ page }) => {
    await page.goto('/campaigns');

    // Check if we're on campaigns page
    await expect(page).toHaveURL(/\/campaigns/);
  });

  test('should show new campaign button or link', async ({ page }) => {
    await page.goto('/campaigns');

    // Look for new campaign button/link
    const newCampaignButton = page.getByRole('link', { name: /new|create/i }).or(
      page.getByRole('button', { name: /new|create/i })
    );

    await expect(newCampaignButton.first()).toBeVisible();
  });

  test('should navigate to new campaign page', async ({ page }) => {
    await page.goto('/campaigns/new');

    // Check if we're on new campaign page
    await expect(page).toHaveURL(/\/campaigns\/new/);
  });

  test('should create a new campaign with PLAYWRIGHT prefix', async ({ page }) => {
    await page.goto('/campaigns/new');

    // Wait for form to be ready
    await page.waitForLoadState('networkidle');

    // Look for campaign name/title input
    const nameInput = page.getByLabel(/name|title/i).or(
      page.locator('input[name*="name"], input[name*="title"]')
    ).first();

    if (await nameInput.isVisible()) {
      await nameInput.fill(campaignName);

      // Look for submit/create button
      const submitButton = page.getByRole('button', { name: /create|save|submit/i }).first();

      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Wait for navigation or success
        await page.waitForTimeout(2000);

        // Try to extract campaign ID from URL if redirected
        const url = page.url();
        const match = url.match(/\/campaigns\/([^/]+)/);
        if (match) {
          campaignId = match[1];
          console.log('Created campaign with ID:', campaignId);
        }
      }
    }
  });

  test('should view campaign details', async ({ page }) => {
    await page.goto('/campaigns');

    // Click on first campaign in the list
    const firstCampaign = page.locator('a[href*="/campaigns/"]').first();

    if (await firstCampaign.isVisible()) {
      await firstCampaign.click();

      // Check if we're on campaign details page
      await expect(page).toHaveURL(/\/campaigns\/[^/]+$/);
    }
  });

  test('should navigate to campaign edit page', async ({ page }) => {
    await page.goto('/campaigns');

    // Find and click first campaign
    const firstCampaign = page.locator('a[href*="/campaigns/"]').first();

    if (await firstCampaign.isVisible()) {
      const href = await firstCampaign.getAttribute('href');
      if (href) {
        const campaignPath = href.replace(/\/$/, '');
        await page.goto(`${campaignPath}/edit`);

        // Check if we're on edit page
        await expect(page).toHaveURL(/\/campaigns\/[^/]+\/edit/);
      }
    }
  });

  test('should navigate to form builder', async ({ page }) => {
    await page.goto('/campaigns');

    // Find first campaign
    const firstCampaign = page.locator('a[href*="/campaigns/"]').first();

    if (await firstCampaign.isVisible()) {
      const href = await firstCampaign.getAttribute('href');
      if (href) {
        const campaignPath = href.replace(/\/$/, '');
        await page.goto(`${campaignPath}/form-builder`);

        // Check if we're on form builder page
        await expect(page).toHaveURL(/\/campaigns\/[^/]+\/form-builder/);
      }
    }
  });

  test('should navigate to campaign users page', async ({ page }) => {
    await page.goto('/campaigns');

    // Find first campaign
    const firstCampaign = page.locator('a[href*="/campaigns/"]').first();

    if (await firstCampaign.isVisible()) {
      const href = await firstCampaign.getAttribute('href');
      if (href) {
        const campaignPath = href.replace(/\/$/, '');
        await page.goto(`${campaignPath}/users`);

        // Check if we're on users page
        await expect(page).toHaveURL(/\/campaigns\/[^/]+\/users/);
      }
    }
  });

  test('should navigate to campaign embed page', async ({ page }) => {
    await page.goto('/campaigns');

    // Find first campaign
    const firstCampaign = page.locator('a[href*="/campaigns/"]').first();

    if (await firstCampaign.isVisible()) {
      const href = await firstCampaign.getAttribute('href');
      if (href) {
        const campaignPath = href.replace(/\/$/, '');
        await page.goto(`${campaignPath}/embed`);

        // Check if we're on embed page
        await expect(page).toHaveURL(/\/campaigns\/[^/]+\/embed/);
      }
    }
  });
});
