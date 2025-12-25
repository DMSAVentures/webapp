import { useCallback, useEffect, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import { toApiError } from "@/utils";

interface CreateSubscriptionIntentResponse {
	client_secret: string;
}

interface IArguments {
	priceId: string;
}

export const useCreateSubscriptionIntent = (args: IArguments) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	const createSubscriptionIntent = useCallback(
		async (price_id: string): Promise<void> => {
			setLoading(true);
			try {
				const response = await fetcher<CreateSubscriptionIntentResponse>(
					`${import.meta.env.VITE_API_URL}/api/protected/billing/create-subscription-intent`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ price_id }),
					},
				);

				setClientSecret(response.client_secret);
			} catch (error: unknown) {
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[],
	);

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
