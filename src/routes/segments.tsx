import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useTier } from "@/contexts/tier";

export const Route = createFileRoute("/segments")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isAtLeast } = useTier();

	// Gate access to pro tier
	if (!isAtLeast("pro")) {
		return <Navigate to="/billing/plans" />;
	}

	return <Outlet />;
}
