import {Column} from "@/components/simpleui/UIShell/Column/Column";
import PlanCard from "@/components/billing/plans/planCard";
import {Button} from "@/components/simpleui/Button/button";
import {getCurrentSubscription} from "@/hooks/getCurrentSubscription";
import './page.scss'
import StatusBadge from "@/components/simpleui/StatusBadge/statusBadge";
import {Badge} from "@/components/simpleui/badge/badge";

export default async function Page() {
    const data = await getCurrentSubscription();
    return (
        <>
            <Column sm={{span: 7, start: 1}} >
                <h3>Account</h3>
            </Column>
            <Column sm={{span: 7, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}}
                    xlg={{start: 1, span: 13}}>
                <div className={'billing'}>
                    <h4>Billing</h4>
                    <p>Subscription</p>
                    <PlanCard priceId={data.price_id!}/>
                    <div className={'billing-status'}>
                        <p>Status:</p>
                        <Badge text={data.status} variant={'green'} styleType={'light'} size={'small'}/>
                    </div>
                    <p>Next billing date: {data.end_date.toLocaleDateString()}</p>
                </div>
            </Column>
            <Column sm={{span: 5, start: 1}} md={{start: 1, span: 5}} lg={{start: 1, span: 5}}
                                            xlg={{start: 1, span: 5}}>
                <div className={'billing-buttons'}>
                    <Button variant={'secondary'}>Cancel</Button>
                    <Button>Change Plan</Button>
                </div>
            </Column>
        </>
    );
}
