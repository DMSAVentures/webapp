// /oauth/signedin page at root for TanStack Router
import { createRoute, createFileRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

function OAuthSignedInPage() {
	console.log("OAuthSignedInPage");
	return (
		<div>
			<h2>OAuth Signed In</h2>
			<p>You have successfully signed in with OAuth.</p>
		</div>
	)
}

export const Route = createRoute("/oauth/signedin")({
	getParentRoute: () => rootRoute,
	path: "/oauth/signedin",
	component: OAuthSignedInPage,
});
