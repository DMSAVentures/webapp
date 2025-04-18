import {createRootRouteWithContext, Outlet} from '@tanstack/react-router'
import {useAuth} from "@/contexts/auth"
import {Providers} from "@/contexts/providers.tsx";
import {Layout} from "@/components/simpleui/UIShell/Layout/Layout.tsx";

// Determines if the current path is a public route (e.g., /signin, /oauth/*)
function isPublicRoute(): boolean {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    return (path === '/signin' || path.startsWith('/oauth'));
}

function RootLayout() {
    const auth = useAuth()

    if (isPublicRoute()) {
        if (auth.isLoggedIn) {
            if (typeof window !== 'undefined') {
                window.location.replace('/')
            }
            return null
        } else {
            return <Outlet/>
        }
    }

    return (<Providers>
        <Layout>
            <Outlet/>
        </Layout>
    </Providers>)
}

export const rootRoute = createRootRouteWithContext()({
    component: RootLayout,
})

export const Route = rootRoute;
