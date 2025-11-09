import { useCallback, useEffect, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import type { WaitlistUser } from "@/types/common.types";

interface ListUsersParams {
	page?: number;
	limit?: number;
	status?: "pending" | "verified" | "converted" | "removed" | "blocked";
	sort?: "position" | "created_at" | "referral_count";
	order?: "asc" | "desc";
}

interface ListUsersResponse {
	users: WaitlistUser[];
	total_count: number;
	page: number;
	page_size: number;
	total_pages: number;
}

async function getCampaignUsers(
	campaignId: string,
	params?: ListUsersParams,
): Promise<ListUsersResponse> {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append("page", params.page.toString());
	if (params?.limit) searchParams.append("limit", params.limit.toString());
	if (params?.status) searchParams.append("status", params.status);
	if (params?.sort) searchParams.append("sort", params.sort);
	if (params?.order) searchParams.append("order", params.order);

	const queryString = searchParams.toString();
	const url = `${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/users${queryString ? `?${queryString}` : ""}`;

	const response = await fetcher<ListUsersResponse>(url, {
		method: "GET",
	});

	return response;
}

export const useGetCampaignUsers = (
	campaignId: string,
	params?: ListUsersParams,
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<ListUsersResponse | null>(null);

	const fetchUsers = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const response = await getCampaignUsers(campaignId, params);
			setData(response);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			setError({ error: message });
		} finally {
			setLoading(false);
		}
	}, [campaignId, params]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return {
		data,
		loading,
		error,
		refetch: fetchUsers,
	};
};
