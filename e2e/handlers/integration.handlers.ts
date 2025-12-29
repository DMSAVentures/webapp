/**
 * Integration API handlers (Zapier, etc.)
 */
import { HttpResponse, http } from "msw";

/**
 * Default integration handlers
 */
export const integrationHandlers = [
	// Zapier status
	http.get("*/api/protected/integrations/zapier/status", () => {
		return HttpResponse.json({
			connected: true,
			account_name: "My Zapier Account",
			connected_at: "2025-01-01T00:00:00Z",
		});
	}),

	// Zapier subscriptions
	http.get("*/api/protected/integrations/zapier/subscriptions", () => {
		return HttpResponse.json({
			subscriptions: [
				{
					id: "zap_1",
					event: "user.created",
					zap_name: "New User → Slack",
					created_at: "2025-01-01T00:00:00Z",
				},
			],
		});
	}),

	// Disconnect Zapier
	http.post("*/api/protected/integrations/zapier/disconnect", () => {
		return HttpResponse.json({
			message: "Zapier disconnected successfully",
		});
	}),
];

/**
 * Handler factories for different integration scenarios
 */
export const integrationScenarios = {
	/** Zapier not connected */
	zapierNotConnected: () =>
		http.get("*/api/protected/integrations/zapier/status", () => {
			return HttpResponse.json({
				connected: false,
			});
		}),

	/** Feature not available (free/pro tier) */
	featureNotAvailable: () =>
		http.get("*/api/protected/integrations/zapier/status", () => {
			return HttpResponse.json(
				{ error: "Integrations require a Team subscription" },
				{ status: 403 },
			);
		}),
};
