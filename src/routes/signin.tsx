// /signin page at root for TanStack Router
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import Login from '@/components/authentication/login'
import './signin.scss'

function SignInPage() {
  return (
    <div className="login-page">
      <div className="centered-container">
        <h6>Welcome</h6>
        <Login />
      </div>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signin',
  component: SignInPage,
})
