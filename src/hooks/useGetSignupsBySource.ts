import { useCallback, useEffect, useState } from "react";
import { fetcher, type ApiError } from "@/api";
import type {
	ApiSignupsBySourceResponse,
	SignupsOverTimeParams,
} from "@/types/api.types";
import { isAbortError, toApiError } from "@/utils";

export const useGetSignupsBySource = (
	campaignId: string,
	params?: SignupsOverTimeParams,
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<ApiSignupsBySourceResponse | null>(null);

	const fetchSignupsBySource = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId) return;

			setLoading(true);
			setError(null);

			try {
				const queryParams = new URLSearchParams();
				if (params?.period) queryParams.set("period", params.period);
				if (params?.from) queryParams.set("from", params.from);
				if (params?.to) queryParams.set("to", params.to);

				const queryString = queryParams.toString();
				const url = `${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/analytics/signups-by-source${queryString ? `?${queryString}` : ""}`;

				const response = await fetcher<ApiSignupsBySourceResponse>(url, {
					method: "GET",
					signal,
				});
				setData(response);
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[campaignId, params?.period, params?.from, params?.to],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchSignupsBySource(controller.signal);
		return () => controller.abort();
	}, [fetchSignupsBySource]);

	return {
		data,
		loading,
		error,
		refetch: fetchSignupsBySource,
	};
};
