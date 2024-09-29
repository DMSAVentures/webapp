import { useState } from 'react';
import {ApiError, fetcher } from './fetcher' // Adjust the path to your fetcher

interface CreateSubscriptionIntentResponse {
    client_secret: string;
}

export const useCreateSubscriptionIntent = () => {
    let doneOnce = false;
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const createSubscriptionIntent = async (price_id: string) => {
        if (doneOnce) {
            return;
        }
        setLoading(true);
        try {
            // Use the custom fetcher here
            const response = await fetcher<CreateSubscriptionIntentResponse>(`${process.env.NEXT_PUBLIC_API_URI}/api/protected/billing/create-subscription-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ price_id }),
            });

            // Successful response, set the client secret
            setClientSecret(response.client_secret);
        } catch (error: any) {
            console.error('Create subscription intent failed', error);
            // Since fetcher throws a proper error, simply set it
            setError({ error: error.message });
        } finally {
            setLoading(false);
            doneOnce = true;
        }
    };

    return {
        loading,
        error,
        clientSecret,
        createSubscriptionIntent,
    };
};
