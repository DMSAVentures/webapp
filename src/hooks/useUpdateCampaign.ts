import { useCallback, useState } from "react";
import {
	type ApiCampaign,
	type ApiError,
	type ApiUpdateCampaignRequest,
	fetcher,
	toUiCampaign,
} from "@/api";
import type { Campaign } from "@/types/campaign";
import { toApiError } from "@/utils";

async function updateCampaign(
	campaignId: string,
	request: ApiUpdateCampaignRequest,
): Promise<Campaign> {
	const response = await fetcher<ApiCampaign>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}`,
		{
			method: "PUT",
			body: JSON.stringify(request),
		},
	);

	return toUiCampaign(response);
}

export const useUpdateCampaign = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const operation = useCallback(
		async (
			campaignId: string,
			request: ApiUpdateCampaignRequest,
		): Promise<Campaign | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await updateCampaign(campaignId, request);
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
		updateCampaign: operation,
		loading,
		error,
		data,
	};
};
