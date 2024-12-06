'use client'
import "./webapp.scss"
import React, {useContext} from "react";
import {AuthContext} from "@/contexts/auth";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WebApp (): React.JSX.Element {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    useEffect(() => {
        if (!authContext.isLoggedIn) {
            router.push('/signin');
        }
    }, [authContext, router]);

    if (!authContext.isLoggedIn) {
        return <></>;
    }

    return (
        // <main>
            <div>
                <h1>Webapp - WEBAPP GIG</h1>
                <p>This is a message</p>
            </div>
        // </main>
    );
}
