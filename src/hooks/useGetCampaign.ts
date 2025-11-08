import { useCallback, useEffect, useState } from 'react';
import { fetcher, ApiError } from '@/hooks/fetcher';
import type { Campaign } from '@/types/campaign';

export const useGetCampaign = (campaignId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const fetchCampaign = useCallback(async (signal?: AbortSignal): Promise<void> => {
		if (!campaignId) return;

		setLoading(true);
		setError(null);
		try {
			const response = await fetcher<Campaign>(
				`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
				{
					method: 'GET',
					signal,
				}
			);
			setData(response);
		} catch (error: unknown) {
			if (error instanceof Error && error.name === 'AbortError') {
				return; // Request was cancelled, don't update state
			}
			const message = error instanceof Error ? error.message : 'Unknown error';
			setError({ error: message });
		} finally {
			setLoading(false);
		}
	}, [campaignId]);

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
