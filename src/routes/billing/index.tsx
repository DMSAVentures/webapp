import { createFileRoute } from "@tanstack/react-router";
import { useCreateCustomerPortal } from "@/hooks/useCreateCustomerPortal";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";

export const Route = createFileRoute("/billing/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, error, loading } = useCreateCustomerPortal();

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div>
			<h1>Customer Portal</h1>
			<a href={data?.url}>Go to Customer Portal</a>
		</div>
	);
}
