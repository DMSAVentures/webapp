import { useCallback, useEffect, useState } from "react";
import { type ApiCampaign, type ApiError, fetcher, toUiCampaign } from "@/api";
import type { Campaign } from "@/types/campaign";
import { isAbortError, toApiError } from "@/utils";

export const useGetCampaign = (campaignId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const fetchCampaign = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId) return;

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiCampaign>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
					{
						method: "GET",
						signal,
					},
				);
				setData(toUiCampaign(response));
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return; // Request was cancelled, don't update state
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[campaignId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchCampaign(controller.signal);
		return () => controller.abort();
	}, [fetchCampaign]);

	return {
		data,
		loading,
		error,
		refetch: fetchCampaign,
	};
};
