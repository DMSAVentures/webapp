import { expect, type Page, test } from "@playwright/test";

test.describe("VariableTextInput", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/test-variable-input");
		await page.waitForLoadState("networkidle");
		await page.waitForSelector('[data-testid="variable-text-input"]');
	});

	// Helper to get the contentEditable editor
	const getEditor = (page: Page) =>
		page.locator('[data-testid="variable-text-input"]');

	test.describe("Basic typing", () => {
		test("should allow typing plain text", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello world");

			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toHaveText("Hello world");
		});

		test("should show typed text in the editor", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello world");

			await expect(editor).toContainText("Hello world");
		});
	});

	test.describe("@ mention trigger", () => {
		test("should show dropdown when typing @", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("@");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();
		});

		test("should filter variables when typing after @", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("@name");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			// Should show filtered results containing "name"
			const options = dropdown.locator('[role="option"]');
			const count = await options.count();
			expect(count).toBeGreaterThan(0);

			// All visible options should contain "name"
			for (let i = 0; i < count; i++) {
				const optionText = await options.nth(i).textContent();
				expect(optionText?.toLowerCase()).toContain("name");
			}
		});

		test("should close dropdown when pressing Escape", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("@");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await page.keyboard.press("Escape");
			await expect(dropdown).not.toBeVisible();
		});

		test("should close dropdown when clicking outside", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("@");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			// Click outside
			await page.click("h1");
			await expect(dropdown).not.toBeVisible();
		});
	});

	test.describe("Variable selection", () => {
		test("should insert variable when clicking on dropdown option", async ({
			page,
		}) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello @");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			// Click on first option
			const firstOption = dropdown.locator('[role="option"]').first();
			await firstOption.click();

			// Check that variable was inserted
			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toContainText("{{");
			await expect(rawValue).toContainText("}}");
		});

		test("should insert variable when pressing Enter", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello @");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await page.keyboard.press("Enter");

			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toContainText("Hello");
			await expect(rawValue).toContainText("{{");
			await expect(rawValue).toContainText("}}");
		});

		test("should insert variable when pressing Tab", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello @");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await page.keyboard.press("Tab");

			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toContainText("Hello");
			await expect(rawValue).toContainText("{{");
			await expect(rawValue).toContainText("}}");
		});

		test("should navigate dropdown with arrow keys", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("@");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			// First option should be selected by default
			const options = dropdown.locator('[role="option"]');
			await expect(options.first()).toHaveAttribute("aria-selected", "true");

			// Press down arrow to select second option
			await page.keyboard.press("ArrowDown");
			await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
			await expect(options.first()).toHaveAttribute("aria-selected", "false");

			// Press up arrow to go back to first option
			await page.keyboard.press("ArrowUp");
			await expect(options.first()).toHaveAttribute("aria-selected", "true");
		});

		test("should replace @query with variable", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello @nam");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await page.keyboard.press("Enter");

			// The @nam should be replaced, not appended
			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).not.toContainText("@nam");
			await expect(rawValue).toContainText("Hello");
			await expect(rawValue).toContainText("{{");
			await expect(rawValue).toContainText("}}");
		});
	});

	test.describe("Variable display", () => {
		test("should display variable with styling in editor", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello @");

			await page.keyboard.press("Enter");

			// Check that variable is displayed with data-variable attribute
			const variableSpan = editor.locator("[data-variable]");
			await expect(variableSpan).toBeVisible();
		});
	});

	test.describe("Atomic variable behavior", () => {
		test("should delete entire variable with single Backspace", async ({
			page,
		}) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello @");
			await page.keyboard.press("Enter");

			// Verify variable was inserted
			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toContainText("{{");

			// Press Backspace twice - first deletes trailing space, second deletes variable
			await page.keyboard.press("Backspace");
			await page.keyboard.press("Backspace");

			// Variable should be gone
			await expect(rawValue).not.toContainText("{{");
		});

		test("should have atomic variable that cannot be edited", async ({
			page,
		}) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("@");
			await page.keyboard.press("Enter");

			// Variable span should have contenteditable="false"
			const variableSpan = editor.locator("[data-variable]");
			await expect(variableSpan).toHaveAttribute("contenteditable", "false");
		});

		test("should NOT delete non-variable text atomically", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello world");

			// Press Backspace - should only delete one character
			await page.keyboard.press("Backspace");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("Hello worl");
		});
	});

	test.describe("Undo/Redo", () => {
		test("should undo typing", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();
			await page.keyboard.type("Hello world");

			const modifier = process.platform === "darwin" ? "Meta" : "Control";
			await page.keyboard.press(`${modifier}+z`);

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			// Should have undone some typing
			expect(rawValue?.length).toBeLessThan("Hello world".length);
		});
	});

	test.describe("Multiple variables", () => {
		test("should handle multiple variables", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();

			// Type first variable
			await page.keyboard.type("Hello @");
			await page.keyboard.press("Enter");

			// Wait for first variable to be inserted
			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toContainText("{{");

			// Type text between
			await page.keyboard.type("and @");

			// Select second variable (use ArrowDown to select different one)
			await page.keyboard.press("ArrowDown");
			await page.keyboard.press("Enter");

			// Should have two variables - verify by checking content
			const text = await rawValue.textContent();
			const matches = text?.match(/\{\{/g);
			expect(matches?.length).toBe(2);
		});
	});

	test.describe("Edge cases", () => {
		test("should handle empty input", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();

			// Try to backspace on empty input - should not error
			await page.keyboard.press("Backspace");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("(empty)");
		});

		test("should handle variable at the start", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();

			await page.keyboard.type("@");
			await page.keyboard.press("Enter");

			// Wait for variable to be inserted before typing more
			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toContainText("{{");

			await page.keyboard.type("is great");

			await expect(rawValue).toContainText("{{");
			await expect(rawValue).toContainText("is great");
		});

		test("should handle variable at the end", async ({ page }) => {
			const editor = getEditor(page);
			await editor.click();

			await page.keyboard.type("Name is @");
			await page.keyboard.press("Enter");

			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toContainText("Name is");
			await expect(rawValue).toContainText("{{");
		});
	});
});

