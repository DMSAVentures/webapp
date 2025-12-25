import { useCallback, useState } from "react";
import { fetcher, type ApiListUsersResponse, type ApiError, toUiWaitlistUsers } from "@/api";
import type { WaitlistUser } from "@/types/user";
import { toApiError } from "@/utils";

export const useExportCampaignUsers = (campaignId: string) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const fetchAllUsers = useCallback(async (): Promise<WaitlistUser[]> => {
		setLoading(true);
		setError(null);
		try {
			const url = `${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/users?limit=10000&sort=position&order=asc`;
			const response = await fetcher<ApiListUsersResponse>(url, {
				method: "GET",
			});
			const allUsers = toUiWaitlistUsers(response.users);
			return allUsers;
		} catch (error: unknown) {
			setError(toApiError(error));
			throw error;
		} finally {
			setLoading(false);
		}
	}, [campaignId]);

	return {
		fetchAllUsers,
		loading,
		error,
	};
};
