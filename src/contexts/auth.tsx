import { createContext, useState, useEffect, useContext } from 'react';

type AuthContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const defaultAuthContext: AuthContextType = {
    isLoggedIn: false,
    setIsLoggedIn: () => {},
}
// Create AuthContext
export const AuthContext = createContext(defaultAuthContext);

// AuthProvider component to provide the context
export function AuthProvider(props: { children: React.ReactNode }){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check local storage for a token to set the initial state
        const token = localStorage.getItem('token');
        console.log(token);
        setIsLoggedIn(!!token); // True if token is present
    }, []);
    console.log(isLoggedIn);
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {props.children}
        </AuthContext.Provider>
    );
}


