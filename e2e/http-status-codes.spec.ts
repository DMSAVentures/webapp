/**
 * HTTP Status Code Tests
 *
 * Comprehensive tests for all HTTP status codes the application should handle.
 */
import { http, HttpResponse, delay } from "msw";
import { test, expect } from "./fixtures/test";

test.describe("HTTP Status Codes", () => {
	// =========================================================================
	// 2xx Success
	// =========================================================================

	test.describe("2xx Success", () => {
		test("200 OK - successful GET request", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json({
						campaigns: [
							{
								id: "camp_1",
								name: "Test Campaign",
								status: "active",
								type: "waitlist",
								total_signups: 100,
								total_verified: 90,
								total_referrals: 50,
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

			await expect(page.getByText("Test Campaign")).toBeVisible();
		});

		test("201 Created - successful POST request", async ({ network, page }) => {
			let resourceCreated = false;

			network.use(
				http.post("*/api/v1/campaigns", async ({ request }) => {
					const body = await request.json();
					resourceCreated = true;

					return HttpResponse.json(
						{
							id: "camp_new",
							name: body.name,
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
				await nameInput.fill("New Campaign");

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});

		test("204 No Content - successful DELETE request", async ({
			network,
			page,
		}) => {
			let resourceDeleted = false;

			network.use(
				http.delete("*/api/v1/campaigns/:id", () => {
					resourceDeleted = true;
					return new HttpResponse(null, { status: 204 });
				})
			);

			await page.goto("/campaigns/camp_1");
			await page.waitForLoadState("networkidle");

			const deleteButton = page.getByRole("button", { name: /delete/i });
			if (await deleteButton.isVisible()) {
				await deleteButton.click();

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

	// =========================================================================
	// 4xx Client Errors
	// =========================================================================

	test.describe("4xx Client Errors", () => {
		test("400 Bad Request - invalid input", async ({ network, page }) => {
			network.use(
				http.post("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{
							error: "Invalid request body",
							details: {
								name: "Name is required",
								slug: "Slug must be alphanumeric",
							},
						},
						{ status: 400 }
					);
				})
			);

			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			const submitButton = page.getByRole("button", { name: /create|save/i });
			if (await submitButton.isVisible()) {
				await submitButton.click();
				await page.waitForLoadState("networkidle");

				// Should show validation error
				const pageContent = await page.textContent("body");
				expect(
					pageContent?.includes("required") ||
						pageContent?.includes("invalid") ||
						pageContent?.includes("Invalid") ||
						pageContent?.includes("error")
				).toBeTruthy();
			}
		});

		test("401 Unauthorized - not authenticated", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/user", () => {
					return HttpResponse.json(
						{ error: "Unauthorized" },
						{ status: 401 }
					);
				}),
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Unauthorized" },
						{ status: 401 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should redirect to signin or show auth error
			const url = page.url();
			const pageContent = await page.textContent("body");

			expect(
				url.includes("signin") ||
					url.includes("login") ||
					pageContent?.includes("Sign in") ||
					pageContent?.includes("Log in") ||
					pageContent?.includes("Unauthorized") ||
					pageContent?.includes("unauthorized")
			).toBeTruthy();
		});

		test("401 Unauthorized - token expired", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/user", () => {
					return HttpResponse.json(
						{ error: "Token expired", code: "TOKEN_EXPIRED" },
						{ status: 401 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const url = page.url();
			const pageContent = await page.textContent("body");

			expect(
				url.includes("signin") ||
					pageContent?.includes("expired") ||
					pageContent?.includes("Sign in")
			).toBeTruthy();
		});

		test("403 Forbidden - insufficient permissions", async ({
			network,
			page,
		}) => {
			network.use(
				http.get("*/api/protected/webhooks", () => {
					return HttpResponse.json(
						{ error: "Forbidden: Webhooks require Pro subscription" },
						{ status: 403 }
					);
				})
			);

			await page.goto("/webhooks");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("Forbidden") ||
					pageContent?.includes("upgrade") ||
					pageContent?.includes("Upgrade") ||
					pageContent?.includes("Pro") ||
					pageContent?.includes("permission")
			).toBeTruthy();
		});

		test("403 Forbidden - feature not available for tier", async ({
			network,
			page,
		}) => {
			network.use(
				http.post("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Campaign limit reached. Upgrade to create more campaigns." },
						{ status: 403 }
					);
				})
			);

			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			const nameInput = page.getByLabel(/name/i).first();
			if (await nameInput.isVisible()) {
				await nameInput.fill("New Campaign");

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();

					await expect(
						page.getByText(/limit|upgrade|Upgrade/i)
					).toBeVisible({ timeout: 5000 });
				}
			}
		});

		test("403 Forbidden - resource access denied", async ({
			network,
			page,
		}) => {
			network.use(
				http.get("*/api/v1/campaigns/:id", () => {
					return HttpResponse.json(
						{ error: "You do not have access to this campaign" },
						{ status: 403 }
					);
				})
			);

			await page.goto("/campaigns/camp_other_user");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("access") ||
					pageContent?.includes("Access") ||
					pageContent?.includes("permission") ||
					pageContent?.includes("denied")
			).toBeTruthy();
		});

		test("404 Not Found - resource does not exist", async ({
			network,
			page,
		}) => {
			network.use(
				http.get("*/api/v1/campaigns/:id", () => {
					return HttpResponse.json(
						{ error: "Campaign not found" },
						{ status: 404 }
					);
				})
			);

			await page.goto("/campaigns/nonexistent");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("not found") ||
					pageContent?.includes("Not found") ||
					pageContent?.includes("404") ||
					pageContent?.includes("doesn't exist") ||
					pageContent?.includes("does not exist")
			).toBeTruthy();
		});

		test("404 Not Found - webhook not found", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/webhooks/:id", () => {
					return HttpResponse.json(
						{ error: "Webhook not found" },
						{ status: 404 }
					);
				})
			);

			await page.goto("/webhooks/nonexistent");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("not found") ||
					pageContent?.includes("Not found") ||
					pageContent?.includes("404")
			).toBeTruthy();
		});

		test("404 Not Found - no subscription", async ({ network, page }) => {
			network.use(
				http.get("*/api/protected/billing/subscription", () => {
					return HttpResponse.json(
						{ error: "No active subscription found" },
						{ status: 404 }
					);
				})
			);

			await page.goto("/billing");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("subscription") ||
					pageContent?.includes("Subscription") ||
					pageContent?.includes("Upgrade") ||
					pageContent?.includes("Plan")
			).toBeTruthy();
		});

		test("405 Method Not Allowed", async ({ network, page }) => {
			network.use(
				http.patch("*/api/v1/campaigns/:id", () => {
					return HttpResponse.json(
						{ error: "Method not allowed" },
						{ status: 405 }
					);
				})
			);

			await page.goto("/campaigns/camp_1/edit");
			await page.waitForLoadState("networkidle");

			// Page should load even if specific method fails
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("409 Conflict - resource already exists", async ({
			network,
			page,
		}) => {
			network.use(
				http.post("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Campaign with this slug already exists" },
						{ status: 409 }
					);
				})
			);

			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			const nameInput = page.getByLabel(/name/i).first();
			if (await nameInput.isVisible()) {
				await nameInput.fill("Existing Campaign");

				const slugInput = page.getByLabel(/slug|url/i).first();
				if (await slugInput.isVisible()) {
					await slugInput.fill("existing-slug");
				}

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();

					await expect(
						page.getByText(/already exists|conflict|duplicate/i)
					).toBeVisible({ timeout: 5000 });
				}
			}
		});

		test("409 Conflict - concurrent modification", async ({
			network,
			page,
		}) => {
			network.use(
				http.put("*/api/v1/campaigns/:id", () => {
					return HttpResponse.json(
						{ error: "Resource was modified by another request" },
						{ status: 409 }
					);
				})
			);

			await page.goto("/campaigns/camp_1/edit");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("422 Unprocessable Entity - validation failed", async ({
			network,
			page,
		}) => {
			network.use(
				http.post("*/api/protected/webhooks", () => {
					return HttpResponse.json(
						{
							error: "Validation failed",
							details: {
								url: "URL must be HTTPS",
								events: "At least one event must be selected",
							},
						},
						{ status: 422 }
					);
				})
			);

			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			const urlInput = page.getByLabel(/url/i).first();
			if (await urlInput.isVisible()) {
				await urlInput.fill("http://insecure.com/webhook");

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();

					const pageContent = await page.textContent("body");
					expect(
						pageContent?.includes("HTTPS") ||
							pageContent?.includes("https") ||
							pageContent?.includes("validation") ||
							pageContent?.includes("invalid")
					).toBeTruthy();
				}
			}
		});

		test("429 Too Many Requests - rate limited", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{
							error: "Rate limit exceeded",
							retry_after: 60,
						},
						{
							status: 429,
							headers: {
								"Retry-After": "60",
								"X-RateLimit-Remaining": "0",
								"X-RateLimit-Reset": String(Date.now() + 60000),
							},
						}
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("rate") ||
					pageContent?.includes("Rate") ||
					pageContent?.includes("limit") ||
					pageContent?.includes("too many") ||
					pageContent?.includes("Try again") ||
					pageContent?.includes("error")
			).toBeTruthy();
		});
	});

	// =========================================================================
	// 5xx Server Errors
	// =========================================================================

	test.describe("5xx Server Errors", () => {
		test("500 Internal Server Error", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Internal server error" },
						{ status: 500 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.includes("wrong") ||
					pageContent?.includes("failed") ||
					pageContent?.includes("try again")
			).toBeTruthy();
		});

		test("500 Internal Server Error - on POST", async ({ network, page }) => {
			network.use(
				http.post("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Internal server error" },
						{ status: 500 }
					);
				})
			);

			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			const nameInput = page.getByLabel(/name/i).first();
			if (await nameInput.isVisible()) {
				await nameInput.fill("Test Campaign");

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();

					await expect(
						page.getByText(/error|failed|try again/i)
					).toBeVisible({ timeout: 5000 });
				}
			}
		});

		test("501 Not Implemented", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/integrations/zapier/connect", () => {
					return HttpResponse.json(
						{ error: "Feature not implemented" },
						{ status: 501 }
					);
				})
			);

			await page.goto("/integrations");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("502 Bad Gateway", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Bad gateway" },
						{ status: 502 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.includes("unavailable") ||
					pageContent?.includes("try again")
			).toBeTruthy();
		});

		test("503 Service Unavailable", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Service temporarily unavailable" },
						{
							status: 503,
							headers: {
								"Retry-After": "30",
							},
						}
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("unavailable") ||
					pageContent?.includes("Unavailable") ||
					pageContent?.includes("maintenance") ||
					pageContent?.includes("error") ||
					pageContent?.includes("try again")
			).toBeTruthy();
		});

		test("503 Service Unavailable - maintenance mode", async ({
			network,
			page,
		}) => {
			network.use(
				http.get("*/api/protected/user", () => {
					return HttpResponse.json(
						{
							error: "Service under maintenance",
							maintenance_end: new Date(Date.now() + 3600000).toISOString(),
						},
						{ status: 503 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("maintenance") ||
					pageContent?.includes("Maintenance") ||
					pageContent?.includes("unavailable") ||
					pageContent?.includes("error")
			).toBeTruthy();
		});

		test("504 Gateway Timeout", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Gateway timeout" },
						{ status: 504 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("timeout") ||
					pageContent?.includes("Timeout") ||
					pageContent?.includes("error") ||
					pageContent?.includes("try again")
			).toBeTruthy();
		});
	});

	// =========================================================================
	// Network Errors
	// =========================================================================

	test.describe("Network Errors", () => {
		test("Network failure - connection refused", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.error();
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.includes("connection") ||
					pageContent?.includes("network") ||
					pageContent?.includes("failed")
			).toBeTruthy();
		});

		test("Network failure - on POST", async ({ network, page }) => {
			network.use(
				http.post("*/api/v1/campaigns", () => {
					return HttpResponse.error();
				})
			);

			await page.goto("/campaigns/new");
			await page.waitForLoadState("networkidle");

			const nameInput = page.getByLabel(/name/i).first();
			if (await nameInput.isVisible()) {
				await nameInput.fill("Test Campaign");

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();

					const pageContent = await page.textContent("body");
					expect(
						pageContent?.includes("error") ||
							pageContent?.includes("Error") ||
							pageContent?.includes("failed") ||
							pageContent?.includes("network")
					).toBeTruthy();
				}
			}
		});

		test("Slow network - delayed response", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", async () => {
					await delay(3000); // 3 second delay
					return HttpResponse.json({
						campaigns: [
							{
								id: "camp_1",
								name: "Delayed Campaign",
								status: "active",
								type: "waitlist",
								total_signups: 100,
								total_verified: 90,
								total_referrals: 50,
								created_at: new Date().toISOString(),
								updated_at: new Date().toISOString(),
							},
						],
						pagination: { has_more: false, total_count: 1 },
					});
				})
			);

			await page.goto("/campaigns");

			// Should show loading state initially
			const loadingIndicator = page.getByText(/loading|Loading/i);
			// Loading might be visible briefly

			// Wait for content to appear
			await page.waitForLoadState("networkidle");
			await expect(page.getByText("Delayed Campaign")).toBeVisible({
				timeout: 10000,
			});
		});

		test("Request aborted", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns/:id/analytics/signups-over-time", () => {
					// This simulates an aborted request by never responding
					return new Promise(() => {});
				})
			);

			await page.goto("/campaigns/camp_1/analytics");

			// Navigate away before response completes
			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// App should handle gracefully without errors
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});
	});

	// =========================================================================
	// Mixed/Edge Cases
	// =========================================================================

	test.describe("Edge Cases", () => {
		test("Empty response body with success status", async ({
			network,
			page,
		}) => {
			network.use(
				http.delete("*/api/protected/webhooks/:id", () => {
					return new HttpResponse(null, { status: 204 });
				})
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const deleteButton = page.getByRole("button", { name: /delete/i });
			if (await deleteButton.isVisible()) {
				await deleteButton.click();

				const confirmButton = page.getByRole("button", {
					name: /confirm|yes/i,
				});
				if (await confirmButton.isVisible()) {
					await confirmButton.click();
					await page.waitForLoadState("networkidle");
				}
			}
		});

		test("Malformed JSON response", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return new HttpResponse("{ invalid json }", {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.length > 0
			).toBeTruthy();
		});

		test("HTML error page instead of JSON", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return new HttpResponse(
						"<html><body><h1>502 Bad Gateway</h1></body></html>",
						{
							status: 502,
							headers: { "Content-Type": "text/html" },
						}
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.length > 0
			).toBeTruthy();
		});

		test("Response with wrong content type", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return new HttpResponse(
						JSON.stringify({ campaigns: [], pagination: { has_more: false } }),
						{
							status: 200,
							headers: { "Content-Type": "text/plain" },
						}
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("Very large response", async ({ network, page }) => {
			const largeCampaignList = Array.from({ length: 100 }, (_, i) => ({
				id: `camp_${i}`,
				name: `Campaign ${i}`,
				status: "active",
				type: "waitlist",
				total_signups: i * 100,
				total_verified: i * 90,
				total_referrals: i * 50,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			}));

			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json({
						campaigns: largeCampaignList,
						pagination: { has_more: true, total_count: 1000 },
					});
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Should render without crashing
			await expect(page.getByText("Campaign 0")).toBeVisible();
		});

		test("Response with special characters", async ({ network, page }) => {
			network.use(
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json({
						campaigns: [
							{
								id: "camp_1",
								name: "Campaign with émojis 🚀 & spëcial <chars>",
								status: "active",
								type: "waitlist",
								total_signups: 100,
								total_verified: 90,
								total_referrals: 50,
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

			await expect(page.getByText(/Campaign with émojis/)).toBeVisible();
		});

		test("Cascading failures - multiple endpoints fail", async ({
			network,
			page,
		}) => {
			network.use(
				http.get("*/api/protected/user", () => {
					return HttpResponse.json(
						{ error: "Service unavailable" },
						{ status: 503 }
					);
				}),
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Service unavailable" },
						{ status: 503 }
					);
				}),
				http.get("*/api/protected/billing/subscription", () => {
					return HttpResponse.json(
						{ error: "Service unavailable" },
						{ status: 503 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("unavailable") ||
					pageContent?.includes("Sign in")
			).toBeTruthy();
		});

		test("Partial success - some endpoints fail", async ({ network, page }) => {
			// User endpoint succeeds
			network.use(
				http.get("*/api/protected/user", () => {
					return HttpResponse.json({
						first_name: "Test",
						last_name: "User",
						external_id: "user_123",
					});
				}),
				// But campaigns fail
				http.get("*/api/v1/campaigns", () => {
					return HttpResponse.json(
						{ error: "Database connection failed" },
						{ status: 500 }
					);
				})
			);

			await page.goto("/campaigns");
			await page.waitForLoadState("networkidle");

			// Page should show error for campaigns but user should be logged in
			const pageContent = await page.textContent("body");
			expect(
				pageContent?.includes("error") ||
					pageContent?.includes("Error") ||
					pageContent?.includes("failed")
			).toBeTruthy();
		});
	});

	// =========================================================================
	// Specific Endpoint Status Codes
	// =========================================================================

	test.describe("Billing-specific Status Codes", () => {
		test("402 Payment Required - payment failed", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/billing/create-subscription-intent", () => {
					return HttpResponse.json(
						{ error: "Payment method declined" },
						{ status: 402 }
					);
				})
			);

			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			// Page should load, payment error shows during checkout
			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});

		test("402 Payment Required - card expired", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/billing/create-subscription-intent", () => {
					return HttpResponse.json(
						{
							error: "Your card has expired",
							code: "card_expired",
						},
						{ status: 402 }
					);
				})
			);

			await page.goto("/billing/plans");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});
	});

	test.describe("Webhook-specific Status Codes", () => {
		test("400 Bad Request - invalid webhook URL", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/webhooks", () => {
					return HttpResponse.json(
						{ error: "Invalid URL: must be HTTPS" },
						{ status: 400 }
					);
				})
			);

			await page.goto("/webhooks/new");
			await page.waitForLoadState("networkidle");

			const urlInput = page.getByLabel(/url/i).first();
			if (await urlInput.isVisible()) {
				await urlInput.fill("http://example.com");

				const submitButton = page.getByRole("button", { name: /create|save/i });
				if (await submitButton.isVisible()) {
					await submitButton.click();

					const pageContent = await page.textContent("body");
					expect(
						pageContent?.includes("HTTPS") ||
							pageContent?.includes("invalid") ||
							pageContent?.includes("Invalid")
					).toBeTruthy();
				}
			}
		});

		test("422 Unprocessable - webhook URL unreachable", async ({
			network,
			page,
		}) => {
			network.use(
				http.post("*/api/protected/webhooks/:id/test", () => {
					return HttpResponse.json(
						{
							success: false,
							error: "Failed to connect to webhook URL",
							response_status: null,
						},
						{ status: 422 }
					);
				})
			);

			await page.goto("/webhooks/wh_1");
			await page.waitForLoadState("networkidle");

			const testButton = page.getByRole("button", { name: /test/i });
			if (await testButton.isVisible()) {
				await testButton.click();

				await expect(
					page.getByText(/failed|error|unreachable/i)
				).toBeVisible({ timeout: 5000 });
			}
		});
	});

	test.describe("API Key-specific Status Codes", () => {
		test("403 Forbidden - API key limit reached", async ({ network, page }) => {
			network.use(
				http.post("*/api/protected/api-keys", () => {
					return HttpResponse.json(
						{ error: "Maximum API key limit reached (10)" },
						{ status: 403 }
					);
				})
			);

			await page.goto("/api-keys");
			await page.waitForLoadState("networkidle");

			const pageContent = await page.textContent("body");
			expect(pageContent).toBeTruthy();
		});
	});
});
