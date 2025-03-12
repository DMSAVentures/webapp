"use client"

import {useCreateCustomerPortal} from "@/hooks/useCreateCustomerPortal";
import LoadingSpinner from "@/components/loading/loadingSpinner";

export default function Page() {
    const {data, error, loading} = useCreateCustomerPortal();

    if (loading) {
        return <LoadingSpinner/>
    }

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div>
            <h1>Customer Portal</h1>
            <a href={data?.url}>Go to Customer Portal</a>
        </div>
    );
}
