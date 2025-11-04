import { fetcher } from "@/hooks/fetcher";
import { PriceResponse } from "@/types/billing";

export async function getPlans(): Promise<PriceResponse> {
	const response = await fetcher<PriceResponse>(
		`${import.meta.env.VITE_API_URL}/api/billing/plans`,
		{
			method: "GET",
		},
	);

	return response;
}
