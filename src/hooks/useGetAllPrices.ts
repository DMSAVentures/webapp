import {useCallback, useEffect, useState} from 'react';
import {fetcher} from "@/hooks/fetcher";

interface Price {
    product_id: string;
    price_id: string;
    description: string;
}

type PriceResponse = Price[];

export const useGetAllPrices = () => {
    const [prices, setPrices] = useState<PriceResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPrices = useCallback(async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetcher<PriceResponse>(`${process.env.NEXT_PUBLIC_API_URI}/api/billing/plans`, {
                method: "GET",
                signal,
            });
            setPrices(response);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // Handle abort error separately if needed
                console.debug('Request was aborted.');
            } else {
                setError(error.message); // Only set error for actual failures
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
            // Aborts the fetch request when the component unmounts
            controller.abort();
        };
    }, [fetchPrices]);

    return { prices, loading, error };
}
