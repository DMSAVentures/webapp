'use client'
import React, {createContext, useState, useEffect, useMemo} from 'react';
import {usePathname, useRouter} from "next/navigation";

type AuthContextType = {
    isLoggedIn: boolean;
};

const defaultAuthContext: AuthContextType = {
    isLoggedIn: false,
}
// Create AuthContext
export const AuthContext = createContext(defaultAuthContext);

// AuthProvider component to provide the context
export function AuthProvider(props: { children: React.ReactNode }){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        // Check local storage for a token to set the initial state
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        if (token) {
            setIsLoggedIn(true);
        } else if (!token && pathname !== 'oauth/signedin') {
            router.push('/signin');
        }
        setIsAuthLoading(false);
    }, []);

    // Memoize the value object to avoid unnecessary rerenders
    const value = useMemo(() => ({ isLoggedIn }), [isLoggedIn]);
    return (
        <AuthContext.Provider value={value}>
            {isAuthLoading ? <p>Loading...</p> : props.children}
        </AuthContext.Provider>
    );
}


