import { useCallback, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import { toApiError } from "@/utils";
import type { CreateWebhookRequest, CreateWebhookResponse } from "@/types/webhook";

async function createWebhook(
	request: CreateWebhookRequest,
): Promise<CreateWebhookResponse> {
	const response = await fetcher<CreateWebhookResponse>(
		`${import.meta.env.VITE_API_URL}/api/protected/webhooks`,
		{
			method: "POST",
			body: JSON.stringify(request),
		},
	);

	return response;
}

export const useCreateWebhook = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<CreateWebhookResponse | null>(null);

	const operation = useCallback(
		async (request: CreateWebhookRequest): Promise<CreateWebhookResponse | null> => {
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
