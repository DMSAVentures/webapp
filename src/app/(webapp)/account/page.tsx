'use client'
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import PlanCard from "@/components/billing/plans/planCard";
import {Button} from "@/components/simpleui/Button/button";
import './page.scss'
import {Badge} from "@/components/simpleui/badge/badge";
import {useGetCurrentSubscription} from "@/hooks/useGetCurrentSubscription";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import {ErrorState} from "@/components/error/error";
import {EmptyState} from "@/components/empty/empty";

export default function Page() {
    const {loading, error, currentSubscription} = useGetCurrentSubscription()
    if (loading) {
        return <LoadingSpinner/>
    }
    if (error) {
        return (<ErrorState message={`Something went wrong: ${error.error}`}/>)
    } else if (!currentSubscription) {
        return (<EmptyState message={"No subscription found"}/>)
    }

    return (
        <>
            <Column sm={{span: 7, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}}
                    xlg={{start: 1, span: 13}}>
                <div className={'billing'}>
                    <h4>Billing</h4>
                    <p>Subscription</p>
                    <PlanCard priceId={currentSubscription.price_id!}/>
                    <div className={'billing-status'}>
                        <p>Status:</p>
                        <Badge text={currentSubscription.status} variant={'green'} styleType={'light'} size={'small'}/>
                    </div>
                    <p>Next billing date: {currentSubscription.end_date.toLocaleDateString()}</p>
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
