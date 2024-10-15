'use client'
import {useRouter, useSearchParams} from "next/navigation";

export default function OAuthSignedIn() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get("token");
    if (token) {
        localStorage.setItem("token", token);
        router.push("/")
    }


    return (
        <div>
            <h1>Signing in...</h1>
        </div>
    );
}
