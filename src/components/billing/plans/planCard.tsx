"use client";
import { useGetAllPrices } from "@/hooks/useGetAllPrices";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";

interface PlanCardProps {
	priceId: string;
}
export default function PlanCard(props: PlanCardProps) {
	const { loading, error, prices } = useGetAllPrices();

	if (loading) {
		return <LoadingSpinner size="medium" mode="centered" message="Loading plan details..." />;
	}

	if (error) {
		return (
			<EmptyState
				icon="error-warning-line"
				title="Error loading plans"
				description={error}
			/>
		);
	}

	const price = prices?.find((price) => price.price_id === props.priceId);

	if (!price) {
		return (
			<EmptyState
				icon="price-tag-3-line"
				title="Price not found"
				description="The requested pricing plan could not be found."
			/>
		);
	}

	return (
		<div>
			<p>Plan: {price.description}</p>
		</div>
	);
}
