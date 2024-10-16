import {useState, useCallback, useEffect} from 'react';
import {fetcher} from "@/hooks/fetcher";

interface CreateCheckoutSessionResponse {
    client_secret: string;
}

interface ApiError {
    error: string;
}

interface IArguments {
    priceId: string;
}

export const useCreateCheckoutSession =  (args: IArguments) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const createCheckoutSession = useCallback(async (price_id: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetcher<CreateCheckoutSessionResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/billing/create-checkout-session`, {
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
            createCheckoutSession(args.priceId);
        }
    }, [args.priceId, createCheckoutSession]);

    return {
        refetch: createCheckoutSession,
        loading,
        error,
        clientSecret,
    };
};
