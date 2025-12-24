import { useCallback, useState } from "react";
import { fetcher } from "@/hooks/fetcher";
import type {
	ApiError,
	Campaign,
	UpdateCampaignStatusRequest,
} from "@/types/campaign";
import { toApiError } from "@/utils";

async function updateCampaignStatus(
	campaignId: string,
	request: UpdateCampaignStatusRequest,
): Promise<Campaign> {
	const response = await fetcher<Campaign>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/status`,
		{
			method: "PATCH",
			body: JSON.stringify(request),
		},
	);

	return response;
}

export const useUpdateCampaignStatus = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const operation = useCallback(
		async (
			campaignId: string,
			request: UpdateCampaignStatusRequest,
		): Promise<Campaign | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await updateCampaignStatus(campaignId, request);
				setData(response);
				return response;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		updateStatus: operation,
		loading,
		error,
		data,
	};
};
