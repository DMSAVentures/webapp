import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import {AuthProvider, loadAuth} from "@/contexts/auth.tsx";


const user = await loadAuth()
// Create a new router instance
const router = createRouter({ routeTree, context: { auth: { user } } })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
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
