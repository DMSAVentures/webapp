import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ErrorState } from "@/components/error/error";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import Banner from "@/components/simpleui/banner/banner";
import { Column } from "@/components/simpleui/UIShell/Column/Column";
import { useGetCheckoutSession } from "@/hooks/useGetCheckoutSession";

interface Props {
	sessionId: string;
}

function Page(props: Props) {
	const navigate = useNavigate();
	const { error, loading, data } = useGetCheckoutSession({
		sessionID: props.sessionId!,
	});

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorState message={`Something went wrong: ${error.error}`} />;
	}

	if (data.status === "open") {
		navigate({ to: "/billing/pay" });
		return null;
	}

	if (data.status === "complete") {
		return (
			<Column
				sm={{ span: 8, start: 1 }}
				md={{ start: 1, span: 7 }}
				lg={{ start: 1, span: 11 }}
				xlg={{ start: 1, span: 15 }}
				max={{ start: 1, span: 17 }}
			>
				<Banner
					bannerType={"success"}
					variant={"filled"}
					alertTitle={"Joined!"}
					alertDescription={
						"We appreciate your business! A confirmation email will be sent to your email. "
					}
				/>
			</Column>
		);
	}

	return null;
}

export const Route = createFileRoute("/billing/payment_attempt")({
	component: RouteComponent,
});

function RouteComponent({ search }: { search: Record<string, string> }) {
	const sessionId = search.session_id;
	return <Page sessionId={sessionId} />;
}
