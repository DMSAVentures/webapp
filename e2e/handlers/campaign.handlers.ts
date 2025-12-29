/**
 * Campaign API handlers
 */
import { HttpResponse, http } from "msw";
import type {
	ApiCampaign,
	ApiListCampaignsResponse,
} from "../../src/api/types/campaign";
import { campaigns, getCampaignById } from "../mocks/data";

/**
 * Default campaign handlers
 */
export const campaignHandlers = [
	// List campaigns
	http.get("*/api/v1/campaigns", ({ request }) => {
		const url = new URL(request.url);
		const status = url.searchParams.get("status");
		const type = url.searchParams.get("type");

		let filteredCampaigns = [...campaigns];

		if (status) {
			filteredCampaigns = filteredCampaigns.filter((c) => c.status === status);
		}
		if (type) {
			filteredCampaigns = filteredCampaigns.filter((c) => c.type === type);
		}

		const response: ApiListCampaignsResponse = {
			campaigns: filteredCampaigns,
			pagination: {
				has_more: false,
				total_count: filteredCampaigns.length,
			},
		};

		return HttpResponse.json(response);
	}),

	// Get single campaign
	http.get("*/api/v1/campaigns/:id", ({ params }) => {
		const campaign = getCampaignById(params.id as string);
		if (!campaign) {
			return HttpResponse.json(
				{ error: "Campaign not found" },
				{ status: 404 },
			);
		}
		return HttpResponse.json(campaign);
	}),

	// Create campaign
	http.post("*/api/v1/campaigns", async ({ request }) => {
		const body = (await request.json()) as Partial<ApiCampaign>;
		const now = new Date().toISOString();

		const newCampaign: ApiCampaign = {
			id: `camp_${Date.now()}`,
			account_id: "acc_123",
			name: body.name || "New Campaign",
			slug: body.slug || "new-campaign",
			description: body.description,
			status: "draft",
			type: body.type || "waitlist",
			total_signups: 0,
			total_verified: 0,
			total_referrals: 0,
			created_at: now,
			updated_at: now,
		};

		return HttpResponse.json(newCampaign, { status: 201 });
	}),

	// Update campaign
	http.put("*/api/v1/campaigns/:id", async ({ params, request }) => {
		const campaign = getCampaignById(params.id as string);
		if (!campaign) {
			return HttpResponse.json(
				{ error: "Campaign not found" },
				{ status: 404 },
			);
		}

		const body = (await request.json()) as Partial<ApiCampaign>;
		const updatedCampaign = {
			...campaign,
			...body,
			updated_at: new Date().toISOString(),
		};

		return HttpResponse.json(updatedCampaign);
	}),

	// Update campaign status
	http.patch("*/api/v1/campaigns/:id/status", async ({ params, request }) => {
		const campaign = getCampaignById(params.id as string);
		if (!campaign) {
			return HttpResponse.json(
				{ error: "Campaign not found" },
				{ status: 404 },
			);
		}

		const body = (await request.json()) as { status: string };
		const updatedCampaign = {
			...campaign,
			status: body.status,
			updated_at: new Date().toISOString(),
		};

		return HttpResponse.json(updatedCampaign);
	}),

	// Delete campaign
	http.delete("*/api/v1/campaigns/:id", ({ params }) => {
		const campaign = getCampaignById(params.id as string);
		if (!campaign) {
			return HttpResponse.json(
				{ error: "Campaign not found" },
				{ status: 404 },
			);
		}
		return new HttpResponse(null, { status: 204 });
	}),

	// Get campaign users
	http.get("*/api/v1/campaigns/:id/users", ({ request }) => {
		const url = new URL(request.url);
		const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);

		return HttpResponse.json({
			users: [],
			total_count: 0,
			page,
			page_size: limit,
			total_pages: 0,
		});
	}),

	// Analytics: Signups over time
	http.get("*/api/v1/campaigns/:id/analytics/signups-over-time", () => {
		return HttpResponse.json({
			data_points: [
				{ date: "2025-01-01", value: 100 },
				{ date: "2025-01-02", value: 150 },
				{ date: "2025-01-03", value: 200 },
			],
		});
	}),

	// Analytics: Signups by source
	http.get("*/api/v1/campaigns/:id/analytics/signups-by-source", () => {
		return HttpResponse.json({
			sources: [
				{ source: "direct", count: 500 },
				{ source: "referral", count: 300 },
				{ source: "social", count: 200 },
			],
		});
	}),
];

/**
 * Handler factories for different campaign scenarios
 */
export const campaignScenarios = {
	/** Empty campaigns list */
	noCampaigns: () =>
		http.get("*/api/v1/campaigns", () => {
			return HttpResponse.json({
				campaigns: [],
				pagination: { has_more: false, total_count: 0 },
			});
		}),

	/** Campaign limit reached (for free tier) */
	campaignLimitReached: () =>
		http.post("*/api/v1/campaigns", () => {
			return HttpResponse.json(
				{ error: "Campaign limit reached. Please upgrade your plan." },
				{ status: 403 },
			);
		}),

	/** Server error */
	serverError: () =>
		http.get("*/api/v1/campaigns", () => {
			return HttpResponse.json(
				{ error: "Internal server error" },
				{ status: 500 },
			);
		}),

	/** Network timeout simulation */
	timeout: () =>
		http.get("*/api/v1/campaigns", async () => {
			await new Promise((resolve) => setTimeout(resolve, 30000));
			return HttpResponse.json({ campaigns: [] });
		}),
};
