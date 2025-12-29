/**
 * Segment API handlers
 */
import { HttpResponse, http } from "msw";
import type {
	ApiListSegmentsResponse,
	ApiPreviewSegmentResponse,
	ApiSegment,
} from "../../src/api/types/segment";
import { segments } from "../mocks/data";

/**
 * Default segment handlers
 */
export const segmentHandlers = [
	// List segments
	http.get("*/api/v1/campaigns/:campaignId/segments", ({ request }) => {
		const url = new URL(request.url);
		const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
		const limit = Number.parseInt(url.searchParams.get("limit") || "20", 10);

		const response: ApiListSegmentsResponse = {
			segments,
			total: segments.length,
			page,
			limit,
			total_pages: Math.ceil(segments.length / limit),
		};

		return HttpResponse.json(response);
	}),

	// Get single segment
	http.get("*/api/v1/campaigns/:campaignId/segments/:id", ({ params }) => {
		const segment = segments.find((s) => s.id === params.id);
		if (!segment) {
			return HttpResponse.json({ error: "Segment not found" }, { status: 404 });
		}
		return HttpResponse.json(segment);
	}),

	// Create segment
	http.post(
		"*/api/v1/campaigns/:campaignId/segments",
		async ({ params, request }) => {
			const body = (await request.json()) as Partial<ApiSegment>;
			const now = new Date().toISOString();

			const newSegment: ApiSegment = {
				id: `seg_${Date.now()}`,
				campaign_id: params.campaignId as string,
				name: body.name || "New Segment",
				description: body.description,
				filter_criteria: body.filter_criteria || {},
				cached_user_count: 0,
				status: "active",
				created_at: now,
				updated_at: now,
			};

			return HttpResponse.json(newSegment, { status: 201 });
		},
	),

	// Preview segment
	http.post(
		"*/api/v1/campaigns/:campaignId/segments/preview",
		async ({ request }) => {
			const body = (await request.json()) as {
				filter_criteria: Record<string, unknown>;
			};

			// Simulate different counts based on filter criteria
			let count = 100;
			if (body.filter_criteria.email_verified === true) {
				count = 85;
			}
			if (body.filter_criteria.min_referrals) {
				count = Math.max(
					10,
					count - (body.filter_criteria.min_referrals as number) * 10,
				);
			}

			const response: ApiPreviewSegmentResponse = {
				count,
				sample_users: [
					{
						id: "user_1",
						email: "user1@example.com",
						first_name: "John",
						last_name: "Doe",
						status: "verified",
						created_at: new Date().toISOString(),
					},
					{
						id: "user_2",
						email: "user2@example.com",
						first_name: "Jane",
						last_name: "Smith",
						status: "verified",
						created_at: new Date().toISOString(),
					},
				],
			};

			return HttpResponse.json(response);
		},
	),

	// Update segment
	http.patch(
		"*/api/v1/campaigns/:campaignId/segments/:id",
		async ({ params, request }) => {
			const segment = segments.find((s) => s.id === params.id);
			if (!segment) {
				return HttpResponse.json(
					{ error: "Segment not found" },
					{ status: 404 },
				);
			}

			const body = (await request.json()) as Partial<ApiSegment>;
			const updatedSegment = {
				...segment,
				...body,
				updated_at: new Date().toISOString(),
			};

			return HttpResponse.json(updatedSegment);
		},
	),

	// Delete segment
	http.delete("*/api/v1/campaigns/:campaignId/segments/:id", ({ params }) => {
		const segment = segments.find((s) => s.id === params.id);
		if (!segment) {
			return HttpResponse.json({ error: "Segment not found" }, { status: 404 });
		}
		return new HttpResponse(null, { status: 204 });
	}),

	// Refresh segment cache
	http.post(
		"*/api/v1/campaigns/:campaignId/segments/:id/refresh",
		({ params }) => {
			const segment = segments.find((s) => s.id === params.id);
			if (!segment) {
				return HttpResponse.json(
					{ error: "Segment not found" },
					{ status: 404 },
				);
			}

			return HttpResponse.json({
				...segment,
				cached_user_count: segment.cached_user_count + 5,
				cached_at: new Date().toISOString(),
			});
		},
	),
];

/**
 * Handler factories for different segment scenarios
 */
export const segmentScenarios = {
	/** No segments */
	noSegments: () =>
		http.get("*/api/v1/campaigns/:campaignId/segments", () => {
			return HttpResponse.json({
				segments: [],
				total: 0,
				page: 1,
				limit: 20,
				total_pages: 0,
			});
		}),

	/** Empty preview result */
	emptyPreview: () =>
		http.post("*/api/v1/campaigns/:campaignId/segments/preview", () => {
			return HttpResponse.json({
				count: 0,
				sample_users: [],
			});
		}),
};
