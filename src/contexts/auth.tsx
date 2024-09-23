'use client'
import React, { createContext, useState, useEffect } from 'react';

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
    useEffect(() => {
        // Check local storage for a token to set the initial state
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // True if token is present
    }, []);
    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {props.children}
        </AuthContext.Provider>
    );
}


