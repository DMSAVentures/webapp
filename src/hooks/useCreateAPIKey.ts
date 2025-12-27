import { useCallback, useState } from "react";
import {
	type ApiCreateAPIKeyRequest,
	type ApiCreateAPIKeyResponse,
	type ApiError,
	fetcher,
	toUiCreateAPIKeyResponse,
} from "@/api";
import type { CreateAPIKeyResponse } from "@/types/apikey";
import { toApiError } from "@/utils";

async function createAPIKey(
	request: ApiCreateAPIKeyRequest,
): Promise<CreateAPIKeyResponse> {
	const response = await fetcher<ApiCreateAPIKeyResponse>(
		`${import.meta.env.VITE_API_URL}/api/protected/api-keys`,
		{
			method: "POST",
			body: JSON.stringify(request),
		},
	);

	return toUiCreateAPIKeyResponse(response);
}

export const useCreateAPIKey = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<CreateAPIKeyResponse | null>(null);

	const operation = useCallback(
		async (
			request: ApiCreateAPIKeyRequest,
		): Promise<CreateAPIKeyResponse | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await createAPIKey(request);
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
		createAPIKey: operation,
		loading,
		error,
		data,
	};
};
