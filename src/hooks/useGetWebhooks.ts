import { useCallback, useEffect, useState } from "react";
import { fetcher, type ApiError, type ApiWebhook, toUiWebhook } from "@/api";
import type { Webhook } from "@/types/webhook";
import { toApiError } from "@/utils";

async function getWebhooks(campaignId?: string): Promise<Webhook[]> {
	const searchParams = new URLSearchParams();
	if (campaignId) searchParams.append("campaign_id", campaignId);

	const queryString = searchParams.toString();
	const url = `${import.meta.env.VITE_API_URL}/api/protected/webhooks${queryString ? `?${queryString}` : ""}`;

	const response = await fetcher<ApiWebhook[] | null>(url, {
		method: "GET",
	});

	return response?.map(toUiWebhook) ?? [];
}

export const useGetWebhooks = (campaignId?: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Webhook[] | null>(null);

	const fetchWebhooks = useCallback(async (): Promise<void> => {
		setLoading(true);
		setError(null);
		try {
			const response = await getWebhooks(campaignId);
			setData(response);
		} catch (error: unknown) {
			setError(toApiError(error));
		} finally {
			setLoading(false);
		}
	}, [campaignId]);

	useEffect(() => {
		fetchWebhooks();
	}, [fetchWebhooks]);

	return {
		data,
		loading,
		error,
		refetch: fetchWebhooks,
	};
};
