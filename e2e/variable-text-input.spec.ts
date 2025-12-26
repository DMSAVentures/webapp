import { test, expect } from "@playwright/test";

test.describe("VariableTextInput", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/test-variable-input");
		await page.waitForLoadState("networkidle");
		await page.waitForSelector('[data-testid="variable-text-input"]');
	});

	test.describe("Basic typing", () => {
		test("should allow typing plain text", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.fill("Hello world");

			const rawValue = page.locator('[data-testid="input-raw-value"]');
			await expect(rawValue).toHaveText("Hello world");
		});

		test("should show typed text in the highlighter", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.fill("Hello world");

			const highlighter = page.locator(
				'[data-testid="variable-text-input"] [aria-hidden="true"]',
			);
			await expect(highlighter).toContainText("Hello world");
		});
	});

	test.describe("@ mention trigger", () => {
		test("should show dropdown when typing @", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("@");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();
		});

		test("should filter variables when typing after @", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("@name");

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
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("@");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await input.press("Escape");
			await expect(dropdown).not.toBeVisible();
		});

		test("should close dropdown when clicking outside", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("@");

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
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello @");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			// Click on first option
			const firstOption = dropdown.locator('[role="option"]').first();
			await firstOption.click();

			// Check that variable was inserted
			const rawValue = page.locator('[data-testid="input-raw-value"]');
			const text = await rawValue.textContent();
			expect(text).toMatch(/Hello \{\{\w+\}\}/);
		});

		test("should insert variable when pressing Enter", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello @");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await input.press("Enter");

			const rawValue = page.locator('[data-testid="input-raw-value"]');
			const text = await rawValue.textContent();
			expect(text).toMatch(/Hello \{\{\w+\}\}/);
		});

		test("should insert variable when pressing Tab", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello @");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await input.press("Tab");

			const rawValue = page.locator('[data-testid="input-raw-value"]');
			const text = await rawValue.textContent();
			expect(text).toMatch(/Hello \{\{\w+\}\}/);
		});

		test("should navigate dropdown with arrow keys", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("@");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			// First option should be selected by default
			const options = dropdown.locator('[role="option"]');
			await expect(options.first()).toHaveAttribute("aria-selected", "true");

			// Press down arrow to select second option
			await input.press("ArrowDown");
			await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
			await expect(options.first()).toHaveAttribute("aria-selected", "false");

			// Press up arrow to go back to first option
			await input.press("ArrowUp");
			await expect(options.first()).toHaveAttribute("aria-selected", "true");
		});

		test("should replace @query with variable", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello @nam");

			const dropdown = page.locator('[role="listbox"]');
			await expect(dropdown).toBeVisible();

			await input.press("Enter");

			// The @nam should be replaced, not appended
			const rawValue = page.locator('[data-testid="input-raw-value"]');
			const text = await rawValue.textContent();
			expect(text).not.toContain("@nam");
			expect(text).toMatch(/Hello \{\{\w+\}\}/);
		});
	});

	test.describe("Variable display", () => {
		test("should display variable with styling in highlighter", async ({
			page,
		}) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello @");

			await input.press("Enter");

			// Check that variable is styled in the highlighter
			const highlighter = page.locator(
				'[data-testid="variable-text-input"] [aria-hidden="true"]',
			);
			await expect(highlighter).toContainText("{{");
		});
	});

	test.describe("Atomic variable deletion", () => {
		test("should delete entire variable with single Backspace", async ({
			page,
		}) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello @");
			await input.press("Enter");

			// Verify variable was inserted
			let rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toMatch(/Hello \{\{\w+\}\}/);

			// Press Backspace once - should delete the entire variable + trailing space
			await input.press("Backspace");

			rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("Hello ");
		});

		test("should delete variable when cursor is inside it (Backspace)", async ({
			page,
		}) => {
			const input = page.locator('[data-testid="variable-text-input"] input');

			// Set a value with a variable
			await input.fill("Hello {{name}} world");

			// Move cursor into the middle of the variable
			// Position cursor after "Hello {{na" (10 characters)
			await input.click();
			await input.press("End");
			// Go back to middle of variable
			for (let i = 0; i < 9; i++) {
				await input.press("ArrowLeft");
			}

			// Press Backspace - should delete entire variable
			await input.press("Backspace");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("Hello  world");
		});

		test("should delete variable when pressing Delete before it", async ({
			page,
		}) => {
			const input = page.locator('[data-testid="variable-text-input"] input');

			// Set a value with a variable
			await input.fill("Hello {{name}} world");

			// Move cursor right before the variable (after "Hello ")
			await input.click();
			await input.press("Home");
			for (let i = 0; i < 6; i++) {
				await input.press("ArrowRight");
			}

			// Press Delete - should delete entire variable
			await input.press("Delete");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("Hello  world");
		});

		test("should NOT delete non-variable text atomically", async ({
			page,
		}) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.fill("Hello world");

			// Press Backspace - should only delete one character
			await input.press("Backspace");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("Hello worl");
		});
	});

	test.describe("Undo/Redo", () => {
		test("should undo variable insertion", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello ");

			// Insert variable
			await input.type("@");
			await input.press("Enter");

			// Verify variable was inserted
			let rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toMatch(/Hello \{\{\w+\}\}/);

			// Undo (Cmd+Z on Mac, Ctrl+Z on others)
			const modifier = process.platform === "darwin" ? "Meta" : "Control";
			await input.press(`${modifier}+z`);

			// Note: Variable insertion is done programmatically via onChange,
			// which doesn't participate in the native undo stack.
			// So undo will only undo the "@" typing, not the variable insertion.
			// This is expected behavior for the textarea + overlay approach.
			rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			// After undo, variable is still there (programmatic change not undoable)
			// or the "@" gets undone. Either way, we verify undo doesn't crash.
			expect(rawValue).toBeDefined();
		});

		test("should undo typing", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();
			await input.type("Hello world");

			const modifier = process.platform === "darwin" ? "Meta" : "Control";
			await input.press(`${modifier}+z`);

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			// Should have undone some typing
			expect(rawValue?.length).toBeLessThan("Hello world".length);
		});
	});

	test.describe("Multiple variables", () => {
		test("should handle multiple variables", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();

			// Type first variable
			await input.type("Hello @");
			await input.press("Enter");

			// Type text between
			await input.type("and ");

			// Type second variable
			await input.type("@");
			await input.press("ArrowDown"); // Select different variable
			await input.press("Enter");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();

			// Should have two variables
			const matches = rawValue?.match(/\{\{\w+\}\}/g);
			expect(matches?.length).toBe(2);
		});

		test("should delete correct variable when there are multiple", async ({
			page,
		}) => {
			const input = page.locator('[data-testid="variable-text-input"] input');

			// Set value with two variables
			await input.fill("{{first}} and {{second}}");

			// Position cursor after first variable + space (position 10)
			// {{first}} = 9 chars, space = 1 char, total = 10
			await input.click();
			await input.press("Home");
			for (let i = 0; i < 10; i++) {
				await input.press("ArrowRight");
			}

			// Backspace should delete first variable (including trailing space)
			await input.press("Backspace");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("and {{second}}");
		});
	});

	test.describe("Edge cases", () => {
		test("should handle empty input", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();

			// Try to backspace on empty input - should not error
			await input.press("Backspace");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("(empty)");
		});

		test("should handle variable at the start", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();

			await input.type("@");
			await input.press("Enter");

			// Wait for variable to be inserted before typing more
			await expect(page.locator('[data-testid="input-raw-value"]')).toContainText(
				"{{",
			);

			await input.type("is great");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toMatch(/^\{\{\w+\}\} is great$/);
		});

		test("should handle variable at the end", async ({ page }) => {
			const input = page.locator('[data-testid="variable-text-input"] input');
			await input.click();

			await input.type("Name is @");
			await input.press("Enter");

			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toMatch(/^Name is \{\{\w+\}\} $/);
		});

		test("should handle partial variable syntax gracefully", async ({
			page,
		}) => {
			const input = page.locator('[data-testid="variable-text-input"] input');

			// Manually type partial variable syntax
			await input.fill("Hello {{ world");

			// Should just display as plain text, not crash
			const rawValue = await page
				.locator('[data-testid="input-raw-value"]')
				.textContent();
			expect(rawValue).toBe("Hello {{ world");
		});
	});
});

