import { createFileRoute } from "@tanstack/react-router";
import PlanToPay from "@/components/billing/plans/planPay";
import { ErrorState } from "@/components/error/error";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import { useGetAllPrices } from "@/hooks/useGetAllPrices";
import { Column } from "@/proto-design-system/UIShell/Column/Column";

export const Route = createFileRoute("/billing/plans")({
	component: RouteComponent,
});

function Page() {
	const { loading, prices, error } = useGetAllPrices();

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorState message={`Something went wrong: ${error}`} />;
	}

	if (!prices?.length) {
		return <div>No pricing plans available.</div>;
	}

	return (
		<>
			<Column sm={{ span: 7, start: 1 }}>
				<h3>Plans</h3>
			</Column>
			<Column
				sm={{ span: 7, start: 1 }}
				md={{ start: 1, span: 7 }}
				lg={{ start: 1, span: 11 }}
				xlg={{ start: 1, span: 13 }}
			>
				<div className={"plans"}>
					{prices.map((price) => (
						<PlanToPay
							key={price.price_id}
							product_id={price.product_id}
							price_id={price.price_id}
							description={price.description}
						/>
					))}
				</div>
			</Column>
		</>
	);
}

function RouteComponent() {
	return <Page />;
}
