import { createFileRoute } from "@tanstack/react-router";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import { useCreateCustomerPortal } from "@/hooks/useCreateCustomerPortal";

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
