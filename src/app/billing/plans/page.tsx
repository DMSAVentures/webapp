import PlanToPay from "@/components/billing/plans/planPay";
import {getPlans} from "@/hooks/getPlans";


export default async function Page() {
    const prices = await getPlans();  // This will trigger loading.tsx and error.tsx automatically if needed

    if (!prices.length) {
        return <div>No pricing plans available.</div>;
    }

    return (
        <div>
            <h1>Plans</h1>
            <ul>
                {prices.map((price) => (
                    <PlanToPay key={price.price_id} product_id={price.product_id} price_id={price.price_id} description={price.description}/>
                ))}
            </ul>
        </div>
    );
}
