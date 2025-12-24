import { useCallback, useEffect, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import type {
	ListCampaignsParams,
	ListCampaignsResponse,
} from "@/types/campaign";
import { toApiError } from "@/utils";

async function getCampaigns(
	params?: ListCampaignsParams,
): Promise<ListCampaignsResponse> {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append("page", params.page.toString());
	if (params?.limit) searchParams.append("limit", params.limit.toString());
	if (params?.status) searchParams.append("status", params.status);
	if (params?.type) searchParams.append("type", params.type);

	const queryString = searchParams.toString();
	const url = `${import.meta.env.VITE_API_URL}/api/v1/campaigns${queryString ? `?${queryString}` : ""}`;

	const response = await fetcher<ListCampaignsResponse>(url, {
		method: "GET",
	});

	return response;
}

export const useGetCampaigns = (params?: ListCampaignsParams) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<ListCampaignsResponse | null>(null);

	const fetchCampaigns = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const response = await getCampaigns(params);
			setData(response);
		} catch (error: unknown) {
			setError(toApiError(error));
		} finally {
			setLoading(false);
		}
	}, [params]);

	useEffect(() => {
		fetchCampaigns();
	}, [fetchCampaigns]);

	return {
		data,
		loading,
		error,
		refetch: fetchCampaigns,
	};
};
