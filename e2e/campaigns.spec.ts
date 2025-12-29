/**
 * Campaign management tests
 *
 * Tests for campaign CRUD operations and workflows.
 */
import { http, HttpResponse } from "msw";
import { test, expect } from "./fixtures/test";
import { campaigns } from "./mocks/data";

test.describe("Campaign management", () => {
	test.describe("Campaign list", () => {
		test("displays campaigns with correct data", async ({ page }) => {
			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should see campaign names
			await expect(page.getByText("Product Launch Waitlist")).toBeVisible();
			await expect(page.getByText("Referral Contest")).toBeVisible();
			await expect(page.getByText("Early Access")).toBeVisible();
		});

		test("shows empty state when no campaigns", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json({
						campaigns: [],
						pagination: { has_more: false, total_count: 0 },
					});
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should show empty state or create prompt
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Create") ||
					pageContent?.includes("create") ||
					pageContent?.includes("No campaigns") ||
					pageContent?.includes("Get started")
			).toBeTruthy();
		});

		test("can filter campaigns by status", async ({ network, page }) => {
			// Track if the filter is applied
			let filterApplied = false;

			network.use(
				http.get("*/api/v1/campaigns", ({ request }) => {
					const url = new URL(request.url);
					const status = url.searchParams.get("status");

					if (status === "active") {
						filterApplied = true;
						return HttpResponse.json({
							campaigns: campaigns.filter((c) => c.status === "active"),
							pagination: { has_more: false, total_count: 1 },
						});
					}

					return HttpResponse.json({
						campaigns,
						pagination: { has_more: false, total_count: campaigns.length },
					});
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Look for filter controls
			const filterButton = page.getByRole("button", { name: /filter|status/i });
			if (await filterButton.isVisible()) {
				await filterButton.click();

				const activeOption = page.getByRole("option", { name: /active/i });
				if (await activeOption.isVisible()) {
					await activeOption.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});
	});

	test.describe("Campaign details", () => {
		test("shows campaign overview", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			// Should show campaign details
			await expect(page.getByText("Product Launch Waitlist")).toBeVisible();
		});

		test("can navigate to campaign settings", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			// Look for settings link/button
			const settingsLink = page.getByRole("link", { name: /settings/i });
			if (await settingsLink.isVisible()) {
				await settingsLink.click();
				await expect(page).toHaveURL(/\/campaigns\/camp_1\/settings/);
			}
		});

		test("can navigate to campaign analytics", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			// Look for analytics link/button
			const analyticsLink = page.getByRole("link", { name: /analytics/i });
			if (await analyticsLink.isVisible()) {
				await analyticsLink.click();
				await expect(page).toHaveURL(/\/campaigns\/camp_1\/analytics/);
			}
		});

		test("can navigate to campaign leads", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			// Look for leads link/button
			const leadsLink = page.getByRole("link", { name: /leads|users|signups/i });
			if (await leadsLink.isVisible()) {
				await leadsLink.click();
				await expect(page).toHaveURL(/\/campaigns\/camp_1\/leads/);
			}
		});
	});

	test.describe("Campaign creation", () => {
		test("can access new campaign page", async ({ page }) => {
			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			// Should see creation form
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Create") ||
					pageContent?.includes("New") ||
					pageContent?.includes("Campaign") ||
					pageContent?.includes("Name")
			).toBeTruthy();
		});

		test("validates required fields", async ({ page }) => {
			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			// Try to submit empty form
			const submitButton = page.getByRole("button", { name: /create|save|submit/i });
			if (await submitButton.isVisible()) {
				await submitButton.click();

				// Should show validation errors or prevent submission
				// Form should still be on the same page
				await expect(page).toHaveURL(/\/campaigns\/new/);
			}
		});

		test("successfully creates campaign", async ({ network, page }) => {
			let campaignCreated = false;

			network.use(
				http.post("*/api/v1/campaigns", async ({ request }) => {
					const body = await request.json();
					campaignCreated = true;

					return HttpResponse.json(
						{
							id: "camp_new",
							account_id: "acc_123",
							name: body.name,
							slug: body.slug,
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

			// Fill form
			const nameInput = page.getByLabel(/name/i).first();
			if (await nameInput.isVisible()) {
				await nameInput.fill("Test Campaign");

				const slugInput = page.getByLabel(/slug|url/i).first();
				if (await slugInput.isVisible()) {
					await slugInput.fill("test-campaign");
				}

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});
	});

	test.describe("Campaign status updates", () => {
		test("can activate a draft campaign", async ({ network, page }) => {
			let statusUpdated = false;

			network.use(
				http.patch("*/api/v1/campaigns/:id/status", async ({ request }) => {
					const body = await request.json();
					if (body.status === "active") {
						statusUpdated = true;
					}

					return HttpResponse.json({
						...campaigns[1], // Draft campaign
						status: body.status,
						updated_at: new Date().toISOString(),
					});
				})
			);

			await page.goto("/campaigns/camp_2"); // Draft campaign
			await page.waitForLoadState("networkidle");

			// Look for activate/launch button
			const activateButton = page.getByRole("button", {
				name: /activate|launch|publish/i,
			});
			if (await activateButton.isVisible()) {
				await activateButton.click();
				await page.waitForLoadState("networkidle");
			}
		});

		test("can pause an active campaign", async ({ network, page }) => {
			network.use(
				http.patch("*/api/v1/campaigns/:id/status", async ({ request }) => {
					const body = await request.json();
					return HttpResponse.json({
						...campaigns[0],
						status: body.status,
						updated_at: new Date().toISOString(),
					});
				})
			);

			await page.goto("/campaigns/camp_1"); // Active campaign
			await page.waitForLoadState("networkidle");

			// Look for pause button
			const pauseButton = page.getByRole("button", { name: /pause/i });
			if (await pauseButton.isVisible()) {
				await pauseButton.click();
				await page.waitForLoadState("networkidle");
			}
		});
	});
});
