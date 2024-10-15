import {useState, useCallback, useEffect} from 'react';
import {ApiError, fetcher} from "@/hooks/fetcher";

interface GetCheckoutSessionResponse {
    session_id: string
    status: string
    payment_status: string
}

interface IArguments {
    sessionID: string;
}

export const useGetCheckoutSession =  (args: IArguments) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [data, setData] = useState<GetCheckoutSessionResponse>({} as GetCheckoutSessionResponse);

    const getCheckoutSession = useCallback(async (session_id: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await fetcher<GetCheckoutSessionResponse>(`${process.env.NEXT_PUBLIC_API_URI}/api/protected/billing/checkout-session?session_id=${session_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // On successful response, set the client secret
            setData(response);
        } catch (error: any) {
            // Set error if the fetcher throws an error
            setError({error: error.message});
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (args.sessionID) {
            getCheckoutSession(args.sessionID);
        }
    }, [args.sessionID, getCheckoutSession]);

    return {
        refetch: getCheckoutSession,
        loading,
        error,
        data,
    };
};
