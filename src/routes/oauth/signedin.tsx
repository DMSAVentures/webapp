// /oauth/signedin page at root for TanStack Router
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../__root'

function OAuthSignedInPage() {
    console.log('OAuthSignedInPage');
  return (
    <div>
      <h2>OAuth Signed In</h2>
      <p>You have successfully signed in with OAuth.</p>
    </div>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/oauth/signedin',
  component: OAuthSignedInPage,
})
