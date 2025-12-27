import { useCallback, useEffect, useState } from "react";
import { type ApiError, type ApiGetScopesResponse, fetcher } from "@/api";
import { isAbortError, toApiError } from "@/utils";

async function getAPIKeyScopes(signal?: AbortSignal): Promise<string[]> {
	const response = await fetcher<ApiGetScopesResponse>(
		`${import.meta.env.VITE_API_URL}/api/protected/api-keys/scopes`,
		{ signal },
	);

	return response.scopes;
}

export const useGetAPIKeyScopes = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<string[] | null>(null);

	const fetchData = useCallback(async (signal?: AbortSignal) => {
		setLoading(true);
		setError(null);
		try {
			const response = await getAPIKeyScopes(signal);
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
		scopes: data,
		loading,
		error,
		refetch: fetchData,
	};
};
