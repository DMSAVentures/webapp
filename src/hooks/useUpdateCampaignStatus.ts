import { useCallback, useState } from "react";
import {
	fetcher,
	type ApiError,
	type ApiCampaign,
	type ApiUpdateCampaignStatusRequest,
	toUiCampaign,
} from "@/api";
import type { Campaign } from "@/types/campaign";
import { toApiError } from "@/utils";

async function updateCampaignStatus(
	campaignId: string,
	request: ApiUpdateCampaignStatusRequest,
): Promise<Campaign> {
	const response = await fetcher<ApiCampaign>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/status`,
		{
			method: "PATCH",
			body: JSON.stringify(request),
		},
	);

	return toUiCampaign(response);
}

export const useUpdateCampaignStatus = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const operation = useCallback(
		async (
			campaignId: string,
			request: ApiUpdateCampaignStatusRequest,
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
