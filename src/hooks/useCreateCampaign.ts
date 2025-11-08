import { useCallback, useState } from 'react';
import { fetcher } from '@/hooks/fetcher';
import type { Campaign, CreateCampaignRequest, ApiError } from '@/types/campaign';

async function createCampaign(request: CreateCampaignRequest): Promise<Campaign> {
	const response = await fetcher<Campaign>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns`,
		{
			method: 'POST',
			body: JSON.stringify(request),
		}
	);

	return response;
}

export const useCreateCampaign = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const operation = useCallback(async (request: CreateCampaignRequest): Promise<Campaign | null> => {
		setLoading(true);
		setError(null);
		try {
			const response = await createCampaign(request);
			setData(response);
			return response;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			setError({ error: message });
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		createCampaign: operation,
		loading,
		error,
		data,
	};
};
