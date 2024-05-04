'use client'
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "@/contexts/auth";
import Login from "@/components/authentication/login";

export default function WebApp (): React.JSX.Element {
    const authContext = useContext(AuthContext);

    if (authContext.loading) {
        // Show loading indicator while checking authentication status
        return <div>Loading...</div>;
    }
    if (!authContext.isLoggedIn) {
        return (
            <Login/>
        );
    }
    return (
        <div>
            <h1>Webapp - WEBAPP GIG</h1>
            <p>This is a message</p>
        </div>
    );
}
