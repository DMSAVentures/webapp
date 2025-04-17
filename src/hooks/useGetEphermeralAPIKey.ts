import {fetcher} from "@/hooks/fetcher";
import {useEffect, useState} from "react";

interface EphermalAPIKeyResponse {
    key: string;
    expiresAt: string;
}

const getEphermeralAPIKey = async (): Promise<EphermalAPIKeyResponse> => {
    const response = await fetcher<EphermalAPIKeyResponse>(`${import.meta.env.VITE_API_URL}/api/protected/ai/get-ephermeral-api-key`,{
        method: 'POST',
    });

    return response;
}

export const useGetEphermeralAPIKey = () => {
        const [loading, setLoading] = useState<boolean>(false);
        const [error, setError] = useState<string | null>(null);
        const [data, setData] = useState<EphermalAPIKeyResponse | null>(null);
        const getEphermeralAPIKeyCallback = async () => {
            setLoading(true);
            try {
                const response = await getEphermeralAPIKey();
                setData(response);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        useEffect(() => {
            getEphermeralAPIKeyCallback();
        }, [])

        return {loading, error, data};
}
