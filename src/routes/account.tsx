import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import PlanCard from "@/components/billing/plans/planCard";
import { EmptyState } from "@/components/empty/empty";
import { ErrorState } from "@/components/error/error";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import { Button } from "@/components/simpleui/Button/button";
import { Badge } from "@/components/simpleui/badge/badge";
import Banner from "@/components/simpleui/banner/banner";
import { Column } from "@/components/simpleui/UIShell/Column/Column";
import { useCancelSubscription } from "@/hooks/useCancelSubscription";
import { useGetCurrentSubscription } from "@/hooks/useGetCurrentSubscription";
import styles from "./account.module.scss";

export const Route = createFileRoute("/account")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Page />;
}

function Page() {
	const { loading, error, currentSubscription, refetch } =
		useGetCurrentSubscription();
	const {
		cancelSubscription,
		error: errorCancelSub,
		data,
	} = useCancelSubscription();

	const navigate = useNavigate();

	useEffect(() => {
		if (error?.error === "no active subscription found") {
			navigate({
				to: "/billing/plans",
			});
		}
	}, [error, navigate]); // Run effect when `error` changes

	useEffect(() => {
		if (data) {
			refetch();
		}
	}, [data, refetch]);

	const handlePaymentMethodUpdate = () => {
		navigate({ to: "/billing/payment_method" });
	};

	if (loading) {
		return <LoadingSpinner />;
	}
	if (error?.error === "no active subscription found") {
		return null; // Prevent rendering anything since we're navigating away
	}

	if (error) {
		return <ErrorState message={`Something went wrong: ${error.error}`} />;
	}

	if (!currentSubscription) {
		return <EmptyState message={"No subscription found"} />;
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			{errorCancelSub && (
				<Banner
					bannerType={"error"}
					variant={"filled"}
					alertTitle={"Failed to cancel subscription"}
					alertDescription={errorCancelSub}
				/>
			)}
			<Column
				sm={{ span: 7, start: 1 }}
				md={{ start: 1, span: 7 }}
				lg={{ start: 1, span: 11 }}
				xlg={{ start: 1, span: 13 }}
			>
				<div className={styles.billing}>
					<h5>Subscription</h5>
					<PlanCard priceId={currentSubscription.price_id!} />
					<div className={styles["billing-status"]}>
						<p>Status:</p>
						<Badge
							text={currentSubscription.status}
							variant={
								currentSubscription.status === "active" ? "green" : "orange"
							}
							styleType={"light"}
							size={"medium"}
						/>
					</div>
					{currentSubscription.status &&
						currentSubscription.status === "active" && (
							<p>
								Next billing date:{" "}
								{currentSubscription.next_billing_date.toLocaleDateString()}
							</p>
						)}
				</div>
			</Column>
			<Column
				sm={{ span: 5, start: 1 }}
				md={{ start: 1, span: 5 }}
				lg={{ start: 1, span: 5 }}
				xlg={{ start: 1, span: 5 }}
			>
				<div className={styles["billing-buttons"]}>
					{currentSubscription.status &&
						currentSubscription.status === "active" && (
							<>
								<Button variant={"secondary"} onClick={cancelSubscription}>
									Cancel
								</Button>
								<Button>Change Plan</Button>
							</>
						)}
					{currentSubscription.status &&
						currentSubscription.status === "canceled" && (
							<Button
								onClick={() => {
									navigate({ to: "/billing/plans" });
								}}
							>
								Resubscribe
							</Button>
						)}

					<Button onClick={handlePaymentMethodUpdate}>
						Update Payment Method
					</Button>
				</div>
			</Column>
		</motion.div>
	);
}
