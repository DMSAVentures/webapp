import PlanToPay from "@/components/billing/plans/planPay";
import {getPlans} from "@/hooks/getPlans";
import {Suspense} from "react";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import {Column} from "@/components/simpleui/UIShell/Column/Column";

import './page.scss'


export default async function Page() {
    const prices = await getPlans();  // This will trigger loading.tsx and error.tsx automatically if needed

    if (!prices.length) {
        return <div>No pricing plans available.</div>;
    }

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <>
                <Column sm={{span: 7, start: 1}} >
                    <h3>Plans</h3>
                </Column>
                <Column sm={{span: 7, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}}
                        xlg={{start: 1, span: 13}}>
                    <div className={'plans'}>
                        {prices.map((price) => (
                            <PlanToPay key={price.price_id} product_id={price.product_id} price_id={price.price_id}
                                       description={price.description}/>
                        ))}
                    </div>
                </Column>

            </>
        </Suspense>
    );
}
