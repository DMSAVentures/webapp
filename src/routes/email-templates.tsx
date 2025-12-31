import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/email-templates")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
