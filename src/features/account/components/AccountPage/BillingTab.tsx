/**
 * BillingTab Component
 * Displays current subscription and allows plan changes
 */

import { useNavigate } from "@tanstack/react-router";
import { memo } from "react";
import PlanCard from "@/components/billing/plans/planCard";
import PlanToPay from "@/components/billing/plans/planPay";
import { ErrorState } from "@/components/error/error";
import { useGetAllPrices } from "@/hooks/useGetAllPrices";
import { useGetCurrentSubscription } from "@/hooks/useGetCurrentSubscription";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import styles from "./component.module.scss";

// ============================================================================
// Sub-Components
// ============================================================================

interface CurrentPlanProps {
	priceId: string;
	status: string;
	nextBillingDate: Date;
	onChangePlan: () => void;
}

/** Current plan display */
const CurrentPlan = memo(function CurrentPlan({
	priceId,
	status,
	nextBillingDate,
	onChangePlan,
}: CurrentPlanProps) {
	return (
		<Stack gap="lg">
			<Stack gap="md">
				<Text as="h3" size="lg" weight="medium">
					Current Plan
				</Text>
				<PlanCard priceId={priceId} />
				<Stack direction="row" gap="sm" align="center">
					<Text color="secondary">Status:</Text>
					<Badge
						variant={status === "active" ? "success" : "warning"}
						size="md"
					>
						{status}
					</Badge>
				</Stack>
				{status === "active" && (
					<Text color="secondary">
						Next billing date: {nextBillingDate.toLocaleDateString()}
					</Text>
				)}
			</Stack>
			<div>
				<Button variant="primary" onClick={onChangePlan}>
					Change Plan
				</Button>
			</div>
		</Stack>
	);
});

CurrentPlan.displayName = "CurrentPlan";

/** No subscription state - shows available plans */
const NoSubscriptionState = memo(function NoSubscriptionState() {
	const { loading, prices, error } = useGetAllPrices();

	if (loading) {
		return <Spinner size="lg" />;
	}

	if (error) {
		return <ErrorState message={`Failed to load plans: ${error}`} />;
	}

	if (!prices?.length) {
		return <EmptyState title="No pricing plans available" />;
	}

	return (
		<Stack gap="lg">
			<Stack gap="xs">
				<Text as="h3" size="lg" weight="medium">
					Choose a Plan
				</Text>
				<Text color="secondary">
					You don't have an active subscription. Select a plan below to get
					started.
				</Text>
			</Stack>
			<div className={styles.plansGrid}>
				{prices.map((price) => (
					<PlanToPay
						key={price.priceId}
						productId={price.productId}
						priceId={price.priceId}
						description={price.description}
					/>
				))}
			</div>
		</Stack>
	);
});

NoSubscriptionState.displayName = "NoSubscriptionState";

// ============================================================================
// Component
// ============================================================================

/**
 * BillingTab displays current subscription and plan options
 */
export const BillingTab = memo(function BillingTab() {
	const navigate = useNavigate();
	const { loading, error, currentSubscription } = useGetCurrentSubscription();

	const handleChangePlan = () => {
		navigate({ to: "/billing/plans" });
	};

	if (loading) {
		return (
			<div className={styles.tabContent}>
				<Spinner size="lg" />
			</div>
		);
	}

	// No subscription - show available plans
	if (error?.error === "no active subscription found" || !currentSubscription) {
		return (
			<div className={styles.tabContent}>
				<NoSubscriptionState />
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className={styles.tabContent}>
				<ErrorState message={`Something went wrong: ${error.error}`} />
			</div>
		);
	}

	return (
		<div className={styles.tabContent}>
			<CurrentPlan
				priceId={currentSubscription.priceId!}
				status={currentSubscription.status}
				nextBillingDate={currentSubscription.nextBillingDate}
				onChangePlan={handleChangePlan}
			/>
		</div>
	);
});

BillingTab.displayName = "BillingTab";
