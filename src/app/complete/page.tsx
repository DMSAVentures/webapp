'use client'
import CompletePage from "@/app/complete/completepage";
import {Appearance, loadStripe, StripeElementsOptions} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import React from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export default function Page() {
    const [confirmed, setConfirmed] = React.useState<string | null>(null);
    React.useEffect(() => {
        setConfirmed(new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        ));
    }, [setConfirmed]);

    const appearance: Appearance = {
        theme: 'stripe',
    };
    const options: StripeElementsOptions = {
        appearance,
    };
    return (
        <div>
            <h1>Checkout</h1>
            {stripePromise  && (
                <Elements options={options} stripe={stripePromise}>
                    {confirmed ? <CompletePage /> : null}
                </Elements>
            )}
        </div>
    );
}
