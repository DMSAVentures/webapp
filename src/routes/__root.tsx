import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { useAuth } from "@/contexts/auth"

// Determines if the current path is a public route (e.g., /signin, /oauth/*)
function isPublicRoute(): boolean {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    return (
        path === '/signin' ||
        path.startsWith('/oauth')
    );
}

function RootLayout() {
    const auth = useAuth()

    // Show loading state if user info is not loaded yet (optional, add your own logic)
    // if (auth.isLoading) return <div>Loading...</div>

    // If not logged in and not on a public route, redirect (defensive, should be handled by loadAuth but double-check)
    if (!auth.isLoggedIn && !isPublicRoute()) {
        if (typeof window !== 'undefined') {
            window.location.replace('/signin')
        }
        return null
    }

    return (
        <div>
            <header>My App Header {auth.isLoggedIn && auth.user && (
  <span>Welcome, {auth.user.first_name} {auth.user.last_name}</span>
)}</header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export const rootRoute = createRootRouteWithContext()({
    component: RootLayout,
})

export const Route = rootRoute;
