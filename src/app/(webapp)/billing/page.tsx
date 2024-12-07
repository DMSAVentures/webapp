'use client'
import {Button} from "@/components/simpleui/Button/button";
import PlanCard from "@/components/billing/plans/planCard";
import {Suspense} from "react";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import {useGetCurrentSubscription} from "@/hooks/useGetCurrentSubscription";


export default function Page() {
    const {loading, error, currentSubscription} = useGetCurrentSubscription()
    if (loading) {
        return <LoadingSpinner/>
    }
    if (error) {
        return <div>Something went wrong: {error.error}</div>
    }

    if (!currentSubscription) {
        return <div>No subscription found</div>
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <div>
                <h4>Billing</h4>
                <div>Subscription</div>
                <PlanCard priceId={currentSubscription.price_id!}/>
                <p>Status: {currentSubscription.status}</p>
                <p>Next billing date: {currentSubscription.end_date.toLocaleDateString()}</p>
                <Button variant={'secondary'}>Cancel</Button>
                <Button>Change Plan</Button>
            </div>
        </Suspense>
    );
}
