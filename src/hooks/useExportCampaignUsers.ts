import { useCallback, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import type { ApiListUsersResponse } from "@/types/api.types";
import type { WaitlistUser } from "@/types/users.types";
import { transformApiUsersToWaitlistUsers } from "@/utils/userDataTransform";

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
			const allUsers = transformApiUsersToWaitlistUsers(response.users);
			return allUsers;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			setError({ error: message });
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
