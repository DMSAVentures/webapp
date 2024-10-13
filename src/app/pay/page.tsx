'use client'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
import {Appearance, loadStripe, StripeElementsOptions} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CompletePage from "@/app/complete/completepage";
import CheckoutForm from "@/app/checkout/checkoutform";
import React from "react";
import { useCreateSubscriptionIntent } from "@/hooks/useCreateSubscriptionIntent";
import { useSearchParams} from "next/navigation";
import "./page.scss"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
export default function Home() {
    const searchParams = useSearchParams();
    const plan = searchParams?.get("plan");
    console.log(plan)
    const {clientSecret, loading, error} =  useCreateSubscriptionIntent({priceId: plan!})
    console.log(error, loading)
    const [confirmed, setConfirmed] = React.useState<string | null>(null);

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
        theme: 'flat',
    };
    const options: StripeElementsOptions = {
        clientSecret: clientSecret!,
        appearance,
    };



    return (
        <div className={'payment-container'}>
            <div className={'checkout-container'}>
                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        {confirmed ? <CompletePage/> : <CheckoutForm/>}
                    </Elements>
                )}
            </div>
            <div className={'plan-container'}>
                <p>Plan: {plan}</p>
            </div>
        </div>
    );
}
