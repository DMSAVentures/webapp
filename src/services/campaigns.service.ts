/**
 * Campaign Service
 * API calls for campaign management using dependency injection
 * This implementation allows for easy mocking and testing
 */

import type { Campaign } from "@/types/common.types";
import type {
	ICampaignsService,
	IFetcher,
	CampaignFilters,
	CreateCampaignRequest,
	UpdateCampaignRequest,
} from "@/interfaces";
import { defaultFetcher } from "@/adapters/fetcher.adapter";

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Service Dependencies
 * Define all dependencies required by the campaigns service
 */
export interface CampaignsServiceDependencies {
	fetcher: IFetcher;
	apiBase?: string;
}

/**
 * Create Campaigns Service
 * Factory function that creates a campaigns service with injected dependencies
 *
 * @param dependencies - Service dependencies (fetcher, apiBase)
 * @returns Campaigns service implementation
 *
 * @example
 * // Production usage with default dependencies
 * const service = createCampaignsService({ fetcher: defaultFetcher });
 *
 * @example
 * // Testing usage with mock dependencies
 * const mockFetcher = { fetch: jest.fn() };
 * const service = createCampaignsService({ fetcher: mockFetcher });
 */
export function createCampaignsService(
	dependencies: CampaignsServiceDependencies,
): ICampaignsService {
	const { fetcher, apiBase = API_BASE } = dependencies;

	return {
		/**
		 * Get list of campaigns with optional filters
		 */
		list: async (filters?: CampaignFilters): Promise<Campaign[]> => {
			const params = new URLSearchParams();

			if (filters?.status) {
				params.append("status", filters.status);
			}
			if (filters?.search) {
				params.append("search", filters.search);
			}
			if (filters?.page) {
				params.append("page", filters.page.toString());
			}
			if (filters?.limit) {
				params.append("limit", filters.limit.toString());
			}

			const queryString = params.toString();
			const url = `${apiBase}/api/campaigns${queryString ? `?${queryString}` : ""}`;

			return fetcher.fetch<Campaign[]>(url);
		},

		/**
		 * Get single campaign by ID
		 */
		get: async (id: string): Promise<Campaign> => {
			return fetcher.fetch<Campaign>(`${apiBase}/api/campaigns/${id}`);
		},

		/**
		 * Create new campaign
		 */
		create: async (data: CreateCampaignRequest): Promise<Campaign> => {
			return fetcher.fetch<Campaign>(`${apiBase}/api/campaigns`, {
				method: "POST",
				body: JSON.stringify(data),
			});
		},

		/**
		 * Update existing campaign
		 */
		update: async (
			id: string,
			data: UpdateCampaignRequest,
		): Promise<Campaign> => {
			return fetcher.fetch<Campaign>(`${apiBase}/api/campaigns/${id}`, {
				method: "PATCH",
				body: JSON.stringify(data),
			});
		},

		/**
		 * Delete campaign
		 */
		delete: async (id: string): Promise<void> => {
			return fetcher.fetch<void>(`${apiBase}/api/campaigns/${id}`, {
				method: "DELETE",
			});
		},

		/**
		 * Duplicate campaign
		 */
		duplicate: async (id: string): Promise<Campaign> => {
			return fetcher.fetch<Campaign>(
				`${apiBase}/api/campaigns/${id}/duplicate`,
				{
					method: "POST",
				},
			);
		},

		/**
		 * Get campaign statistics
		 */
		getStats: async (id: string): Promise<Campaign["stats"]> => {
			const campaign = await fetcher.fetch<Campaign>(
				`${apiBase}/api/campaigns/${id}`,
			);
			return campaign.stats;
		},

		/**
		 * Update campaign status
		 */
		updateStatus: async (
			id: string,
			status: Campaign["status"],
		): Promise<Campaign> => {
			return fetcher.fetch<Campaign>(`${apiBase}/api/campaigns/${id}`, {
				method: "PATCH",
				body: JSON.stringify({ status }),
			});
		},
	};
}

/**
 * Default campaigns service instance
 * Pre-configured with production dependencies
 * Use this in your application code
 */
export const campaignsService = createCampaignsService({
	fetcher: defaultFetcher,
});
