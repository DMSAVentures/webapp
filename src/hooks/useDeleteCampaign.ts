import { useCallback, useState } from 'react';
import { fetcher } from '@/hooks/fetcher';
import type { ApiError } from '@/types/campaign';

async function deleteCampaign(campaignId: string): Promise<void> {
	await fetcher<void>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
		{
			method: 'DELETE',
		}
	);
}

export const useDeleteCampaign = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const operation = useCallback(async (campaignId: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			await deleteCampaign(campaignId);
			return true;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			setError({ error: message });
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		deleteCampaign: operation,
		loading,
		error,
	};
};
