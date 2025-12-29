/**
 * API Key handlers
 */
import { http, HttpResponse } from "msw";
import { apiKeys, apiKeyScopes } from "../mocks/data";
import type { ApiAPIKey, ApiCreateAPIKeyResponse } from "../../src/api/types/apikey";

/**
 * Default API key handlers
 */
export const apikeyHandlers = [
	// List API keys
	http.get("*/api/protected/api-keys", () => {
		return HttpResponse.json(apiKeys);
	}),

	// Get available scopes
	http.get("*/api/protected/api-keys/scopes", () => {
		return HttpResponse.json({ scopes: apiKeyScopes });
	}),

	// Create API key
	http.post("*/api/protected/api-keys", async ({ request }) => {
		const body = (await request.json()) as { name: string; scopes: string[] };
		const now = new Date().toISOString();

		const response: ApiCreateAPIKeyResponse = {
			id: `key_${Date.now()}`,
			name: body.name,
			key: "wl_live_sk_test_1234567890abcdef", // Only returned on creation
			key_prefix: "wl_live_sk_",
			scopes: body.scopes,
			created_at: now,
		};

		return HttpResponse.json(response, { status: 201 });
	}),

	// Update API key (rename)
	http.patch("*/api/protected/api-keys/:id", async ({ params, request }) => {
		const apiKey = apiKeys.find((k) => k.id === params.id);
		if (!apiKey) {
			return HttpResponse.json(
				{ error: "API key not found" },
				{ status: 404 }
			);
		}

		const body = (await request.json()) as { name: string };
		const updatedKey: ApiAPIKey = {
			...apiKey,
			name: body.name,
		};

		return HttpResponse.json(updatedKey);
	}),

	// Revoke API key
	http.delete("*/api/protected/api-keys/:id", ({ params }) => {
		const apiKey = apiKeys.find((k) => k.id === params.id);
		if (!apiKey) {
			return HttpResponse.json(
				{ error: "API key not found" },
				{ status: 404 }
			);
		}
		return new HttpResponse(null, { status: 204 });
	}),
];

/**
 * Handler factories for different API key scenarios
 */
export const apikeyScenarios = {
	/** No API keys */
	noApiKeys: () =>
		http.get("*/api/protected/api-keys", () => {
			return HttpResponse.json([]);
		}),

	/** Feature not available (free tier) */
	featureNotAvailable: () =>
		http.get("*/api/protected/api-keys", () => {
			return HttpResponse.json(
				{ error: "API access requires a Pro or Team subscription" },
				{ status: 403 }
			);
		}),

	/** Key limit reached */
	keyLimitReached: () =>
		http.post("*/api/protected/api-keys", () => {
			return HttpResponse.json(
				{ error: "Maximum API key limit reached" },
				{ status: 403 }
			);
		}),
};
