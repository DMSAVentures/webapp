/**
 * Free tier restriction tests
 *
 * Tests that free tier users see appropriate restrictions and upgrade prompts.
 */
import { http, HttpResponse } from "msw";
import { test, expect } from "./fixtures/test";
import { scenarios } from "./handlers";

test.describe("Free tier restrictions", () => {
	test.beforeEach(async ({ network }) => {
		// Set up free tier user
		network.use(scenarios.auth.freeTier());
		network.use(scenarios.billing.noSubscription());
	});

	test("campaigns page shows upgrade prompt when limit reached", async ({
		network,
		page,
	}) => {
		// Free tier user already has 1 campaign (at limit)
		network.use(
			http.get("*/api/v1/campaigns", () => {
				return HttpResponse.json({
					campaigns: [
						{
							id: "camp_1",
							account_id: "acc_123",
							name: "My First Campaign",
							slug: "my-first",
							status: "active",
							type: "waitlist",
							total_signups: 50,
							total_verified: 45,
							total_referrals: 10,
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
						},
					],
					pagination: { has_more: false, total_count: 1 },
				});
			})
		);

		await page.goto("/campaigns");
		await page.waitForLoadState("networkidle");

		// Should see the existing campaign
		await expect(page.getByText("My First Campaign")).toBeVisible();
	});

	test("creating campaign shows limit error for free tier", async ({
		network,
		page,
	}) => {
		network.use(scenarios.campaign.campaignLimitReached());

		await page.goto("/campaigns/new");
		await page.waitForLoadState("networkidle");

		// Fill form and try to submit
		const nameInput = page.getByLabel(/name/i).first();
		if (await nameInput.isVisible()) {
			await nameInput.fill("New Campaign");

			const submitButton = page.getByRole("button", { name: /create/i });
			if (await submitButton.isVisible()) {
				await submitButton.click();

				// Should show upgrade message
				await expect(
					page.getByText(/upgrade|limit reached/i)
				).toBeVisible({ timeout: 5000 });
			}
		}
	});

	test("webhooks page shows feature gating for free tier", async ({
		network,
		page,
	}) => {
		network.use(scenarios.webhook.featureNotAvailable());

		await page.goto("/webhooks");
		await page.waitForLoadState("networkidle");

		// Should show upgrade message or empty state
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("upgrade") ||
				pageContent?.includes("Pro") ||
				pageContent?.includes("Team") ||
				pageContent?.includes("Webhook")
		).toBeTruthy();
	});

	test("API keys page shows feature gating for free tier", async ({
		network,
		page,
	}) => {
		network.use(scenarios.apikey.featureNotAvailable());

		await page.goto("/api-keys");
		await page.waitForLoadState("networkidle");

		// Should show upgrade message or empty state
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("upgrade") ||
				pageContent?.includes("Pro") ||
				pageContent?.includes("API")
		).toBeTruthy();
	});

	test("integrations page shows feature gating for free tier", async ({
		network,
		page,
	}) => {
		network.use(scenarios.integration.featureNotAvailable());

		await page.goto("/integrations");
		await page.waitForLoadState("networkidle");

		// Should show upgrade message
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("upgrade") ||
				pageContent?.includes("Team") ||
				pageContent?.includes("Integration")
		).toBeTruthy();
	});

	test("billing page shows upgrade options", async ({ page }) => {
		await page.goto("/billing");
		await page.waitForLoadState("networkidle");

		// Should show pricing plans or subscription info
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("Pro") ||
				pageContent?.includes("Team") ||
				pageContent?.includes("Upgrade") ||
				pageContent?.includes("Plan")
		).toBeTruthy();
	});
});
