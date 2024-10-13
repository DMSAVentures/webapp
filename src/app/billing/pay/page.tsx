'use client'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
import {loadStripe, StripeElementsOptions} from "@stripe/stripe-js";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import React from "react";
import {useSearchParams} from "next/navigation";
import {useCreateCheckoutSession} from "@/hooks/useCreateCheckoutSession";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export default function Home() {
    const searchParams = useSearchParams();
    const plan = searchParams?.get("plan");
    const {clientSecret, loading, error} = useCreateCheckoutSession({priceId: plan!})

    if (loading) {
        return "Loading..."
    }

    if (error) {
        console.log(error)
        return <div>{error.error}</div>
    }

    const options: StripeElementsOptions = {
        clientSecret: clientSecret!,
    };

    return (<div className={'payment-container'}>
        <EmbeddedCheckoutProvider options={options} stripe={stripePromise}>
            <EmbeddedCheckout/>
        </EmbeddedCheckoutProvider>
        </div>);
}
