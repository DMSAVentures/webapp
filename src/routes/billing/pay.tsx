import { createFileRoute, useSearch } from "@tanstack/react-router";
import CustomCheckout from "@/components/billing/checkout/CustomCheckout";
import { ErrorState } from "@/components/error/error";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import Banner from "@/components/simpleui/banner/banner";
import { useCreateCheckoutSession } from "@/hooks/useCreateCheckoutSession";

export const Route = createFileRoute("/billing/pay")({
	component: RouteComponent,
});

interface Props {
	plan: string;
}

function PaymentPage(props: Props) {
	const { clientSecret, loading, error } = useCreateCheckoutSession({
		priceId: props.plan,
	});

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorState message={`Something went wrong: ${error.error}`} />;
	}

	if (!clientSecret) {
		return (
			<Banner
				bannerType="error"
				variant="filled"
				alertTitle="Error"
				alertDescription="Unable to initiate payment process"
			/>
		);
	}

	return <CustomCheckout clientSecret={clientSecret} />;
}

function RouteComponent() {
	const search: { plan: string } = useSearch({ from: "/billing/pay" });
	if (!search || !search.plan) {
		return <ErrorState message="Missing plan parameter in URL" />;
	}
	return <PaymentPage plan={search.plan} />;
}
