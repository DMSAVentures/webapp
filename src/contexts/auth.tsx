import React, { createContext, useContext, useMemo } from "react";
import { getUser } from "@/hooks/getUser";
import { User } from "@/types/user";

type AuthContextType = {
	isLoggedIn: boolean;
	user?: User;
};

const defaultAuthContext: AuthContextType = {
	isLoggedIn: false,
};
// Create AuthContext
export const AuthContext = createContext(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

// Determines if the current path is a public route (e.g., /signin, /oauth/*)
function isPublicRoute(): boolean {
	if (typeof window === "undefined") return false;
	const path = window.location.pathname;
	return path === "/signin" || path.startsWith("/oauth");
}

/**
 * Loads the authenticated user or redirects to /signin if not authenticated.
 * Allows unauthenticated access to public routes (e.g., /signin, /oauth/*).
 */
export async function loadAuth(): Promise<User | null> {
	try {
		const user = await getUser();
		return user;
	} catch {
		if (!isPublicRoute()) {
			window.location.replace("/signin");
			return new Promise<never>(() => {
				/* Never resolves - app will pause until redirect */
			});
		}
		return null;
	}
}

export function AuthProvider({
	children,
	user,
}: {
	children: React.ReactNode;
	user: User | null;
}) {
	const value = useMemo<AuthContextType>(
		() => ({
			isLoggedIn: !!user,
			user: user ?? undefined,
		}),
		[user],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
