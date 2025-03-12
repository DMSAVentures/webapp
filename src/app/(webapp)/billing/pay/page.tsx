'use client'

import React from "react";
import {useSearchParams} from "next/navigation";
import {useCreatePaymentIntent} from "@/hooks/useCreatePaymentIntent";
import CustomCheckout from "@/components/billing/checkout/CustomCheckout";
import {useCreateCheckoutSession} from "@/hooks/useCreateCheckoutSession";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import {ErrorState} from "@/components/error/error";
import Banner from "@/components/simpleui/banner/banner";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const plan = searchParams?.get("plan");
    const {clientSecret, loading, error} = useCreateCheckoutSession({priceId: plan!})

    if (loading) {
        return <LoadingSpinner/>
    }

    if (error) {
        return <ErrorState message={`Something went wrong: ${error.error}`}/>
    }

    if (!clientSecret) {
        return (
            <Banner
                bannerType="error"
                variant="filled"
                alertTitle="Error"
                alertDescription="Unable to initiate payment process"
            />
        );
    }

    return (
        <CustomCheckout
            clientSecret={clientSecret}
        />
    );
}
