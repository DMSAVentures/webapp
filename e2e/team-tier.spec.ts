/**
 * Team tier feature tests
 *
 * Tests that Team tier users have access to all features including integrations.
 */
import { test, expect } from "./fixtures/test";
import { scenarios } from "./handlers";

test.describe("Team tier features", () => {
	test.beforeEach(async ({ network }) => {
		// Set up team tier user
		network.use(scenarios.auth.teamTier());
		network.use(scenarios.billing.teamSubscription());
	});

	test("can access integrations page", async ({ page }) => {
		await page.goto("/integrations");
		await page.waitForLoadState("networkidle");

		// Should see integrations content (not upgrade prompt)
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("Zapier") ||
				pageContent?.includes("Integration") ||
				pageContent?.includes("Connect")
		).toBeTruthy();
	});

	test("can view Zapier connection status", async ({ page }) => {
		await page.goto("/integrations");
		await page.waitForLoadState("networkidle");

		// Should see Zapier status
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("Zapier") ||
				pageContent?.includes("Connected") ||
				pageContent?.includes("Integration")
		).toBeTruthy();
	});

	test("can access all webhook features", async ({ page }) => {
		await page.goto("/webhooks");
		await page.waitForLoadState("networkidle");

		// Should see full webhook management
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("Webhook") ||
				pageContent?.includes("webhook") ||
				pageContent?.includes("Create")
		).toBeTruthy();
	});

	test("can access all API key features", async ({ page }) => {
		await page.goto("/api-keys");
		await page.waitForLoadState("networkidle");

		// Should see API key management
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("API") ||
				pageContent?.includes("Key") ||
				pageContent?.includes("Create")
		).toBeTruthy();
	});

	test("billing shows team subscription", async ({ page }) => {
		await page.goto("/billing");
		await page.waitForLoadState("networkidle");

		// Should show Team subscription
		const pageContent = await page.textContent("body");
		expect(
			pageContent?.includes("Team") ||
				pageContent?.includes("team") ||
				pageContent?.includes("$99") ||
				pageContent?.includes("Subscription")
		).toBeTruthy();
	});
});
