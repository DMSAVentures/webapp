import {fetcher} from "@/hooks/fetcher";
import {CustomerPortalResponse} from "@/types/billing";
import {useEffect, useState} from "react";

async function createCustomerPortal() : Promise<CustomerPortalResponse> {
    const resp = await fetcher<CustomerPortalResponse>(`${import.meta.env.VITE_API_URL}/api/protected/billing/create-customer-portal`, {
        method: 'POST',
    })

    return resp;
}

export const useCreateCustomerPortal = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CustomerPortalResponse>();

    const createCustomerPortalCallback = async () => {
        setLoading(true);
        try {
            const response = await createCustomerPortal();
            setData(response);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        createCustomerPortalCallback();
    }, [])

    return {loading, error, data};
}
