'use client'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
import {Appearance, loadStripe, StripeElementsOptions} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "@/app/checkout/checkoutform";
import React, {useEffect} from "react";
import { useCreateSubscriptionIntent } from "@/hooks/useCreateSubscriptionIntent";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export default function Page() {
    const {createSubscriptionIntent, loading, error, clientSecret} = useCreateSubscriptionIntent()
    useEffect(() => {
        createSubscriptionIntent("price_1Q1y7700n5jvBrdM89uWe7aj")
    }, []);

    if (loading) {
        return "Loading..."
    }

    if (error) {
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
                     <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}
