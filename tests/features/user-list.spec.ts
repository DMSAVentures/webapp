import { test, expect } from '@playwright/test';

test.describe('UserList Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/user-list');
    await page.waitForSelector('[data-testid="user-list"]', { timeout: 10000 });
  });

  test('should display all users in the list', async ({ page }) => {
    await expect(page.getByText('alice@example.com')).toBeVisible();
    await expect(page.getByText('bob@example.com')).toBeVisible();
    await expect(page.getByText('charlie@example.com')).toBeVisible();
  });

  test('should display user names', async ({ page }) => {
    await expect(page.getByText('Alice Johnson')).toBeVisible();
    await expect(page.getByText('Bob Smith')).toBeVisible();
    await expect(page.getByText('Charlie Brown')).toBeVisible();
  });

  test('should display user statuses with correct badges', async ({ page }) => {
    await expect(page.getByText('Verified')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();
  });

  test('should display user positions', async ({ page }) => {
    await expect(page.getByText('#1')).toBeVisible();
    await expect(page.getByText('#2')).toBeVisible();
    await expect(page.getByText('#3')).toBeVisible();
  });

  test('should display referral counts', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toContainText('5'); // Alice's referrals
    await expect(table).toContainText('3'); // Charlie's referrals
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by email or name...');
    await expect(searchInput).toBeVisible();
  });

  test('should filter users by search query', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by email or name...');

    await searchInput.fill('alice');

    // Only Alice should be visible
    await expect(page.getByText('alice@example.com')).toBeVisible();
    await expect(page.getByText('bob@example.com')).not.toBeVisible();
    await expect(page.getByText('charlie@example.com')).not.toBeVisible();
  });

  test('should show results count', async ({ page }) => {
    await expect(page.getByText('3 users')).toBeVisible();
  });

  test('should update results count when filtering', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by email or name...');
    await searchInput.fill('bob');

    await expect(page.getByText('1 user')).toBeVisible();
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by email or name...');
    await searchInput.fill('alice');

    // Only Alice should be visible initially
    await expect(page.getByText('1 user')).toBeVisible();

    // Click clear button
    const clearButton = page.getByRole('button', { name: 'Clear search' });
    await clearButton.click();

    // All users should be visible again
    await expect(page.getByText('3 users')).toBeVisible();
  });

  test('should display Export CSV button', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Export CSV' });
    await expect(exportButton).toBeVisible();
  });

  test('should trigger export when Export CSV is clicked', async ({ page }) => {
    const exportButton = page.getByRole('button', { name: 'Export CSV' });
    await exportButton.click();

    // Check that export result appears
    await expect(page.getByTestId('export-result')).toBeVisible();
    await expect(page.getByText('Exported 3 users')).toBeVisible();
  });

  test('should display filter toggle button', async ({ page }) => {
    const filterButton = page.getByRole('button', { name: 'Toggle filters' });
    await expect(filterButton).toBeVisible();
  });

  test('should have sortable column headers', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Email/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Name/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Status/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Position/ })).toBeVisible();
  });

  test('should sort users by email when Email header is clicked', async ({ page }) => {
    const emailHeader = page.getByRole('button', { name: /Email/ });
    await emailHeader.click();

    // Get all email cells
    const rows = page.locator('tbody tr');
    const firstRowEmail = rows.first().locator('td').nth(1);

    // After clicking, should sort alphabetically
    await expect(firstRowEmail).toContainText('alice@example.com');
  });

  test('should select all users when select all checkbox is clicked', async ({ page }) => {
    const selectAllCheckbox = page.locator('thead input[type="checkbox"]').first();
    await selectAllCheckbox.click();

    // Wait for selection
    await page.waitForTimeout(100);

    // All checkboxes should be checked
    const checkboxes = page.locator('tbody input[type="checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });

  test('should trigger onUserClick when a row is clicked', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    await firstRow.click();

    // Check that selected user appears
    await expect(page.getByTestId('selected-user')).toBeVisible();
    await expect(page.getByText(/Selected: alice@example.com/)).toBeVisible();
  });

  test('should show no results message when search has no matches', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by email or name...');
    await searchInput.fill('nonexistent@example.com');

    await expect(page.getByText('No users found')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  });

  test('should clear search and filters when Clear filters button is clicked', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search by email or name...');
    await searchInput.fill('nonexistent');

    // No results message appears
    await expect(page.getByText('No users found')).toBeVisible();

    // Click clear filters
    const clearButton = page.getByRole('button', { name: 'Clear filters' });
    await clearButton.click();

    // All users should be visible again
    await expect(page.getByText('3 users')).toBeVisible();
  });
});
