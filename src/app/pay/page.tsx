'use client'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
import {Appearance, loadStripe, StripeElementsOptions} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CompletePage from "@/app/complete/completepage";
import CheckoutForm from "@/app/checkout/checkoutform";
import React, {useEffect} from "react";
import {useCreatePaymentIntent} from "@/hooks/useCreatePaymentIntent";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export default function Home() {
    const {createPaymentIntent, loading, error, clientSecret} = useCreatePaymentIntent()
    const [confirmed, setConfirmed] = React.useState<string | null>(null);
    useEffect(() => {
        createPaymentIntent(100)
    }, []);

    React.useEffect(() => {
        setConfirmed(new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        ));
    }, [setConfirmed]);

    if (loading) {
        return "Loading..."
    }

    if (error) {
        console.log(error)
        return <div>{error.error}</div>
    }

    const appearance: Appearance = {
        theme: 'stripe',
    };
    const options: StripeElementsOptions = {
        clientSecret: clientSecret!,
        appearance,
    };



    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    {confirmed ? <CompletePage /> : <CheckoutForm />}
                </Elements>
            )}
        </div>
    );
}
