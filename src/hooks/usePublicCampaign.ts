/**
 * usePublicCampaign Hook
 * Fetches campaign data using public API (no auth required)
 */

import { useCallback, useEffect, useState } from "react";
import { publicFetcher, type ApiError, type ApiCampaign, toUiCampaign } from "@/api";
import type { Campaign } from "@/types/campaign";

interface UsePublicCampaignResult {
	campaign: Campaign | null;
	loading: boolean;
	error: ApiError | null;
	refetch: () => Promise<void>;
}

/**
 * Hook to fetch campaign data from public API
 *
 * @param campaignId - The campaign ID to fetch
 * @returns Campaign data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { campaign, loading, error } = usePublicCampaign(campaignId);
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.error} />;
 * if (!campaign) return <NotFound />;
 *
 * return <Form config={campaign.form_config} />;
 * ```
 */
export const usePublicCampaign = (
	campaignId: string,
): UsePublicCampaignResult => {
	const [campaign, setCampaign] = useState<Campaign | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);

	const fetchCampaign = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await publicFetcher<ApiCampaign>(
				`${import.meta.env.VITE_API_URL}/api/v1/${campaignId}`,
				{ method: "GET" },
			);
			setCampaign(toUiCampaign(response));
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to load form";
			setError({ error: message });
		} finally {
			setLoading(false);
		}
	}, [campaignId]);

	useEffect(() => {
		fetchCampaign();
	}, [fetchCampaign]);

	return {
		campaign,
		loading,
		error,
		refetch: fetchCampaign,
	};
};
