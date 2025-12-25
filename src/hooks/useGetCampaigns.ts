import { useCallback, useEffect, useState } from "react";
import {
	type ApiError,
	type ApiListCampaignsResponse,
	fetcher,
	toUiCampaign,
} from "@/api";
import type { Campaign, ListCampaignsParams } from "@/types/campaign";
import { toApiError } from "@/utils";

interface ListCampaignsResponse {
	campaigns: Campaign[];
	pagination: {
		nextCursor?: string;
		hasMore: boolean;
		totalCount?: number;
	};
}

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

	const apiResponse = await fetcher<ApiListCampaignsResponse>(url, {
		method: "GET",
	});

	return {
		campaigns: apiResponse.campaigns.map(toUiCampaign),
		pagination: {
			nextCursor: apiResponse.pagination.next_cursor,
			hasMore: apiResponse.pagination.has_more,
			totalCount: apiResponse.pagination.total_count,
		},
	};
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
