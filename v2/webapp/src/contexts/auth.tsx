import React, {createContext, useMemo, useContext} from 'react';
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

export const useAuth = () => useContext(AuthContext)

export async function loadAuth(): Promise<User> {
    try {
        const user = await getUser();
        return user;
    } catch {
        window.location.replace('/signin')
        return new Promise<never>(() => {}) // app will pause until redirect
    }
}

export function AuthProvider({
                                 children,
                                 user,
                             }: {
    children: React.ReactNode
    user: User | null
}) {
    const value = useMemo<AuthContextType>(() => ({
        isLoggedIn: !!user,
        user: user ?? undefined,
    }), [user])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
