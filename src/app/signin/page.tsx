'use client'
import Login from "@/components/authentication/login";
import "./page.scss";
import {useContext, useEffect} from "react";
import {AuthContext} from "@/contexts/auth";
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    useEffect(() => {
        if (authContext.isLoggedIn) {
           router.push("/");
        }
    }, [authContext, router]);

    // If the user is logged in, immediately redirect (handled by the effect)
    if (authContext.isLoggedIn) {
        return null;
    }

    return (
        <div className={"login-page"}>
            <div className={"centered-container"}>
                <div className={'login-form'}>
                    <Login/>
                </div>
            </div>
        </div>
    );
}
