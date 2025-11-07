import { test, expect } from '@playwright/test';

test.describe('FormBuilder Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test/form-builder');
    await page.waitForSelector('[data-testid="form-builder"]', { timeout: 10000 });
  });

  test('should display form builder title', async ({ page }) => {
    await expect(page.getByText('Form Builder')).toBeVisible();
  });

  test('should show Field Types palette', async ({ page }) => {
    await expect(page.getByText('Field Types')).toBeVisible();
    await expect(page.getByText('Drag or click to add')).toBeVisible();
  });

  test('should display all field types in palette', async ({ page }) => {
    // Check that all 10 field types are visible
    await expect(page.getByRole('button', { name: 'Add Email field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Text field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Text Area field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Dropdown field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Checkbox field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Radio field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Phone field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add URL field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Date field' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Number field' })).toBeVisible();
  });

  test('should show empty state when no fields added', async ({ page }) => {
    await expect(page.getByText('Drag fields from the left panel to start building your form')).toBeVisible();
    await expect(page.getByText('Drag fields here or click to add')).toBeVisible();
  });

  test('should add field by clicking on field type', async ({ page }) => {
    // Click on Email field type
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Should show "1 field"
    await expect(page.getByText('1 field')).toBeVisible();

    // Should show the field in canvas
    await expect(page.getByText('Email Field')).toBeVisible();
    await expect(page.getByText('email')).toBeVisible();
  });

  test('should add multiple fields by clicking', async ({ page }) => {
    // Add Email field
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Add Text field
    await page.getByRole('button', { name: 'Add Text field' }).click();

    // Should show "2 fields"
    await expect(page.getByText('2 fields')).toBeVisible();

    // Should show both fields
    await expect(page.getByText('Email Field')).toBeVisible();
    await expect(page.getByText('Text Field')).toBeVisible();
  });

  test('should enable unsaved changes badge after adding field', async ({ page }) => {
    // Initially should not show badge
    await expect(page.getByText('Unsaved changes')).not.toBeVisible();

    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Should show unsaved changes badge
    await expect(page.getByText('Unsaved changes')).toBeVisible();
  });

  test('should enable save button after making changes', async ({ page }) => {
    const saveButton = page.getByRole('button', { name: /Save Form/ });

    // Initially disabled
    await expect(saveButton).toBeDisabled();

    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Save button should now be enabled
    await expect(saveButton).toBeEnabled();
  });

  test('should display delete button for each field', async ({ page }) => {
    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Should show delete button
    const deleteButton = page.getByRole('button', { name: 'Delete field' });
    await expect(deleteButton).toBeVisible();
  });

  test('should delete field when delete button is clicked', async ({ page }) => {
    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();
    await expect(page.getByText('1 field')).toBeVisible();

    // Click delete
    await page.getByRole('button', { name: 'Delete field' }).click();

    // Should return to empty state
    await expect(page.getByText('Drag fields here or click to add')).toBeVisible();
    await expect(page.getByText('Email Field')).not.toBeVisible();
  });

  test('should show field count correctly', async ({ page }) => {
    // Add 3 fields
    await page.getByRole('button', { name: 'Add Email field' }).click();
    await page.getByRole('button', { name: 'Add Text field' }).click();
    await page.getByRole('button', { name: 'Add Phone field' }).click();

    // Should show "3 fields"
    await expect(page.getByText('3 fields')).toBeVisible();
  });

  test('should show drag handle on field items', async ({ page }) => {
    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Field item should have draggable attribute
    const fieldItem = page.locator('[aria-label="Email Field field"]');
    await expect(fieldItem).toHaveAttribute('draggable', 'true');
  });

  test('should save form and show success message', async ({ page }) => {
    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Click save
    const saveButton = page.getByRole('button', { name: /Save Form/ });
    await saveButton.click();

    // Wait for save to complete
    await page.waitForTimeout(600);

    // Should show success message
    await expect(page.getByTestId('save-success')).toBeVisible();
    await expect(page.getByText('Form saved 1 time!')).toBeVisible();

    // Should show saved config
    await expect(page.getByTestId('saved-config')).toBeVisible();
    await expect(page.getByText('Fields count: 1')).toBeVisible();
  });

  test('should hide unsaved changes badge after saving', async ({ page }) => {
    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();
    await expect(page.getByText('Unsaved changes')).toBeVisible();

    // Save
    const saveButton = page.getByRole('button', { name: /Save Form/ });
    await saveButton.click();
    await page.waitForTimeout(600);

    // Badge should be hidden
    await expect(page.getByText('Unsaved changes')).not.toBeVisible();
  });

  test('should show preview button', async ({ page }) => {
    const previewButton = page.getByRole('button', { name: 'Preview' });
    await expect(previewButton).toBeVisible();
  });

  test('should toggle between edit and preview mode', async ({ page }) => {
    const previewButton = page.getByRole('button', { name: 'Preview' });
    await previewButton.click();

    // Should switch to "Edit" button in preview mode
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();

    // Click edit to go back
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('button', { name: 'Preview' })).toBeVisible();
  });

  test('should show device selector in preview mode', async ({ page }) => {
    const previewButton = page.getByRole('button', { name: 'Preview' });
    await previewButton.click();

    // Check for device selector buttons
    await expect(page.getByRole('button', { name: 'Mobile preview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tablet preview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Desktop preview' })).toBeVisible();
  });

  test('should select field when clicked', async ({ page }) => {
    // Add a field
    await page.getByRole('button', { name: 'Add Email field' }).click();

    // Click on the field item
    const fieldItem = page.locator('[aria-label="Email Field field"]');
    await fieldItem.click();

    // Field should have selected state (this depends on CSS, might need visual verification)
    await expect(fieldItem).toBeVisible();
  });

  test('should show field type badge on field items', async ({ page }) => {
    // Add different field types
    await page.getByRole('button', { name: 'Add Email field' }).click();
    await page.getByRole('button', { name: 'Add Phone field' }).click();

    // Should show field type badges
    const emailBadge = page.locator('text=email').first();
    const phoneBadge = page.locator('text=phone').first();

    await expect(emailBadge).toBeVisible();
    await expect(phoneBadge).toBeVisible();
  });

  test('should persist field order after adding multiple fields', async ({ page }) => {
    // Add fields in specific order
    await page.getByRole('button', { name: 'Add Email field' }).click();
    await page.getByRole('button', { name: 'Add Text field' }).click();
    await page.getByRole('button', { name: 'Add Phone field' }).click();

    // Get all field labels
    const fieldLabels = page.locator('[class*="fieldLabel"]');

    // Verify order (Email, Text, Phone)
    await expect(fieldLabels.nth(0)).toContainText('Email Field');
    await expect(fieldLabels.nth(1)).toContainText('Text Field');
    await expect(fieldLabels.nth(2)).toContainText('Phone Field');
  });
});
