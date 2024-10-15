import React from "react";
import {ApiError, fetcher} from "@/hooks/fetcher";

interface GetCurrentSubscriptionResponse {
    id: string;
    status: string;
    price_id: string;
    start_date: Date;
    end_date: Date;
    next_billing_date: Date
}

export const useGetCurrentSubscription = () => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<ApiError | null>(null);
    const [data, setData] = React.useState<GetCurrentSubscriptionResponse | null>(null);

    const getSubscription = React.useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetcher<GetCurrentSubscriptionResponse>(`${process.env.NEXT_PUBLIC_API_URI}/api/protected/billing/subscription`);
            // Convert date strings to native Date objects
            const parsedResponse = {
                ...response,
                start_date: new Date(response.start_date),
                end_date: new Date(response.end_date),
                next_billing_date: new Date(response.next_billing_date),
            };

            setData(parsedResponse);
        } catch (error: any) {
            setError({error: error.message});
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        getSubscription();
    }, [getSubscription]);

    return {
        refetch: getSubscription,
        loading,
        error,
        data,
    }
}
