import { useCallback, useEffect, useState } from "react";
import { type ApiAPIKey, type ApiError, fetcher, toUiAPIKey } from "@/api";
import type { APIKey } from "@/types/apikey";
import { isAbortError, toApiError } from "@/utils";

async function getAPIKeys(signal?: AbortSignal): Promise<APIKey[]> {
	const response = await fetcher<ApiAPIKey[]>(
		`${import.meta.env.VITE_API_URL}/api/protected/api-keys`,
		{ signal },
	);

	return response.map(toUiAPIKey);
}

export const useGetAPIKeys = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<APIKey[] | null>(null);

	const fetchData = useCallback(async (signal?: AbortSignal) => {
		setLoading(true);
		setError(null);
		try {
			const response = await getAPIKeys(signal);
			setData(response);
			return response;
		} catch (error: unknown) {
			if (!isAbortError(error)) {
				setError(toApiError(error));
			}
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		fetchData(controller.signal);
		return () => controller.abort();
	}, [fetchData]);

	return {
		apiKeys: data,
		loading,
		error,
		refetch: fetchData,
	};
};
