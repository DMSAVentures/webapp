import { useCallback, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import { toApiError } from "@/utils";

async function revokeAPIKey(keyId: string): Promise<void> {
	await fetcher<{ success: boolean }>(
		`${import.meta.env.VITE_API_URL}/api/protected/api-keys/${keyId}`,
		{
			method: "DELETE",
		},
	);
}

export const useRevokeAPIKey = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const operation = useCallback(async (keyId: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			await revokeAPIKey(keyId);
			return true;
		} catch (error: unknown) {
			setError(toApiError(error));
			return false;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		revokeAPIKey: operation,
		loading,
		error,
	};
};
