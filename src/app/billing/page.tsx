import Button from "@/components/baseui/button/button";
import PlanCard from "@/components/billing/plans/planCard";
import {getCurrentSubscription} from "@/hooks/getCurrentSubscription";


export default async function Page() {
    const data = await getCurrentSubscription();

    return (
        <div>
            <h1>Billing</h1>
            <div>Subscription</div>
            <PlanCard priceId={data.price_id!}/>
            <p>Status: {data.status}</p>
            <p>Next billing date: {data.end_date.toLocaleDateString()}</p>
            <Button variant={'error'}>Cancel</Button>
            <Button>Change Plan</Button>
        </div>
    );
}
