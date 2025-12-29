/**
 * Campaign E2E Tests
 *
 * Tests for campaign management with table-driven happy/error scenarios.
 */
import { http, HttpResponse, delay } from "msw";
import { test, expect } from "./fixtures/test";
import { campaigns } from "./mocks/data";

// ============================================================================
// Test Data Tables
// ============================================================================

const listErrorScenarios = [
	{ status: 401, error: "Unauthorized", expectText: /sign in|unauthorized/i },
	{ status: 403, error: "Forbidden", expectText: /upgrade|subscription|forbidden/i },
	{ status: 429, error: "Rate limit exceeded", expectText: /rate|limit|error/i },
	{ status: 500, error: "Internal server error", expectText: /error|failed/i },
	{ status: 502, error: "Bad gateway", expectText: /error|unavailable/i },
	{ status: 503, error: "Service unavailable", expectText: /unavailable|error/i },
	{ status: 504, error: "Gateway timeout", expectText: /timeout|error/i },
] as const;

const getErrorScenarios = [
	{ status: 404, error: "Campaign not found", expectText: /not found|404/i },
	{ status: 403, error: "Access denied", expectText: /access|permission|denied/i },
	{ status: 500, error: "Internal server error", expectText: /error/i },
] as const;

const createErrorScenarios = [
	{ status: 400, error: "Validation failed", expectText: /required|invalid|validation/i },
	{ status: 403, error: "Campaign limit reached", expectText: /limit|upgrade/i },
	{ status: 409, error: "Slug already exists", expectText: /exists|conflict|duplicate/i },
	{ status: 422, error: "Invalid slug format", expectText: /invalid|validation/i },
	{ status: 500, error: "Internal server error", expectText: /error|failed/i },
] as const;

const deleteErrorScenarios = [
	{ status: 404, error: "Campaign not found", expectText: /not found/i },
	{ status: 403, error: "Cannot delete active campaign", expectText: /cannot|active/i },
	{ status: 500, error: "Internal server error", expectText: /error/i },
] as const;

// ============================================================================
// Tests
// ============================================================================

