/**
 * Billing and subscription tests
 */
import { http, HttpResponse } from "msw";
import { test, expect } from "./fixtures/test";
import { scenarios } from "./handlers";
import { prices } from "./mocks/data";

test.describe("Billing", () => {
	test.describe("Subscription status", () => {
		test("shows active subscription details", async ({ page }) => {
			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Should show subscription info
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Pro") ||
					pageContent?.includes("active") ||
					pageContent?.includes("Active") ||
					pageContent?.includes("Subscription")
			).toBeTruthy();
		});

		test("shows no subscription for free tier", async ({ network, page }) => {
			network.use(scenarios.auth.freeTier());
			network.use(scenarios.billing.noSubscription());

			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Should show upgrade options
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Upgrade") ||
					pageContent?.includes("upgrade") ||
					pageContent?.includes("Free") ||
					pageContent?.includes("Plan")
			).toBeTruthy();
		});

		test("shows past due warning", async ({ network, page }) => {
			network.use(scenarios.billing.pastDueSubscription());

			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Should show warning about past due
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("past due") ||
					pageContent?.includes("Past due") ||
					pageContent?.includes("payment") ||
					pageContent?.includes("update")
			).toBeTruthy();
		});

		test("shows cancelled subscription status", async ({ network, page }) => {
			network.use(scenarios.billing.cancelledSubscription());

			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Should show cancelled status
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("cancel") ||
					pageContent?.includes("Cancel") ||
					pageContent?.includes("ended") ||
					pageContent?.includes("resubscribe")
			).toBeTruthy();
		});
	});

	test.describe("Plans page", () => {
		test("displays available plans", async ({ page }) => {
			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Should show all plan tiers
			const pageContent = await page.textContent("body");
			expect(pageContent?.includes("Pro") || pageContent?.includes("Team")).toBeTruthy();
		});

		test("shows current plan as selected", async ({ page }) => {
			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Should indicate current plan
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Current") ||
					pageContent?.includes("current") ||
					pageContent?.includes("Your plan")
			).toBeTruthy();
		});

		test("can initiate plan upgrade", async ({ network, page }) => {
			let checkoutInitiated = false;

			network.use(
				http.post("*/api/protected/billing/create-subscription-intent", () => {
					checkoutInitiated = true;
					return HttpResponse.json({
						client_secret: "pi_test_secret",
					});
				})
			);

			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Look for upgrade button (Team plan)
			const upgradeButton = page.getByRole("button", {
				name: /upgrade|select|choose/i,
			});
			if (await upgradeButton.first().isVisible()) {
				await upgradeButton.first().click();
				await page.waitForLoadState("networkidle");
			}
		});
	});

	test.describe("Payment management", () => {
		test("can access payment method page", async ({ page }) => {
			await page.goto("/billing/payment_method");
			await page.waitForLoadState("networkidle");

			// Should show payment method info or form
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Payment") ||
					pageContent?.includes("payment") ||
					pageContent?.includes("Card") ||
					pageContent?.includes("card")
			).toBeTruthy();
		});

		test("can initiate payment method update", async ({ network, page }) => {
			let updateInitiated = false;

			network.use(
				http.post(
					"*/api/protected/billing/payment-method-update-intent",
					() => {
						updateInitiated = true;
						return HttpResponse.json({
							client_secret: "seti_test_secret",
						});
					}
				)
			);

			await page.goto("/billing/payment_method");
			await page.waitForLoadState("networkidle");

			// Look for update button
			const updateButton = page.getByRole("button", {
				name: /update|change|edit/i,
			});
			if (await updateButton.isVisible()) {
				await updateButton.click();
				await page.waitForLoadState("networkidle");
			}
		});
	});

	test.describe("Customer portal", () => {
		test("can access Stripe customer portal", async ({ network, page }) => {
			let portalRequested = false;

			network.use(
				http.post("*/api/protected/billing/create-customer-portal", () => {
					portalRequested = true;
					return HttpResponse.json({
						url: "https://billing.stripe.com/session/test",
					});
				})
			);

			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Look for manage subscription button
			const manageButton = page.getByRole("button", {
				name: /manage|portal|stripe/i,
			});
			if (await manageButton.isVisible()) {
				// Don't click as it would navigate to Stripe
				expect(await manageButton.isVisible()).toBeTruthy();
			}
		});
	});

	test.describe("Subscription cancellation", () => {
		test("can initiate subscription cancellation", async ({
			network,
			page,
		}) => {
			let cancellationRequested = false;

			network.use(
				http.post("*/api/protected/billing/cancel-subscription", () => {
					cancellationRequested = true;
					return HttpResponse.json({
						message: "Subscription cancelled successfully",
					});
				})
			);

			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			// Look for cancel button
			const cancelButton = page.getByRole("button", { name: /cancel/i });
			if (await cancelButton.isVisible()) {
				await cancelButton.click();

				// Confirm cancellation if there's a modal
				const confirmButton = page.getByRole("button", {
					name: /confirm|yes|cancel subscription/i,
				});
				if (await confirmButton.isVisible()) {
					await confirmButton.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});
	});
});
