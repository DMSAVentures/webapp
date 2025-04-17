import {PriceResponse} from "@/types/billing";
import {fetcher} from "@/hooks/fetcher";

export async function getPlans(): Promise<PriceResponse> {
    const response = await fetcher<PriceResponse>(`${import.meta.env.VITE_API_URL}/api/billing/plans`, {
        method: "GET",
    });

    return response;
}
