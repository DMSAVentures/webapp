import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/segments")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