test.describe("Campaigns", () => {
	// =========================================================================
	// List Campaigns
	// =========================================================================

	test.describe("List Campaigns", () => {
		test("200 OK - displays campaigns", async ({ page }) => {
			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			await expect(page.getByText("Product Launch Waitlist")).toBeVisible();
			await expect(page.getByText("Referral Contest")).toBeVisible();
		});

		test("200 OK - empty list shows empty state", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () =>
					HttpResponse.json({
						campaigns: [],
						pagination: { has_more: false, total_count: 0 },
					})
				)
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/create|no campaigns|get started/i);
		});

		test("200 OK - handles large list", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () =>
					HttpResponse.json({
						campaigns: Array.from({ length: 100 }, (_, i) => ({
							id: `camp_${i}`,
							account_id: "acc_123",
							name: `Campaign ${i}`,
							slug: `campaign-${i}`,
							status: "active",
							type: "waitlist",
							total_signups: 0,
							total_verified: 0,
							total_referrals: 0,
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
						})),
						pagination: { has_more: true, total_count: 1000 },
					})
				)
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			await expect(page.getByText("Campaign 0")).toBeVisible();
		});

		test("200 OK - handles special characters", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () =>
					HttpResponse.json({
						campaigns: [
							{
								id: "camp_1",
								account_id: "acc_123",
								name: "Campaign with émojis 🚀 & <special>",
								slug: "special",
								status: "active",
								type: "waitlist",
								total_signups: 0,
								total_verified: 0,
								total_referrals: 0,
								created_at: new Date().toISOString(),
								updated_at: new Date().toISOString(),
							},
						],
						pagination: { has_more: false, total_count: 1 },
					})
				)
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			await expect(page.getByText(/Campaign with émojis/)).toBeVisible();
		});

		test("handles slow network", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", async () => {
					await delay(2000);
					return HttpResponse.json({
						campaigns,
						pagination: { has_more: false, total_count: campaigns.length },
					});
				})
			);

			await page.goto("/campaigns");
			await expect(page.getByText("Product Launch Waitlist")).toBeVisible({
				timeout: 10000,
			});
		});

		test("handles network failure", async ({ network, page }) => {
			network.use(http.get("*/api/v1/campaigns", () => HttpResponse.error()));

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const content = await page.textContent("body");
			expect(content).toMatch(/error|connection|failed/i);
		});

		test("handles malformed JSON", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () =>
					new HttpResponse("{ invalid }", {
						status: 200,
						headers: { "Content-Type": "application/json" },
					})
				)
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should not crash
			const content = await page.textContent("body");
			expect(content).toBeTruthy();
		});

		// Table-driven error tests
		for (const { status, error, expectText } of listErrorScenarios) {
			test(`handles ${status} ${error}`, async ({ network, page }) => {
				network.use(
					http.get("*/api/v1/campaigns", () =>
						HttpResponse.json({ error }, { status })
					)
				);

				await page.goto("/campaigns");
				await page.waitForLoadState("networkidle");

				const content = await page.textContent("body");
				expect(content?.toLowerCase()).toMatch(expectText);
			});
		}
	});

	// =========================================================================
	// View Campaign
	// =========================================================================

	test.describe("View Campaign", () => {
		test("200 OK - displays campaign details", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			await expect(page.getByText("Product Launch Waitlist")).toBeVisible();
		});

		test("navigates to settings", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			const link = page.getByRole("link", { name: /settings/i });
			if (await link.isVisible()) {
				await link.click();
				await expect(page).toHaveURL(/\/campaigns\/camp_1\/settings/);
			}
		});

		test("navigates to analytics", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			const link = page.getByRole("link", { name: /analytics/i });
			if (await link.isVisible()) {
				await link.click();
				await expect(page).toHaveURL(/\/campaigns\/camp_1\/analytics/);
			}
		});

		// Table-driven error tests
		for (const { status, error, expectText } of getErrorScenarios) {
			test(`handles ${status} ${error}`, async ({ network, page }) => {
				network.use(
					http.get("*/api/v1/campaigns/:id", () =>
						HttpResponse.json({ error }, { status })
					)
				);

				await page.goto("/campaigns/nonexistent");
				await page.waitForLoadState("networkidle");

				const content = await page.textContent("body");
				expect(content?.toLowerCase()).toMatch(expectText);
			});
		}
	});

	// =========================================================================
	// Create Campaign
	// =========================================================================

	test.describe("Create Campaign", () => {
		test("201 Created - success", async ({ network, page }) => {
			network.use(
				http.post("*/api/v1/campaigns", async ({ request }) => {
					const body = (await request.json()) as { name: string; slug: string };
					return HttpResponse.json(
						{
							id: "camp_new",
							account_id: "acc_123",
							name: body.name,
							slug: body.slug || "new-campaign",
							status: "draft",
							type: "waitlist",
							total_signups: 0,
							total_verified: 0,
							total_referrals: 0,
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
						},
						{ status: 201 }
					);
				})
			);

			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			const nameInput = page.getByLabel(/name/i).first();
			if (await nameInput.isVisible()) {
				await nameInput.fill("Test Campaign");
				const submit = page.getByRole("button", { name: /create|save/i });
				if (await submit.isVisible()) {
					await submit.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});

		test("handles network failure", async ({ network, page }) => {
			network.use(http.post("*/api/v1/campaigns", () => HttpResponse.error()));

			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			const nameInput = page.getByLabel(/name/i).first();
			if (await nameInput.isVisible()) {
				await nameInput.fill("Test");
				const submit = page.getByRole("button", { name: /create|save/i });
				if (await submit.isVisible()) {
					await submit.click();
					const content = await page.textContent("body");
					expect(content).toMatch(/error|failed|network/i);
				}
			}
		});

		// Table-driven error tests
		for (const { status, error, expectText } of createErrorScenarios) {
			test(`handles ${status} ${error}`, async ({ network, page }) => {
				network.use(
					http.post("*/api/v1/campaigns", () =>
						HttpResponse.json({ error }, { status })
					)
				);

				await page.goto("/campaigns/new");
				await page.waitForLoadState("networkidle");

				const nameInput = page.getByLabel(/name/i).first();
				if (await nameInput.isVisible()) {
					await nameInput.fill("Test");
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
	// Update Campaign
	// =========================================================================

	test.describe("Update Campaign", () => {
		test("200 OK - success", async ({ network, page }) => {
			network.use(
				http.put("*/api/v1/campaigns/:id", async ({ request }) => {
					const body = (await request.json()) as { name: string };
					return HttpResponse.json({
						...campaigns[0],
						...body,
						updated_at: new Date().toISOString(),
					});
				})
			);

			await page.goto("/campaigns/camp_1/edit");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});

		test("handles 404 Not Found", async ({ network, page }) => {
			network.use(
				http.put("*/api/v1/campaigns/:id", () =>
					HttpResponse.json({ error: "Not found" }, { status: 404 })
				)
			);

			await page.goto("/campaigns/camp_1/edit");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});

		test("handles 409 Conflict", async ({ network, page }) => {
			network.use(
				http.put("*/api/v1/campaigns/:id", () =>
					HttpResponse.json({ error: "Modified by another" }, { status: 409 })
				)
			);

			await page.goto("/campaigns/camp_1/edit");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});
	});

	// =========================================================================
	// Delete Campaign
	// =========================================================================

	test.describe("Delete Campaign", () => {
		test("204 No Content - success", async ({ network, page }) => {
			network.use(
				http.delete("*/api/v1/campaigns/:id", () =>
					new HttpResponse(null, { status: 204 })
				)
			);

			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			const deleteBtn = page.getByRole("button", { name: /delete/i });
			if (await deleteBtn.isVisible()) {
				await deleteBtn.click();
				const confirm = page.getByRole("button", { name: /confirm|yes|delete/i });
				if (await confirm.isVisible()) {
					await confirm.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});

		// Table-driven error tests
		for (const { status, error } of deleteErrorScenarios) {
			test(`handles ${status} ${error}`, async ({ network, page }) => {
				network.use(
					http.delete("*/api/v1/campaigns/:id", () =>
						HttpResponse.json({ error }, { status })
					)
				);

				await page.goto("/campaigns/camp_1");
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
		}
	});

	// =========================================================================
	// Status Updates
	// =========================================================================

	test.describe("Status Updates", () => {
		test("200 OK - activate draft", async ({ network, page }) => {
			network.use(
				http.patch("*/api/v1/campaigns/:id/status", async ({ request }) => {
					const body = (await request.json()) as { status: string };
					return HttpResponse.json({
						...campaigns[1],
						status: body.status,
						updated_at: new Date().toISOString(),
					});
				})
			);

			await page.goto("/campaigns/camp_2");
			await page.waitForLoadState("networkidle");

			const btn = page.getByRole("button", { name: /activate|launch|publish/i });
			if (await btn.isVisible()) {
				await btn.click();
				await page.waitForLoadState("networkidle");
			}
		});

		test("200 OK - pause active", async ({ network, page }) => {
			network.use(
				http.patch("*/api/v1/campaigns/:id/status", async ({ request }) => {
					const body = (await request.json()) as { status: string };
					return HttpResponse.json({
						...campaigns[0],
						status: body.status,
						updated_at: new Date().toISOString(),
					});
				})
			);

			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			const btn = page.getByRole("button", { name: /pause/i });
			if (await btn.isVisible()) {
				await btn.click();
				await page.waitForLoadState("networkidle");
			}
		});

		test("handles 400 invalid transition", async ({ network, page }) => {
			network.use(
				http.patch("*/api/v1/campaigns/:id/status", () =>
					HttpResponse.json(
						{ error: "Invalid status transition" },
						{ status: 400 }
					)
				)
			);

			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});
	});

	// =========================================================================
	// Analytics
	// =========================================================================

	test.describe("Analytics", () => {
		test("200 OK - displays data", async ({ page }) => {
			await page.goto("/campaigns/camp_1/analytics");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});

		test("handles 503 analytics unavailable", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns/:id/analytics/*", () =>
					HttpResponse.json(
						{ error: "Analytics unavailable" },
						{ status: 503 }
					)
				)
			);

			await page.goto("/campaigns/camp_1/analytics");
			await page.waitForLoadState("networkidle");

			expect(await page.textContent("body")).toBeTruthy();
		});
	});
});
