/**
 * Webhook API handlers
 */
import { HttpResponse, http } from "msw";
import type {
	ApiCreateWebhookResponse,
	ApiWebhook,
} from "../../src/api/types/webhook";
import { webhooks } from "../mocks/data";

/**
 * Default webhook handlers
 */
export const webhookHandlers = [
	// List webhooks
	http.get("*/api/protected/webhooks", () => {
		return HttpResponse.json(webhooks);
	}),

	// Get single webhook
	http.get("*/api/protected/webhooks/:id", ({ params }) => {
		const webhook = webhooks.find((w) => w.id === params.id);
		if (!webhook) {
			return HttpResponse.json({ error: "Webhook not found" }, { status: 404 });
		}
		return HttpResponse.json(webhook);
	}),

	// Create webhook
	http.post("*/api/protected/webhooks", async ({ request }) => {
		const body = (await request.json()) as Partial<ApiWebhook>;
		const now = new Date().toISOString();

		const newWebhook: ApiWebhook = {
			id: `wh_${Date.now()}`,
			account_id: "acc_123",
			url: body.url || "",
			events: body.events || [],
			status: "active",
			retry_enabled: body.retry_enabled ?? true,
			max_retries: body.max_retries ?? 3,
			total_sent: 0,
			total_failed: 0,
			created_at: now,
			updated_at: now,
		};

		const response: ApiCreateWebhookResponse = {
			webhook: newWebhook,
			secret: "whsec_test_secret_12345",
		};

		return HttpResponse.json(response, { status: 201 });
	}),

	// Update webhook
	http.patch("*/api/protected/webhooks/:id", async ({ params, request }) => {
		const webhook = webhooks.find((w) => w.id === params.id);
		if (!webhook) {
			return HttpResponse.json({ error: "Webhook not found" }, { status: 404 });
		}

		const body = (await request.json()) as Partial<ApiWebhook>;
		const updatedWebhook = {
			...webhook,
			...body,
			updated_at: new Date().toISOString(),
		};

		return HttpResponse.json(updatedWebhook);
	}),

	// Delete webhook
	http.delete("*/api/protected/webhooks/:id", ({ params }) => {
		const webhook = webhooks.find((w) => w.id === params.id);
		if (!webhook) {
			return HttpResponse.json({ error: "Webhook not found" }, { status: 404 });
		}
		return new HttpResponse(null, { status: 204 });
	}),

	// Test webhook
	http.post("*/api/protected/webhooks/:id/test", ({ params }) => {
		const webhook = webhooks.find((w) => w.id === params.id);
		if (!webhook) {
			return HttpResponse.json({ error: "Webhook not found" }, { status: 404 });
		}
		return HttpResponse.json({
			success: true,
			response_status: 200,
			response_time_ms: 156,
		});
	}),

	// Get webhook deliveries
	http.get("*/api/protected/webhooks/:id/deliveries", ({ request }) => {
		const url = new URL(request.url);
		const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);

		return HttpResponse.json({
			deliveries: [],
			total: 0,
			pagination: {
				page,
				limit,
				offset: (page - 1) * limit,
			},
		});
	}),
];

/**
 * Handler factories for different webhook scenarios
 */
export const webhookScenarios = {
	/** No webhooks */
	noWebhooks: () =>
		http.get("*/api/protected/webhooks", () => {
			return HttpResponse.json([]);
		}),

	/** Feature not available (free tier) */
	featureNotAvailable: () =>
		http.get("*/api/protected/webhooks", () => {
			return HttpResponse.json(
				{ error: "Webhooks require a Pro or Team subscription" },
				{ status: 403 },
			);
		}),

	/** Webhook test failure */
	testFailure: () =>
		http.post("*/api/protected/webhooks/:id/test", () => {
			return HttpResponse.json({
				success: false,
				response_status: 500,
				response_time_ms: 2000,
				error: "Connection timeout",
			});
		}),
};
