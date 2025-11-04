import { useCallback, useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { fetcher } from "@/hooks/fetcher";
import { PaymentMethodUpdateIntentResponse } from "@/types/billing";

async function createPaymentMethodUpdateIntent(): Promise<PaymentMethodUpdateIntentResponse> {
	const response = await fetcher<PaymentMethodUpdateIntentResponse>(
		`${import.meta.env.VITE_API_URL}/api/protected/billing/payment-method-update-intent`,
		{
			method: "POST",
		},
	);
	return response;
}

export const useCreatePaymentMethodUpdateIntent = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<PaymentMethodUpdateIntentResponse>();
	const stripe = useStripe();
	const elements = useElements();

	const handlePaymentUpdate = useCallback(async () => {
		if (!stripe || !elements) {
			console.error("Stripe.js has not loaded yet.");
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		const result = await stripe.confirmCardSetup(data?.client_secret!, {
			payment_method: {
				card: elements.getElement(CardElement)!,
			},
		});

		if (result.error) {
			console.error(result.error.message);
			setError(result.error.message!);
		} else {
			// The setup has succeeded. Display a success message and send
			// result.setupIntent.payment_method to your server to save the
			// card to a Customer
			console.log(result.setupIntent.payment_method);
		}
	}, [stripe, elements, data]);

	const createPaymentMethodUpdateIntentCallback = useCallback(async (): Promise<void> => {
		setLoading(true);
		try {
			const response = await createPaymentMethodUpdateIntent();
			setData(response);
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		createPaymentMethodUpdateIntentCallback();
	}, [createPaymentMethodUpdateIntentCallback]);

	return {
		handlePaymentUpdate,
		loading,
		error,
		data,
	};
};
