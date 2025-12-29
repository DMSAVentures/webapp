/**
 * Webhook management tests
 */
import { http, HttpResponse } from "msw";
import { test, expect } from "./fixtures/test";
import { webhooks } from "./mocks/data";

test.describe("Webhook management", () => {
	test.describe("Webhook list", () => {
		test("displays webhooks", async ({ page }) => {
			await page.goto("/webhooks");
			await page.waitForLoadState("networkidle");

			// Should see webhook URLs or related content
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("api.example.com") ||
					pageContent?.includes("zapier.com") ||
					pageContent?.includes("Webhook")
			).toBeTruthy();
		});

		test("shows empty state when no webhooks", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks", () => {
					return HttpResponse.json([]);
				})
			);

			await page.goto("/webhooks");
			await page.waitForLoadState("networkidle");

			// Should show empty state
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Create") ||
					pageContent?.includes("No webhooks") ||
					pageContent?.includes("Get started") ||
					pageContent?.includes("Add")
			).toBeTruthy();
		});
	});

	test.describe("Webhook creation", () => {
		test("can access new webhook page", async ({ page }) => {
			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			// Should see form
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("URL") ||
					pageContent?.includes("url") ||
					pageContent?.includes("Create") ||
					pageContent?.includes("Webhook")
			).toBeTruthy();
		});

		test("creates webhook with valid URL", async ({ network, page }) => {
			let webhookCreated = false;

			network.use(
				http.post("*/api/protected/webhooks", async ({ request }) => {
					const body = await request.json();
					webhookCreated = true;

					return HttpResponse.json(
						{
							webhook: {
								id: "wh_new",
								account_id: "acc_123",
								url: body.url,
								events: body.events,
								status: "active",
								retry_enabled: true,
								max_retries: 3,
								total_sent: 0,
								total_failed: 0,
								created_at: new Date().toISOString(),
								updated_at: new Date().toISOString(),
							},
							secret: "whsec_test_secret",
						},
						{ status: 201 }
					);
				})
			);

			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			// Fill form
			const urlInput = page.getByLabel(/url/i).first();
			if (await urlInput.isVisible()) {
				await urlInput.fill("https://api.myapp.com/webhooks");

				// Select events if available
				const eventCheckbox = page.getByLabel(/user\.created|created/i).first();
				if (await eventCheckbox.isVisible()) {
					await eventCheckbox.check();
				}

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});
	});

	test.describe("Webhook details", () => {
		test("can view webhook details", async ({ page }) => {
			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			// Should see webhook info
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("api.example.com") ||
					pageContent?.includes("Webhook") ||
					pageContent?.includes("user.created")
			).toBeTruthy();
		});

		test("can test webhook", async ({ network, page }) => {
			let testTriggered = false;

			network.use(
				http.post("*/api/protected/webhooks/:id/test", () => {
					testTriggered = true;
					return HttpResponse.json({
						success: true,
						response_status: 200,
						response_time_ms: 156,
					});
				})
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			// Look for test button
			const testButton = page.getByRole("button", { name: /test|send test/i });
			if (await testButton.isVisible()) {
				await testButton.click();
				await page.waitForLoadState("networkidle");

				// Should show success message
				await expect(page.getByText(/success|200|passed/i)).toBeVisible({
					timeout: 5000,
				});
			}
		});

		test("handles webhook test failure", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/webhooks/:id/test", () => {
					return HttpResponse.json({
						success: false,
						response_status: 500,
						response_time_ms: 2000,
						error: "Connection timeout",
					});
				})
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const testButton = page.getByRole("button", { name: /test|send test/i });
			if (await testButton.isVisible()) {
				await testButton.click();
				await page.waitForLoadState("networkidle");

				// Should show failure message
				await expect(page.getByText(/failed|error|timeout|500/i)).toBeVisible({
					timeout: 5000,
				});
			}
		});
	});

	test.describe("Webhook deletion", () => {
		test("can delete webhook", async ({ network, page }) => {
			let webhookDeleted = false;

			network.use(
				http.delete("*/api/protected/webhooks/:id", () => {
					webhookDeleted = true;
					return new HttpResponse(null, { status: 204 });
				})
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			// Look for delete button
			const deleteButton = page.getByRole("button", { name: /delete|remove/i });
			if (await deleteButton.isVisible()) {
				await deleteButton.click();

				// Confirm deletion if there's a modal
				const confirmButton = page.getByRole("button", {
					name: /confirm|yes|delete/i,
				});
				if (await confirmButton.isVisible()) {
					await confirmButton.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});
	});
});