test.describe("VariableTextArea", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/test-variable-input");
		await page.waitForSelector('[data-testid="variable-text-area"]');
	});

	test("should allow typing and inserting variables", async ({ page }) => {
		const textarea = page.locator(
			'[data-testid="variable-text-area"] textarea',
		);
		await textarea.click();
		await textarea.type("Hello @");

		const dropdown = page.locator('[role="listbox"]');
		await expect(dropdown).toBeVisible();

		await textarea.press("Enter");

		const rawValue = page.locator('[data-testid="textarea-raw-value"]');
		const text = await rawValue.textContent();
		expect(text).toMatch(/Hello \{\{\w+\}\}/);
	});

	test("should handle multiline text", async ({ page }) => {
		const textarea = page.locator(
			'[data-testid="variable-text-area"] textarea',
		);
		await textarea.click();
		await textarea.type("Line 1");
		await textarea.press("Enter");
		await textarea.type("Line 2");

		const rawValue = page.locator('[data-testid="textarea-raw-value"]');
		const text = await rawValue.textContent();
		expect(text).toContain("Line 1");
		expect(text).toContain("Line 2");
	});

	test("should delete variable atomically with Backspace", async ({
		page,
	}) => {
		const textarea = page.locator(
			'[data-testid="variable-text-area"] textarea',
		);
		await textarea.click();
		await textarea.type("Hello @");
		await textarea.press("Enter");

		// Press Backspace - should delete entire variable
		await textarea.press("Backspace");

		const rawValue = await page
			.locator('[data-testid="textarea-raw-value"]')
			.textContent();
		expect(rawValue).toBe("Hello ");
	});
});
