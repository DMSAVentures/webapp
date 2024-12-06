'use client'
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect} from "react";

export default function OAuthSignedIn() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isClient, setIsClient] = React.useState(false);
    const token = searchParams?.get("token");

    useEffect(() => {
        setIsClient(true)
        if (token) {
            localStorage.setItem("token", token);
            router.push("/")
        }
    }, []);

    return (
        <div>
            {isClient ? <div>Client Signing in...</div> : <div>Not Client</div>}
        </div>
    );
}
