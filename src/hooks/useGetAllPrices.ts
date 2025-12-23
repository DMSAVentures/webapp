import { useCallback, useEffect, useState } from "react";
import { fetcher } from "@/hooks/fetcher";
import { getErrorMessage, isAbortError } from "@/utils";

export interface Price {
	product_id: string;
	price_id: string;
	description: string;
}

type PriceResponse = Price[];

export const useGetAllPrices = () => {
	const [prices, setPrices] = useState<PriceResponse>();
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPrices = useCallback(async (signal: AbortSignal) => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetcher<PriceResponse>(
				`${import.meta.env.VITE_API_URL}/api/billing/plans`,
				{
					method: "GET",
					signal,
				},
			);
			setPrices(response);
		} catch (error: unknown) {
			if (isAbortError(error)) {
				console.debug("Request was aborted.");
			} else {
				setError(getErrorMessage(error));
			}
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		fetchPrices(signal);

		return () => {
			controller.abort();
		};
	}, [fetchPrices]);

	return { prices, loading, error };
};
