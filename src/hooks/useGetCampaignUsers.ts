import { useCallback, useEffect, useMemo, useState } from "react";
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
	// Filters
	status?: string[];
	source?: string[];
	hasReferrals?: boolean;
	minPosition?: number;
	maxPosition?: number;
	dateFrom?: string;
	dateTo?: string;
	customFields?: Record<string, string>;
	// Sorting
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

	// Pagination
	if (params?.page) searchParams.append("page", params.page.toString());
	if (params?.limit) searchParams.append("limit", params.limit.toString());

	// Status array
	if (params?.status && params.status.length > 0) {
		params.status.forEach((s) => searchParams.append("status[]", s));
	}

	// Source array
	if (params?.source && params.source.length > 0) {
		params.source.forEach((s) => searchParams.append("source[]", s));
	}

	// Boolean filters
	if (params?.hasReferrals !== undefined) {
		searchParams.append("has_referrals", params.hasReferrals.toString());
	}

	// Position range
	if (params?.minPosition !== undefined) {
		searchParams.append("min_position", params.minPosition.toString());
	}
	if (params?.maxPosition !== undefined) {
		searchParams.append("max_position", params.maxPosition.toString());
	}

	// Date range
	if (params?.dateFrom) {
		searchParams.append("date_from", params.dateFrom);
	}
	if (params?.dateTo) {
		searchParams.append("date_to", params.dateTo);
	}

	// Custom fields
	if (params?.customFields) {
		Object.entries(params.customFields).forEach(([key, value]) => {
			searchParams.append(`custom_fields[${key}]`, value);
		});
	}

	// Sorting
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

	// Create stable serialized params for dependency tracking
	const serializedParams = useMemo(() => {
		if (!params) return "";
		return JSON.stringify({
			page: params.page,
			limit: params.limit,
			status: params.status,
			source: params.source,
			hasReferrals: params.hasReferrals,
			minPosition: params.minPosition,
			maxPosition: params.maxPosition,
			dateFrom: params.dateFrom,
			dateTo: params.dateTo,
			customFields: params.customFields,
			sort: params.sort,
			order: params.order,
		});
	}, [params]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: serializedParams is a stable string representation of params to avoid object identity issues
	const fetchUsers = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			setLoading(true);
			setError(null);
			try {
				const response = await getCampaignUsers(campaignId, params);

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
		[campaignId, serializedParams],
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
