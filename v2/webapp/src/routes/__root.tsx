import {createRootRouteWithContext, Outlet} from '@tanstack/react-router'
import {AuthContext} from "@/contexts/auth.tsx";

interface MyRouterContext {
    auth: ReturnType<typeof AuthContext>
}

// This is the actual layout component
function RootLayout() {
    return (
        <div>
            <header>My App Header</header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: RootLayout,
})
