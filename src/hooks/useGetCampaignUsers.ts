import { useCallback, useEffect, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import { toApiError } from "@/utils";
import type { ApiListUsersResponse } from "@/types/api.types";
import type { ListUsersParams, ListUsersResponse } from "@/types/users.types";
import { transformApiUsersToWaitlistUsers } from "@/utils/userDataTransform";

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
				const transformedUsers = transformApiUsersToWaitlistUsers(
					response.users,
				);

				setData({
					...response,
					users: transformedUsers,
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
