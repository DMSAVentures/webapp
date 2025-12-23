import { useCallback, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import { toApiError } from "@/utils";
import type { UpdateWebhookRequest, Webhook } from "@/types/webhook";

async function updateWebhook(
	webhookId: string,
	request: UpdateWebhookRequest,
): Promise<Webhook> {
	const response = await fetcher<Webhook>(
		`${import.meta.env.VITE_API_URL}/api/protected/webhooks/${webhookId}`,
		{
			method: "PUT",
			body: JSON.stringify(request),
		},
	);

	return response;
}

export const useUpdateWebhook = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Webhook | null>(null);

	const operation = useCallback(
		async (webhookId: string, request: UpdateWebhookRequest): Promise<Webhook | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await updateWebhook(webhookId, request);
				setData(response);
				return response;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		updateWebhook: operation,
		loading,
		error,
		data,
	};
};
