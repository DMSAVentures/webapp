import { useCallback, useEffect, useState } from 'react';
import { fetcher, ApiError } from '@/hooks/fetcher';
import type { Campaign } from '@/types/campaign';

async function getCampaign(campaignId: string): Promise<Campaign> {
	const response = await fetcher<Campaign>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
		{
			method: 'GET',
		}
	);

	return response;
}

export const useGetCampaign = (campaignId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const fetchCampaign = useCallback(async (): Promise<void> => {
		if (!campaignId) return;

		setLoading(true);
		setError(null);
		try {
			const response = await getCampaign(campaignId);
			setData(response);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			setError({ error: message });
		} finally {
			setLoading(false);
		}
	}, [campaignId]);

	useEffect(() => {
		fetchCampaign();
	}, [fetchCampaign]);

	return {
		data,
		loading,
		error,
		refetch: fetchCampaign,
	};
};
