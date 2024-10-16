import {GetCurrentSubscriptionResponse} from "@/app/types/billing";
import { headers } from "next/headers";
import {fetcher} from "@/hooks/fetcher";


export async function getCurrentSubscription(): Promise<GetCurrentSubscriptionResponse> {
    const incomingHeaders = headers();
    const token = incomingHeaders.get('cookie'); // Extract only the cookie header

    const response = await fetcher<GetCurrentSubscriptionResponse>(`${process.env.NEXT_PUBLIC_API_URI}/api/protected/billing/subscription`, {
        method: "GET",
        headers: {
            'cookie': token || '',  // Forward the token from cookies if available
        },
    });
    // Convert date strings to native Date objects
    return  {
        ...response,
        start_date: new Date(response.start_date),
        end_date: new Date(response.end_date),
        next_billing_date: new Date(response.next_billing_date),
    };
}
