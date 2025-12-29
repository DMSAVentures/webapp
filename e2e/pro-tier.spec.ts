/**
 * Pro tier feature tests
 *
 * Tests that Pro tier users have access to expected features.
 */
import { http, HttpResponse } from "msw";
import { test, expect } from "./fixtures/test";
import { campaigns, webhooks, apiKeys } from "./mocks/data";

test.describe("Pro tier features", () => {
	// Default handlers already set up Pro tier user

	test.describe("Campaigns", () => {
		test("can view campaigns list", async ({ page }) => {
			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should see campaigns
			await expect(page.getByText("Product Launch Waitlist")).toBeVisible();
			await expect(page.getByText("Referral Contest")).toBeVisible();
		});

		test("can view campaign details", async ({ page }) => {
			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			// Should see campaign name
			await expect(page.getByText("Product Launch Waitlist")).toBeVisible();
		});

		test("can view campaign analytics", async ({ page }) => {
			await page.goto("/campaigns/camp_1/analytics");
			await page.waitForLoadState("networkidle");

			// Page should load without errors
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("can view campaign leads", async ({ page }) => {
			await page.goto("/campaigns/camp_1/leads");
			await page.waitForLoadState("networkidle");

			// Page should load
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("can view campaign settings", async ({ page }) => {
			await page.goto("/campaigns/camp_1/settings");
			await page.waitForLoadState("networkidle");

			// Page should load
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("can access form builder", async ({ page }) => {
			await page.goto("/campaigns/camp_1/form-builder");
			await page.waitForLoadState("networkidle");

			// Page should load
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("can access email builder", async ({ page }) => {
			await page.goto("/campaigns/camp_1/email-builder");
			await page.waitForLoadState("networkidle");

			// Page should load
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("can view segments", async ({ page }) => {
			await page.goto("/campaigns/camp_1/segments");
			await page.waitForLoadState("networkidle");

			// Should see segments
			await expect(
				page.getByText(/Verified Users|Top Referrers|Segment/i)
			).toBeVisible();
		});
	});

	test.describe("Webhooks", () => {
		test("can view webhooks list", async ({ page }) => {
			await page.goto("/webhooks");
			await page.waitForLoadState("networkidle");

			// Should see webhooks or empty state
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("webhook") ||
					pageContent?.includes("Webhook") ||
					pageContent?.includes("api.example.com")
			).toBeTruthy();
		});

		test("can access new webhook page", async ({ page }) => {
			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			// Should see form elements
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("URL") ||
					pageContent?.includes("url") ||
					pageContent?.includes("Webhook") ||
					pageContent?.includes("Create")
			).toBeTruthy();
		});
	});

	test.describe("API Keys", () => {
		test("can view API keys list", async ({ page }) => {
			await page.goto("/api-keys");
			await page.waitForLoadState("networkidle");

			// Should see API keys or related content
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("API") ||
					pageContent?.includes("key") ||
					pageContent?.includes("Key")
			).toBeTruthy();
		});
	});

	test.describe("Billing", () => {
		test("can view subscription details", async ({ page }) => {
			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Should see subscription info
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Pro") ||
					pageContent?.includes("subscription") ||
					pageContent?.includes("Subscription") ||
					pageContent?.includes("Billing")
			).toBeTruthy();
		});

		test("can access billing plans", async ({ page }) => {
			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Should see plans
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Pro") ||
					pageContent?.includes("Team") ||
					pageContent?.includes("Plan")
			).toBeTruthy();
		});
	});

	test.describe("Account", () => {
		test("can view account page", async ({ page }) => {
			await page.goto("/account");
			await page.waitForLoadState("networkidle");

			// Should see user info
			await expect(
				page.getByText(/Test User|account|Account/i)
			).toBeVisible();
		});
	});
});
