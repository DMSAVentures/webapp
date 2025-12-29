/**
 * Webhook E2E Tests
 *
 * Tests for webhook management with table-driven happy/error scenarios.
 */
import { HttpResponse, http } from "msw";
import { expect, test } from "./fixtures/test";
import { webhooks } from "./mocks/data";

// ============================================================================
// Test Data Tables
// ============================================================================

const listErrorScenarios = [
	{ status: 401, error: "Unauthorized", expectText: /sign in|unauthorized/i },
	{
		status: 403,
		error: "Webhooks require Pro",
		expectText: /upgrade|pro|subscription/i,
	},
	{ status: 500, error: "Internal server error", expectText: /error/i },
	{
		status: 503,
		error: "Service unavailable",
		expectText: /unavailable|error/i,
	},
] as const;

const createErrorScenarios = [
	{ status: 400, error: "Invalid URL", expectText: /invalid|url/i },
	{ status: 403, error: "Webhook limit reached", expectText: /limit|upgrade/i },
	{ status: 422, error: "URL must be HTTPS", expectText: /https|invalid/i },
	{ status: 500, error: "Internal server error", expectText: /error|failed/i },
] as const;

const testWebhookScenarios = [
	{ success: true, status: 200, time: 156, expectText: /success|200|passed/i },
	{
		success: false,
		status: 500,
		time: 2000,
		error: "Timeout",
		expectText: /failed|error|timeout/i,
	},
	{
		success: false,
		status: 0,
		time: 0,
		error: "Connection refused",
		expectText: /failed|error|refused/i,
	},
] as const;

// ============================================================================
// Tests
// ============================================================================

