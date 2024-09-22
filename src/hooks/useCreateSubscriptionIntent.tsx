import {useState} from "react";

interface ErrorResponse {
    error: string;
    message: string;
    code: string;
}

export const useCreatePaymentIntent = () => {
    let doneOnce = false;
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ErrorResponse | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const createPaymentIntent = async (amount: number) => {
        if (doneOnce) {
            return
        }
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/api/protected/pay/create-payment-intent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({items:[{ id: '123', amount }]}),
            });

            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();
                setError(errorData);
            } else {
                const responseData = await response.json();
                setClientSecret(responseData.client_secret);
            }
        } catch (error: any) {
            console.error("Create payment intent failed", error);
            if (error instanceof Error) {
                setError({ code: "unknown", message: error.message });
            } else {
                setError({ code: "unknown", message: "An unknown error occurred" });
            }
        } finally {
            setLoading(false);
            doneOnce = true;
        }
    };

    return {
        loading,
        error,
        clientSecret,
        createPaymentIntent,
    };
}
