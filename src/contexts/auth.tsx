'use client'
import React, {createContext, useState, useEffect, useMemo} from 'react';
import {usePathname, useRouter} from "next/navigation";
import {getUser} from "@/hooks/getUser";
import {User} from "@/types/user";

type AuthContextType = {
    isLoggedIn: boolean;
    user?: User;
};

const defaultAuthContext: AuthContextType = {
    isLoggedIn: false,
}
// Create AuthContext
export const AuthContext = createContext(defaultAuthContext);

// AuthProvider component to provide the context
export function AuthProvider(props: { children: React.ReactNode }){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User>();
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const authenticatedUser = async () => {
            try {
                const user = await getUser();
                setIsLoggedIn(true);
                setUser(user);
            } catch (e) {
                setIsLoggedIn(false);
                if (pathname !== 'oauth/signedin') {
                    router.push('/signin');
                }
            } finally {
                setIsAuthLoading(false);
            }
        }
        authenticatedUser();
    }, [pathname, router]);
    // Memoize the value object to avoid unnecessary rerenders
    const value = useMemo(() => ({ isLoggedIn, user }), [isLoggedIn, user]);
    return (
        <AuthContext.Provider value={value}>
            {isAuthLoading ? <p>Loading...</p> : props.children}
        </AuthContext.Provider>
    );
}


