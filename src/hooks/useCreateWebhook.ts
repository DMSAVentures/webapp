import { useCallback, useState } from "react";
import {
	type ApiCreateWebhookRequest,
	type ApiCreateWebhookResponse,
	type ApiError,
	fetcher,
	toUiWebhook,
} from "@/api";
import type { Webhook } from "@/types/webhook";
import { toApiError } from "@/utils";

interface CreateWebhookResponse {
	webhook: Webhook;
	secret: string;
}

async function createWebhook(
	request: ApiCreateWebhookRequest,
): Promise<CreateWebhookResponse> {
	const response = await fetcher<ApiCreateWebhookResponse>(
		`${import.meta.env.VITE_API_URL}/api/protected/webhooks`,
		{
			method: "POST",
			body: JSON.stringify(request),
		},
	);

	return {
		webhook: toUiWebhook(response.webhook),
		secret: response.secret,
	};
}

export const useCreateWebhook = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<CreateWebhookResponse | null>(null);

	const operation = useCallback(
		async (
			request: ApiCreateWebhookRequest,
		): Promise<CreateWebhookResponse | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await createWebhook(request);
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
		createWebhook: operation,
		loading,
		error,
		data,
	};
};
