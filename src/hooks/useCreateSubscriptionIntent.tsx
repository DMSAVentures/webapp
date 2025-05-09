import {useState, useCallback, useEffect} from 'react';
import {ApiError, fetcher} from "@/hooks/fetcher";

interface CreateSubscriptionIntentResponse {
    client_secret: string;
}

interface IArguments {
    priceId: string;
}

export const useCreateSubscriptionIntent =  (args: IArguments) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const createSubscriptionIntent = useCallback(async (price_id: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetcher<CreateSubscriptionIntentResponse>(`${import.meta.env.VITE_API_URL}/api/protected/billing/create-subscription-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({price_id}),
            });

            // On successful response, set the client secret
            setClientSecret(response.client_secret);
        } catch (error: any) {
            // Set error if the fetcher throws an error
            setError({error: error.message});
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (args.priceId) {
            createSubscriptionIntent(args.priceId);
        }
    }, [args.priceId, createSubscriptionIntent]);

    return {
        refetch: createSubscriptionIntent,
        loading,
        error,
        clientSecret,
    };
};
