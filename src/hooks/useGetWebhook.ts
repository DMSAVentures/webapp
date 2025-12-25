import { useCallback, useEffect, useState } from "react";
import { fetcher, type ApiError, type ApiWebhook, toUiWebhook } from "@/api";
import type { Webhook } from "@/types/webhook";
import { toApiError } from "@/utils";

async function getWebhook(webhookId: string): Promise<Webhook> {
	const response = await fetcher<ApiWebhook>(
		`${import.meta.env.VITE_API_URL}/api/protected/webhooks/${webhookId}`,
		{
			method: "GET",
		},
	);

	return toUiWebhook(response);
}

export const useGetWebhook = (webhookId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Webhook | null>(null);

	const fetchWebhook = useCallback(async (): Promise<void> => {
		if (!webhookId) return;

		setLoading(true);
		setError(null);
		try {
			const response = await getWebhook(webhookId);
			setData(response);
		} catch (error: unknown) {
			setError(toApiError(error));
		} finally {
			setLoading(false);
		}
	}, [webhookId]);

	useEffect(() => {
		fetchWebhook();
	}, [fetchWebhook]);

	return {
		data,
		loading,
		error,
		refetch: fetchWebhook,
	};
};
