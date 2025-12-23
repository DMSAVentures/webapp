import { useCallback, useState } from "react";
import { ApiError, fetcher } from "@/hooks/fetcher";
import { toApiError } from "@/utils";

async function deleteWebhook(webhookId: string): Promise<void> {
	await fetcher<void>(
		`${import.meta.env.VITE_API_URL}/api/protected/webhooks/${webhookId}`,
		{
			method: "DELETE",
		},
	);
}

export const useDeleteWebhook = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const operation = useCallback(async (webhookId: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			await deleteWebhook(webhookId);
			return true;
		} catch (error: unknown) {
			setError(toApiError(error));
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		deleteWebhook: operation,
		loading,
		error,
	};
};
