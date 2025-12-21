import { useCallback, useEffect, useState } from "react";
import { type ApiError, fetcher } from "@/hooks/fetcher";
import type {
	ApiSignupsOverTimeResponse,
	SignupsOverTimeParams,
} from "@/types/api.types";

export const useGetSignupsOverTime = (
	campaignId: string,
	params?: SignupsOverTimeParams,
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<ApiSignupsOverTimeResponse | null>(null);

	const fetchSignupsOverTime = useCallback(
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
				const url = `${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/analytics/signups-over-time${queryString ? `?${queryString}` : ""}`;

				const response = await fetcher<ApiSignupsOverTimeResponse>(url, {
					method: "GET",
					signal,
				});
				setData(response);
			} catch (error: unknown) {
				if (error instanceof Error && error.name === "AbortError") {
					return;
				}
				const message =
					error instanceof Error ? error.message : "Unknown error";
				setError({ error: message });
			} finally {
				setLoading(false);
			}
		},
		[campaignId, params?.period, params?.from, params?.to],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchSignupsOverTime(controller.signal);
		return () => controller.abort();
	}, [fetchSignupsOverTime]);

	return {
		data,
		loading,
		error,
		refetch: fetchSignupsOverTime,
	};
};
