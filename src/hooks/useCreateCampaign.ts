import { useCallback, useState } from "react";
import {
	fetcher,
	type ApiError,
	type ApiCampaign,
	type ApiCreateCampaignRequest,
	toUiCampaign,
} from "@/api";
import type { Campaign } from "@/types/campaign";
import { toApiError } from "@/utils";

async function createCampaign(
	request: ApiCreateCampaignRequest,
): Promise<Campaign> {
	const response = await fetcher<ApiCampaign>(
		`${import.meta.env.VITE_API_URL}/api/v1/campaigns`,
		{
			method: "POST",
			body: JSON.stringify(request),
		},
	);

	return toUiCampaign(response);
}

export const useCreateCampaign = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Campaign | null>(null);

	const operation = useCallback(
		async (request: ApiCreateCampaignRequest): Promise<Campaign | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await createCampaign(request);
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
		createCampaign: operation,
		loading,
		error,
		data,
	};
};
