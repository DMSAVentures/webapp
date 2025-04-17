import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import {AuthProvider, loadAuth} from "@/contexts/auth.tsx";


// Load the authenticated user (null if not authenticated or on public route)
const user = await loadAuth()

// Create a new router instance (no need to pass auth context)
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app for all routes (protected and public)
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <AuthProvider user={user}>
                <RouterProvider router={router} />
            </AuthProvider>
        </StrictMode>,
    )
}

