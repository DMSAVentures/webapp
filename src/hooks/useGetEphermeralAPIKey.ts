import { useCallback, useEffect, useState } from "react";
import { fetcher } from "@/hooks/fetcher";
import { getErrorMessage } from "@/utils";

interface EphermalAPIKeyResponse {
	key: string;
	expiresAt: string;
}

const getEphermeralAPIKey = async (): Promise<EphermalAPIKeyResponse> => {
	const response = await fetcher<EphermalAPIKeyResponse>(
		`${import.meta.env.VITE_API_URL}/api/protected/ai/get-ephermeral-api-key`,
		{
			method: "POST",
		},
	);

	return response;
};

export const useGetEphermeralAPIKey = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<EphermalAPIKeyResponse | null>(null);
	const getEphermeralAPIKeyCallback = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getEphermeralAPIKey();
			setData(response);
		} catch (error: unknown) {
			setError(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		getEphermeralAPIKeyCallback();
	}, [getEphermeralAPIKeyCallback]);

	return { loading, error, data };
};
