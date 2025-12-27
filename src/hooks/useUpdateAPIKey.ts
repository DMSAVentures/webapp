import { useCallback, useState } from "react";
import {
	type ApiAPIKey,
	type ApiError,
	type ApiUpdateAPIKeyRequest,
	fetcher,
	toUiAPIKey,
} from "@/api";
import type { APIKey } from "@/types/apikey";
import { toApiError } from "@/utils";

async function updateAPIKey(
	keyId: string,
	request: ApiUpdateAPIKeyRequest,
): Promise<APIKey> {
	const response = await fetcher<ApiAPIKey>(
		`${import.meta.env.VITE_API_URL}/api/protected/api-keys/${keyId}`,
		{
			method: "PUT",
			body: JSON.stringify(request),
		},
	);

	return toUiAPIKey(response);
}

export const useUpdateAPIKey = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<APIKey | null>(null);

	const operation = useCallback(
		async (
			keyId: string,
			request: ApiUpdateAPIKeyRequest,
		): Promise<APIKey | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await updateAPIKey(keyId, request);
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
		updateAPIKey: operation,
		loading,
		error,
		data,
	};
};
