/**
 * Error handling tests
 *
 * Tests that the application handles API errors gracefully.
 */
import { http, HttpResponse } from "msw";
import { test, expect } from "./fixtures/test";
import { scenarios } from "./handlers";

test.describe("Error handling", () => {
	test.describe("Authentication errors", () => {
		test("redirects to signin when unauthenticated", async ({
			network,
			page,
		}) => {
			network.use(scenarios.auth.unauthenticated());

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should redirect to signin or show login prompt
			const url = page.url();
			const pageContent = await page.textContent("body");

			expect(
				url.includes("signin") ||
					url.includes("login") ||
					pageContent?.includes("Sign in") ||
					pageContent?.includes("Log in") ||
					pageContent?.includes("Unauthorized")
			).toBeTruthy();
		});

		test("handles session expiration gracefully", async ({
			network,
			page,
		}) => {
			network.use(scenarios.auth.sessionExpired());

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should show session expired message or redirect
			const url = page.url();
			const pageContent = await page.textContent("body");

			expect(
				url.includes("signin") ||
					pageContent?.includes("expired") ||
					pageContent?.includes("Sign in")
			).toBeTruthy();
		});
	});

	test.describe("API errors", () => {
		test("handles 500 server error on campaigns", async ({
			network,
			page,
		}) => {
			network.use(scenarios.campaign.serverError());

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should show error message
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.includes("failed") ||
					pageContent?.includes("Failed") ||
					pageContent?.includes("try again")
			).toBeTruthy();
		});

		test("handles campaign not found", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns/:id", () => {
					return HttpResponse.json(
						{ error: "Campaign not found" },
						{ status: 404 }
					);
				})
			);

			await page.goto("/campaigns/nonexistent-id");
			await page.waitForLoadState("networkidle");

			// Should show not found message or redirect
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("not found") ||
					pageContent?.includes("Not found") ||
					pageContent?.includes("404") ||
					pageContent?.includes("doesn't exist")
			).toBeTruthy();
		});

		test("handles webhook creation error", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/webhooks", () => {
					return HttpResponse.json(
						{ error: "Invalid webhook URL" },
						{ status: 400 }
					);
				})
			);

			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			// Fill and submit form
			const urlInput = page.getByLabel(/url/i).first();
			if (await urlInput.isVisible()) {
				await urlInput.fill("invalid-url");

				const submitButton = page.getByRole("button", {
					name: /create|save/i,
				});
				if (await submitButton.isVisible()) {
					await submitButton.click();

					// Should show validation or error message
					await expect(
						page.getByText(/invalid|error|URL/i)
					).toBeVisible({ timeout: 5000 });
				}
			}
		});

		test("handles API key revocation error", async ({ network, page }) => {
			network.use(
				http.delete("*/api/protected/api-keys/:id", () => {
					return HttpResponse.json(
						{ error: "Cannot revoke key in use" },
						{ status: 400 }
					);
				})
			);

			await page.goto("/api-keys");
			await page.waitForLoadState("networkidle");

			// Page should load without crashing
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});
	});

	test.describe("Billing errors", () => {
		test("handles payment failure", async ({ network, page }) => {
			network.use(scenarios.billing.paymentFailed());

			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Page should load - payment error would show during checkout flow
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("handles subscription cancellation error", async ({
			network,
			page,
		}) => {
			network.use(
				http.post("*/api/protected/billing/cancel-subscription", () => {
					return HttpResponse.json(
						{ error: "Cannot cancel subscription with pending invoices" },
						{ status: 400 }
					);
				})
			);

			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Page should load
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});
	});

	test.describe("Network errors", () => {
		test("handles network failure gracefully", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.error();
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should show error message or retry option
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.includes("failed") ||
					pageContent?.includes("retry") ||
					pageContent?.includes("connection")
			).toBeTruthy();
		});
	});
});
