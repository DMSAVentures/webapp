import { useCallback, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import { toApiError } from "@/utils";

async function testWebhook(webhookId: string): Promise<{ message: string }> {
	const response = await fetcher<{ message: string }>(
		`${import.meta.env.VITE_API_URL}/api/protected/webhooks/${webhookId}/test`,
		{
			method: "POST",
		},
	);

	return response;
}

export const useTestWebhook = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const operation = useCallback(async (webhookId: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			await testWebhook(webhookId);
			return true;
		} catch (error: unknown) {
			setError(toApiError(error));
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		testWebhook: operation,
		loading,
		error,
	};
};
