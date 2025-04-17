import {GetCurrentSubscriptionResponse} from "@/types/billing";
import {ApiError, fetcher} from "@/hooks/fetcher";
import {useCallback, useEffect, useState} from "react";

 async function getCurrentSubscription(): Promise<GetCurrentSubscriptionResponse> {
    const response = await fetcher<GetCurrentSubscriptionResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/billing/subscription`, {
        method: "GET",
    });
    // Convert date strings to native Date objects
    return  {
        ...response,
        start_date: new Date(response.start_date),
        end_date: new Date(response.end_date),
        next_billing_date: new Date(response.next_billing_date),
    };
}

export const useGetCurrentSubscription = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [currentSubscription, setCurrentSubscription] = useState<GetCurrentSubscriptionResponse>();

    const getCurrentSubscriptionCallback = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await getCurrentSubscription()
            setCurrentSubscription(response);
        } catch (error: any) {
            // Set error if the fetcher throws an error
            setError({error: error.message});
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
            getCurrentSubscriptionCallback();
    }, [getCurrentSubscriptionCallback]);

    return {
        refetch: getCurrentSubscriptionCallback,
        loading,
        error,
        currentSubscription,
    };
}