test.describe("VariableTextArea", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/test-variable-input");
		await page.waitForLoadState("networkidle");
		await page.waitForSelector('[data-testid="variable-text-area"]');
	});

	const getEditor = (page: Page) =>
		page.locator('[data-testid="variable-text-area"]');

	test("should allow typing and inserting variables", async ({ page }) => {
		const editor = getEditor(page);
		await editor.click();
		await page.keyboard.type("Hello @");

		const dropdown = page.locator('[role="listbox"]');
		await expect(dropdown).toBeVisible();

		await page.keyboard.press("Enter");

		const rawValue = page.locator('[data-testid="textarea-raw-value"]');
		await expect(rawValue).toContainText("Hello");
		await expect(rawValue).toContainText("{{");
		await expect(rawValue).toContainText("}}");
	});

	test("should handle multiline text", async ({ page }) => {
		const editor = getEditor(page);
		await editor.click();
		await page.keyboard.type("Line 1");
		await page.keyboard.press("Enter");
		await page.keyboard.type("Line 2");

		const rawValue = page.locator('[data-testid="textarea-raw-value"]');
		await expect(rawValue).toContainText("Line 1");
		await expect(rawValue).toContainText("Line 2");
	});

	test("should delete variable atomically with Backspace", async ({ page }) => {
		const editor = getEditor(page);
		await editor.click();
		await page.keyboard.type("Hello @");
		await page.keyboard.press("Enter");

		// Verify variable was inserted
		const rawValue = page.locator('[data-testid="textarea-raw-value"]');
		await expect(rawValue).toContainText("{{");

		// Press Backspace twice - first deletes trailing space, second deletes variable
		await page.keyboard.press("Backspace");
		await page.keyboard.press("Backspace");

		await expect(rawValue).not.toContainText("{{");
	});

	test("should have atomic variable spans", async ({ page }) => {
		const editor = getEditor(page);
		await editor.click();
		await page.keyboard.type("@");
		await page.keyboard.press("Enter");

		// Wait for variable to be inserted
		const rawValue = page.locator('[data-testid="textarea-raw-value"]');
		await expect(rawValue).toContainText("{{");

		// Variable span should have contenteditable="false"
		const variableSpan = editor.locator("[data-variable]");
		await expect(variableSpan).toHaveAttribute("contenteditable", "false");
	});
});
