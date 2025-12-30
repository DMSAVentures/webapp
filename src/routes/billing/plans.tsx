import { createFileRoute } from "@tanstack/react-router";
import PlanToPay from "@/components/billing/plans/planPay";
import { ErrorState } from "@/components/error/error";
import { useGetAllPrices } from "@/hooks/useGetAllPrices";
import { Spinner } from "@/proto-design-system";

export const Route = createFileRoute("/billing/plans")({
	component: RouteComponent,
});

function Page() {
	const { loading, prices, error } = useGetAllPrices();

	if (loading) {
		return <Spinner />;
	}

	if (error) {
		return <ErrorState message={`Something went wrong: ${error}`} />;
	}

	if (!prices?.length) {
		return <div>No pricing plans available.</div>;
	}

	return (
		<>
			<div>
				<h3>Plans</h3>
			</div>
			<div>
				<div className={"plans"}>
					{prices.map((price) => (
						<PlanToPay
							key={price.priceId}
							productId={price.productId}
							priceId={price.priceId}
							description={price.description}
						/>
					))}
				</div>
			</div>
		</>
	);
}

function RouteComponent() {
	return <Page />;
}
