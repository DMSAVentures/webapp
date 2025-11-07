import { test, expect } from '@playwright/test';

test.describe('CampaignCard Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/campaign-card');
    await page.waitForSelector('[data-testid="campaign-card-with-stats"]', { timeout: 10000 });
  });

  test('should display campaign name and description', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');

    await expect(card.getByText('Summer Sale Campaign')).toBeVisible();
    await expect(card.getByText('A special promotional campaign for summer products')).toBeVisible();
  });

  test('should display correct status badge', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');

    // Active campaign should show "Active" status
    await expect(card.getByText('Active')).toBeVisible();

    const draftCard = page.locator('[data-testid="campaign-card-draft"]');
    await expect(draftCard.getByText('Draft')).toBeVisible();
  });

  test('should display campaign stats when showStats is true', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');

    // Check for stats labels
    await expect(card.getByText('Signups')).toBeVisible();
    await expect(card.getByText('Referrals')).toBeVisible();
    await expect(card.getByText('K-Factor')).toBeVisible();

    // Check for stats values
    await expect(card.getByText('1,234')).toBeVisible();
    await expect(card.getByText('567')).toBeVisible();
    await expect(card.getByText('2.3')).toBeVisible();
  });

  test('should not display stats when showStats is false', async ({ page }) => {
    const draftCard = page.locator('[data-testid="campaign-card-draft"]');

    await expect(draftCard.getByText('Signups')).not.toBeVisible();
    await expect(draftCard.getByText('Referrals')).not.toBeVisible();
  });

  test('should display creation date', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');

    await expect(card.getByText(/Created/)).toBeVisible();
    await expect(card.getByText(/Jan 15, 2024/)).toBeVisible();
  });

  test('should show action menu button when actions are provided', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');
    const actionButton = card.getByRole('button', { name: 'More actions' });

    await expect(actionButton).toBeVisible();
  });

  test('should open dropdown menu when action button is clicked', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');
    const actionButton = card.getByRole('button', { name: 'More actions' });

    await actionButton.click();

    // Check for menu items
    await expect(page.getByText('Edit')).toBeVisible();
    await expect(page.getByText('Duplicate')).toBeVisible();
    await expect(page.getByText('Delete')).toBeVisible();
  });

  test('should trigger edit action when Edit is clicked', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');
    const actionButton = card.getByRole('button', { name: 'More actions' });

    await actionButton.click();
    await page.getByText('Edit').click();

    await expect(page.getByTestId('edit-clicked')).toBeVisible();
  });

  test('should trigger delete action when Delete is clicked', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');
    const actionButton = card.getByRole('button', { name: 'More actions' });

    await actionButton.click();
    await page.getByText('Delete').click();

    await expect(page.getByTestId('delete-clicked')).toBeVisible();
  });

  test('should trigger duplicate action when Duplicate is clicked', async ({ page }) => {
    const card = page.locator('[data-testid="campaign-card-with-stats"]');
    const actionButton = card.getByRole('button', { name: 'More actions' });

    await actionButton.click();
    await page.getByText('Duplicate').click();

    await expect(page.getByTestId('duplicate-clicked')).toBeVisible();
  });
});
