import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blasts")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
