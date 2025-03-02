'use client'
import {useGetCheckoutSession} from "@/hooks/useGetCheckoutSession";

import {useRouter, useSearchParams} from "next/navigation";
import React from "react";
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import {ErrorState} from "@/components/error/error";
import LoadingSpinner from "@/components/loading/loadingSpinner";

import './page.scss'
import Banner from "@/components/simpleui/banner/banner";

export default function Page() {
    const searchParams = useSearchParams();  // Use useSearchParams to access query parameters
    const sessionId = searchParams?.get('session_id');
    const router = useRouter();
    const {error, loading, data} = useGetCheckoutSession({sessionID: sessionId!})

    if (loading) {
        return <LoadingSpinner/>
    }

    if (error) {
        return <ErrorState message={`Something went wrong: ${error.error}`}/>
    }

    if (data.status === 'open') {
        return (
            router.push("/pay")
        )
    }

    if (data.status === 'complete') {
        return (
            <Column sm={{span: 8, start: 1}} md={{start: 1, span: 7}} lg={{start: 1, span: 11}}
                    xlg={{start: 1, span: 13}}>
                <Banner bannerType={'success'} variant={'filled'} alertTitle={'Joined!'} alertDescription={'We appreciate your business! A confirmation email will be sent to your email. '}/>
            </Column>
        )
    }

    return null;
}
