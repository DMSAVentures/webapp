'use client'
import Button from "@/components/baseui/button/button";
import {useGetCurrentSubscription} from "@/hooks/useGetCurrentSubscription";
import PlanCard from "@/components/billing/plans/planCard";

export default function Page() {
    const {loading, error, data} = useGetCurrentSubscription()

    if (loading) {
        return "Loading..."
    }

    if (error) {
        return <div>{error.error}</div>
    }

    return (
        <div>
            <h1>Billing</h1>
            <div>Subscription</div>
            <PlanCard priceId={data?.price_id!}/>
            <p>Status: {data?.status}</p>
            <p>Next billing date: {data?.end_date.toLocaleDateString()}</p>
            <Button variant={'error'}>Cancel</Button>
            <Button>Change Plan</Button>

        </div>
    );
}
