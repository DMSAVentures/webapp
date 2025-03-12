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
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {useCancelSubscription} from "@/hooks/useCancelSubscription";
import Banner from "@/components/simpleui/banner/banner";


export default function Page() {
    const {loading, error, currentSubscription, refetch} = useGetCurrentSubscription();
    const {cancelSubscription, error: errorCancelSub, data} = useCancelSubscription();

    const router = useRouter()

    useEffect(() => {
        if (error?.error === 'no active subscription found') {
            router.push('/billing/plans');
        }
    }, [error, router]); // Run effect when `error` changes

    useEffect(() => {
        if (data) {
            refetch();
        }
    }, [data, router]);

    if (loading) {
        return <LoadingSpinner/>
    }
    if (error?.error === 'no active subscription found') {
        return null; // Prevent rendering anything since we're navigating away
    }

    if (error) {
        return <ErrorState message={`Something went wrong: ${error.error}`}/>;
    }

    if (!currentSubscription) {
        return <EmptyState message={"No subscription found"}/>;
    }

    return (<>
            {errorCancelSub &&
                <Banner bannerType={'error'} variant={'filled'} alertTitle={'Failed to cancel subscription'}
                        alertDescription={errorCancelSub}/>}
            <Column sm={{span: 7, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}}
                    xlg={{start: 1, span: 13}}>
                <div className={'billing'}>
                    <h4>Billing</h4>
                    <p>Subscription</p>
                    <PlanCard priceId={currentSubscription.price_id!}/>
                    <div className={'billing-status'}>
                        <p>Status:</p>
                        <Badge text={currentSubscription.status}
                               variant={currentSubscription.status === 'active' ? 'green' : 'orange'}
                               styleType={'light'} size={'medium'}/>
                    </div>
                    {currentSubscription.status && currentSubscription.status === 'active' &&
                        <p>Next billing date: {currentSubscription.next_billing_date.toLocaleDateString()}</p>}
                </div>
            </Column>
            <Column sm={{span: 5, start: 1}} md={{start: 1, span: 5}} lg={{start: 1, span: 5}}
                    xlg={{start: 1, span: 5}}>
                <div className={"billing-buttons"}>
                    {currentSubscription.status && currentSubscription.status === 'active' && <>
                        <Button variant={"secondary"} onClick={cancelSubscription}>Cancel</Button>
                        <Button>Change Plan</Button>
                    </>}
                    {currentSubscription.status && currentSubscription.status === 'canceled' &&
                        <Button onClick={() => { router.push('/billing/plans'); }}>Resubscribe</Button>}
                </div>

            </Column>
        </>);
}
