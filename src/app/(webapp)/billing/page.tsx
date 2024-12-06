import {Button} from "@/components/simpleui/Button/button";
import PlanCard from "@/components/billing/plans/planCard";
import {getCurrentSubscription} from "@/hooks/getCurrentSubscription";
import {Suspense} from "react";
import LoadingSpinner from "@/components/loading/loadingSpinner";


export default async function Page() {
    const data = await getCurrentSubscription();

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <div>
                <h4>Billing</h4>
                <div>Subscription</div>
                <PlanCard priceId={data.price_id!}/>
                <p>Status: {data.status}</p>
                <p>Next billing date: {data.end_date.toLocaleDateString()}</p>
                <Button variant={'secondary'}>Cancel</Button>
                <Button>Change Plan</Button>
            </div>
        </Suspense>
    );
}
