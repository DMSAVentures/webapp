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
        if (!authContext.loading && authContext.isLoggedIn) {
           router.push("/");
        }
    }, [authContext, router]);

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