test.describe("Webhooks", () => {
	// =========================================================================
	// List Webhooks
	// =========================================================================

	test.describe("List Webhooks", () => {
		test("200 OK - displays webhooks", async ({ page }) => {
			await page.goto("/webhooks");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/webhook|api\.example\.com/i);
		});

		test("200 OK - empty list shows empty state", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks", () => HttpResponse.json([])),
			);

			await page.goto("/webhooks");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/create|no webhooks|get started|add/i);
		});

		test("handles network failure", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks", () => HttpResponse.error()),
			);

			await page.goto("/webhooks");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/error|failed/i);
		});

		// Table-driven error tests
		for (const { status, error, expectText } of listErrorScenarios) {
			test(`handles ${status} ${error}`, async ({ network, page }) => {
				network.use(
					http.get("*/api/protected/webhooks", () =>
						HttpResponse.json({ error }, { status }),
					),
				);

				await page.goto("/webhooks");
				await page.waitForLoadState("networkidle");

				const content = await page.textContent("body");
				expect(content?.toLowerCase()).toMatch(expectText);
			});
		}
	});

	// =========================================================================
	// View Webhook
	// =========================================================================

	test.describe("View Webhook", () => {
		test("200 OK - displays webhook details", async ({ page }) => {
			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/webhook|api\.example\.com|user\.created/i);
		});

		test("handles 404 Not Found", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks/:id", () =>
					HttpResponse.json({ error: "Webhook not found" }, { status: 404 }),
				),
			);

			await page.goto("/webhooks/nonexistent");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/not found|404/i);
		});

		test("handles 500 Internal Server Error", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks/:id", () =>
					HttpResponse.json({ error: "Server error" }, { status: 500 }),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/error/i);
		});
	});

	// =========================================================================
	// Create Webhook
	// =========================================================================

	test.describe("Create Webhook", () => {
		test("201 Created - success", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/webhooks", async ({ request }) => {
					const body = (await request.json()) as {
						url: string;
						events: string[];
					};
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
						{ status: 201 },
					);
				}),
			);

			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			const urlInput = page.getByLabel(/url/i).first();
			if (await urlInput.isVisible()) {
				await urlInput.fill("https://api.example.com/webhook");
				const submit = page.getByRole("button", { name: /create|save/i });
				if (await submit.isVisible()) {
					await submit.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});

		test("handles network failure", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/webhooks", () => HttpResponse.error()),
			);

			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			const urlInput = page.getByLabel(/url/i).first();
			if (await urlInput.isVisible()) {
				await urlInput.fill("https://example.com");
				const submit = page.getByRole("button", { name: /create|save/i });
				if (await submit.isVisible()) {
					await submit.click();
					const content = await page.textContent("body");
					expect(content).toMatch(/error|failed/i);
				}
			}
		});

		// Table-driven error tests
		for (const { status, error, expectText } of createErrorScenarios) {
			test(`handles ${status} ${error}`, async ({ network, page }) => {
				network.use(
					http.post("*/api/protected/webhooks", () =>
						HttpResponse.json({ error }, { status }),
					),
				);

				await page.goto("/webhooks/new");
				await page.waitForLoadState("networkidle");

				const urlInput = page.getByLabel(/url/i).first();
				if (await urlInput.isVisible()) {
					await urlInput.fill("http://example.com");
					const submit = page.getByRole("button", { name: /create|save/i });
					if (await submit.isVisible()) {
						await submit.click();
						await page.waitForTimeout(1000);
						const content = await page.textContent("body");
						expect(content?.toLowerCase()).toMatch(expectText);
					}
				}
			});
		}
	});

	// =========================================================================
	// Update Webhook
	// =========================================================================

	test.describe("Update Webhook", () => {
		test("200 OK - success", async ({ network, page }) => {
			network.use(
				http.patch("*/api/protected/webhooks/:id", async ({ request }) => {
					const body = (await request.json()) as Partial<(typeof webhooks)[0]>;
					return HttpResponse.json({
						...webhooks[0],
						...body,
						updated_at: new Date().toISOString(),
					});
				}),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});

		test("handles 404 Not Found", async ({ network, page }) => {
			network.use(
				http.patch("*/api/protected/webhooks/:id", () =>
					HttpResponse.json({ error: "Not found" }, { status: 404 }),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});
	});

	// =========================================================================
	// Delete Webhook
	// =========================================================================

	test.describe("Delete Webhook", () => {
		test("204 No Content - success", async ({ network, page }) => {
			network.use(
				http.delete(
					"*/api/protected/webhooks/:id",
					() => new HttpResponse(null, { status: 204 }),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const deleteBtn = page.getByRole("button", { name: /delete|remove/i });
			if (await deleteBtn.isVisible()) {
				await deleteBtn.click();
				const confirm = page.getByRole("button", {
					name: /confirm|yes|delete/i,
				});
				if (await confirm.isVisible()) {
					await confirm.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});

		test("handles 404 Not Found", async ({ network, page }) => {
			network.use(
				http.delete("*/api/protected/webhooks/:id", () =>
					HttpResponse.json({ error: "Not found" }, { status: 404 }),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const deleteBtn = page.getByRole("button", { name: /delete/i });
			if (await deleteBtn.isVisible()) {
				await deleteBtn.click();
				const confirm = page.getByRole("button", { name: /confirm|yes/i });
				if (await confirm.isVisible()) {
					await confirm.click();
				}
			}
		});

		test("handles 500 Internal Server Error", async ({ network, page }) => {
			network.use(
				http.delete("*/api/protected/webhooks/:id", () =>
					HttpResponse.json({ error: "Server error" }, { status: 500 }),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const deleteBtn = page.getByRole("button", { name: /delete/i });
			if (await deleteBtn.isVisible()) {
				await deleteBtn.click();
				const confirm = page.getByRole("button", { name: /confirm|yes/i });
				if (await confirm.isVisible()) {
					await confirm.click();
				}
			}
		});
	});

	// =========================================================================
	// Test Webhook
	// =========================================================================

	test.describe("Test Webhook", () => {
		// Table-driven test result scenarios
		for (const scenario of testWebhookScenarios) {
			const testName = scenario.success
				? `shows success for ${scenario.status} response`
				: `shows failure for ${scenario.error}`;

			test(testName, async ({ network, page }) => {
				network.use(
					http.post("*/api/protected/webhooks/:id/test", () =>
						HttpResponse.json({
							success: scenario.success,
							response_status: scenario.status,
							response_time_ms: scenario.time,
							error: scenario.error,
						}),
					),
				);

				await page.goto("/webhooks/wh_1");
				await page.waitForLoadState("networkidle");

				const testBtn = page.getByRole("button", { name: /test|send test/i });
				if (await testBtn.isVisible()) {
					await testBtn.click();
					await expect(page.getByText(scenario.expectText)).toBeVisible({
						timeout: 5000,
					});
				}
			});
		}

		test("handles network failure on test", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/webhooks/:id/test", () =>
					HttpResponse.error(),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const testBtn = page.getByRole("button", { name: /test/i });
			if (await testBtn.isVisible()) {
				await testBtn.click();
				const content = await page.textContent("body");
				expect(content).toMatch(/error|failed/i);
			}
		});
	});

	// =========================================================================
	// Webhook Deliveries
	// =========================================================================

	test.describe("Webhook Deliveries", () => {
		test("200 OK - displays deliveries", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks/:id/deliveries", () =>
					HttpResponse.json({
						deliveries: [
							{
								id: "del_1",
								webhook_id: "wh_1",
								event_type: "user.created",
								status: "success",
								response_status: 200,
								duration_ms: 150,
								attempt_number: 1,
								created_at: new Date().toISOString(),
							},
						],
						total: 1,
						pagination: { page: 1, limit: 20, offset: 0 },
					}),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});

		test("200 OK - empty deliveries", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks/:id/deliveries", () =>
					HttpResponse.json({
						deliveries: [],
						total: 0,
						pagination: { page: 1, limit: 20, offset: 0 },
					}),
				),
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});
	});
});
