'use client'
import {useGetCheckoutSession} from "@/hooks/useGetCheckoutSession";

import {useRouter} from "next/navigation";

export default function Page() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    const router = useRouter();
    const {error, loading, data} = useGetCheckoutSession({sessionID: sessionId!})

    if (loading) {
        return "Loading..."
    }

    if (error) {
        return <div>{error.error}</div>
    }

    if (data.status === 'open') {
        return (
            router.push("/pay")
        )
    }

    if (data.status === 'complete') {
        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to your email.

                    If you have any questions, please email <a href="mailto:support@protoapp.xyz">support@protoapp.xyz</a>.
                </p>
            </section>
        )
    }

    return null;
}
