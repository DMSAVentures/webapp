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

	const fetchUsers = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			setLoading(true);
			setError(null);
			try {
				const response = await getCampaignUsers(campaignId, params);

				// Map API response (snake_case) to UI types (camelCase) and parse dates
				// biome-ignore lint/suspicious/noExplicitAny: API response structure differs from UI types
				const usersWithParsedDates = response.users.map((user: any) => ({
					id: user.id,
					campaignId: user.campaign_id,
					email: user.email,
					name:
						user.first_name && user.last_name
							? `${user.first_name} ${user.last_name}`.trim()
							: user.first_name || user.last_name || undefined,
					customFields: user.metadata || {},
					status: user.status || "pending",
					position: user.position || 0,
					referralCode: user.referral_code || "",
					referredBy: user.referred_by_id,
					referralCount: user.referral_count || 0,
					points: user.points || 0,
					source: user.source || "direct",
					utmParams: {
						source: user.utm_source,
						medium: user.utm_medium,
						campaign: user.utm_campaign,
						term: user.utm_term,
						content: user.utm_content,
					},
					metadata: {
						ipAddress: user.metadata?.ipAddress,
						userAgent: user.metadata?.userAgent,
						country: user.country_code,
						device: user.metadata?.device,
					},
					createdAt: new Date(user.created_at),
					verifiedAt: user.verified_at ? new Date(user.verified_at) : undefined,
					invitedAt: user.invited_at ? new Date(user.invited_at) : undefined,
				}));

				setData({
					...response,
					users: usersWithParsedDates,
				});
			} catch (error: unknown) {
				if (signal?.aborted) return;
				const message =
					error instanceof Error ? error.message : "Unknown error";
				setError({ error: message });
			} finally {
				if (!signal?.aborted) {
					setLoading(false);
				}
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[
			campaignId,
			params?.page,
			params?.limit,
			params?.status,
			params?.sort,
			params?.order,
		],
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
