import { useCallback, useState } from "react";
import { fetcher } from "@/hooks/fetcher";
import type {
	ApiError,
	Campaign,
	UpdateCampaignRequest,
} from "@/types/campaign";

async function updateCampaign(
	campaignId: string,
	request: UpdateCampaignRequest,
): Promise<Campaign> {
	const response = await fetcher<Campaign>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
		{
			method: "PUT",
			body: JSON.stringify(request),
		},
	);

	return response;
}

export const useUpdateCampaign = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const operation = useCallback(
		async (
			campaignId: string,
			request: UpdateCampaignRequest,
		): Promise<Campaign | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await updateCampaign(campaignId, request);
				setData(response);
				return response;
			} catch (error: unknown) {
				const message =
					error instanceof Error ? error.message : "Unknown error";
				setError({ error: message });
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		updateCampaign: operation,
		loading,
		error,
		data,
	};
};
