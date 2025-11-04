// /signin page at root for TanStack Router
import { createRoute, createFileRoute } from "@tanstack/react-router";
import Login from "@/components/authentication/login";
import "./signin.scss";
import { rootRoute } from "@/routes/__root";

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

export const Route = createRoute("/signin")({
	getParentRoute: () => rootRoute,
	path: "/signin",
	component: SignInPage,
});
