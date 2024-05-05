import React, { createContext, useState, useEffect } from 'react';

type AuthContextType = {
    isLoggedIn: boolean;
    loading: boolean;
};

const defaultAuthContext: AuthContextType = {
    isLoggedIn: false,
    loading: true,
}
// Create AuthContext
export const AuthContext = createContext(defaultAuthContext);

// AuthProvider component to provide the context
export function AuthProvider(props: { children: React.ReactNode }){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Check local storage for a token to set the initial state
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // True if token is present
        setLoading(false);
    }, [setIsLoggedIn, setLoading]);
    return (
        <AuthContext.Provider value={{ isLoggedIn, loading }}>
            {props.children}
        </AuthContext.Provider>
    );
}


