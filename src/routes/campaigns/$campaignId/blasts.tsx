import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/campaigns/$campaignId/blasts")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
