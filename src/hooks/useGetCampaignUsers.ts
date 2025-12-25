import { useCallback, useEffect, useState } from "react";
import {
	type ApiError,
	type ApiListUsersResponse,
	fetcher,
	toUiWaitlistUsers,
} from "@/api";
import type { WaitlistUser } from "@/types/user";
import { toApiError } from "@/utils";

export interface ListUsersParams {
	page?: number;
	limit?: number;
	status?: string;
	sort?: string;
	order?: "asc" | "desc";
}

export interface ListUsersResponse {
	users: WaitlistUser[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
}

async function getCampaignUsers(
	campaignId: string,
	params?: ListUsersParams,
): Promise<ApiListUsersResponse> {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append("page", params.page.toString());
	if (params?.limit) searchParams.append("limit", params.limit.toString());
	if (params?.status) searchParams.append("status", params.status);
	if (params?.sort) searchParams.append("sort", params.sort);
	if (params?.order) searchParams.append("order", params.order);

	const queryString = searchParams.toString();
	const url = `${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/users${queryString ? `?${queryString}` : ""}`;

	const response = await fetcher<ApiListUsersResponse>(url, {
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

	// Extract primitive values to use as stable dependencies
	const page = params?.page;
	const limit = params?.limit;
	const status = params?.status;
	const sort = params?.sort;
	const order = params?.order;

	const fetchUsers = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			setLoading(true);
			setError(null);
			try {
				const response = await getCampaignUsers(campaignId, {
					page,
					limit,
					status,
					sort,
					order,
				});

				// Transform API response to UI format
				const transformedUsers = toUiWaitlistUsers(response.users);

				setData({
					users: transformedUsers,
					page: response.page,
					pageSize: response.page_size,
					totalCount: response.total_count,
					totalPages: response.total_pages,
				});
			} catch (error: unknown) {
				if (signal?.aborted) return;
				setError(toApiError(error));
			} finally {
				if (!signal?.aborted) {
					setLoading(false);
				}
			}
		},
		[campaignId, page, limit, status, sort, order],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchUsers(controller.signal);
		return () => controller.abort();
	}, [fetchUsers]);

	return {
		data,
		loading,
		error,
		refetch: fetchUsers,
	};
};
