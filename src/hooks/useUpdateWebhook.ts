import { useCallback, useState } from "react";
import {
	type ApiError,
	type ApiUpdateWebhookRequest,
	type ApiWebhook,
	fetcher,
	toUiWebhook,
} from "@/api";
import type { Webhook } from "@/types/webhook";
import { toApiError } from "@/utils";

async function updateWebhook(
	webhookId: string,
	request: ApiUpdateWebhookRequest,
): Promise<Webhook> {
	const response = await fetcher<ApiWebhook>(
		`${import.meta.env.VITE_API_URL}/api/protected/webhooks/${webhookId}`,
		{
			method: "PUT",
			body: JSON.stringify(request),
		},
	);

	return toUiWebhook(response);
}

export const useUpdateWebhook = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Webhook | null>(null);

	const operation = useCallback(
		async (
			webhookId: string,
			request: ApiUpdateWebhookRequest,
		): Promise<Webhook | null> => {
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
