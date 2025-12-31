/**
 * AccountPage Component
 * Container component for account and subscription management
 */

import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useEffect } from "react";
import PlanCard from "@/components/billing/plans/planCard";
import PlanToPay from "@/components/billing/plans/planPay";
import { ErrorState } from "@/components/error/error";
import { useCancelSubscription } from "@/hooks/useCancelSubscription";
import { useGetAllPrices } from "@/hooks/useGetAllPrices";
import { useGetCurrentSubscription } from "@/hooks/useGetCurrentSubscription";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { useBannerCenter } from "@/proto-design-system/components/feedback/BannerCenter";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import styles from "./component.module.scss";

// ============================================================================
// Types
// ============================================================================

interface Subscription {
	priceId: string | null;
	status: string;
	nextBillingDate: Date;
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for subscription actions (cancel, navigate) */
function useSubscriptionActions(refetch: () => void) {
	const navigate = useNavigate();
	const { addBanner } = useBannerCenter();
	const {
		cancelSubscription,
		error: errorCancelSub,
		data,
	} = useCancelSubscription();

	// Refetch subscription after cancel
	useEffect(() => {
		if (data) {
			refetch();
		}
	}, [data, refetch]);

	// Show error banner if cancel fails
	useEffect(() => {
		if (errorCancelSub) {
			addBanner({
				type: "error",
				title: "Failed to cancel subscription",
				description: errorCancelSub,
				dismissible: true,
			});
		}
	}, [errorCancelSub, addBanner]);

	const handleUpdatePaymentMethod = useCallback(() => {
		navigate({ to: "/billing/payment_method" });
	}, [navigate]);

	const handleResubscribe = useCallback(() => {
		navigate({ to: "/billing/plans" });
	}, [navigate]);

	return {
		cancelSubscription,
		handleUpdatePaymentMethod,
		handleResubscribe,
	};
}

// ============================================================================
// Sub-Components
// ============================================================================

interface SubscriptionStatusProps {
	subscription: Subscription;
}

/** Subscription status display */
const SubscriptionStatus = memo(function SubscriptionStatus({
	subscription,
}: SubscriptionStatusProps) {
	return (
		<div className={styles.billing}>
			<h5>Subscription</h5>
			<PlanCard priceId={subscription.priceId!} />
			<div className={styles.billingStatus}>
				<p>Status:</p>
				<Badge
					variant={subscription.status === "active" ? "success" : "warning"}
					size="md"
				>
					{subscription.status}
				</Badge>
			</div>
			{subscription.status === "active" && (
				<p>
					Next billing date: {subscription.nextBillingDate.toLocaleDateString()}
				</p>
			)}
		</div>
	);
});

SubscriptionStatus.displayName = "SubscriptionStatus";

interface SubscriptionActionsProps {
	status: string;
	onCancel: () => void;
	onResubscribe: () => void;
	onUpdatePayment: () => void;
}

/** Subscription action buttons */
const SubscriptionActions = memo(function SubscriptionActions({
	status,
	onCancel,
	onResubscribe,
	onUpdatePayment,
}: SubscriptionActionsProps) {
	return (
		<div className={styles.billingButtons}>
			{status === "active" && (
				<>
					<Button variant="secondary" onClick={onCancel}>
						Cancel
					</Button>
					<Button>Change Plan</Button>
				</>
			)}
			{status === "canceled" && (
				<Button onClick={onResubscribe}>Resubscribe</Button>
			)}
			<Button onClick={onUpdatePayment}>Update Payment Method</Button>
		</div>
	);
});

SubscriptionActions.displayName = "SubscriptionActions";

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
		<Stack gap="lg" animate>
			<div className={styles.noSubscription}>
				<h3>Choose a Plan</h3>
				<p className={styles.noSubscriptionText}>
					You don't have an active subscription. Select a plan below to get
					started.
				</p>
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
			</div>
		</Stack>
	);
});

NoSubscriptionState.displayName = "NoSubscriptionState";

// ============================================================================
// Component
// ============================================================================

/**
 * AccountPage displays subscription and account management
 */
export const AccountPage = memo(function AccountPage() {
	// Hooks
	const { loading, error, currentSubscription, refetch } =
		useGetCurrentSubscription();
	const { cancelSubscription, handleUpdatePaymentMethod, handleResubscribe } =
		useSubscriptionActions(refetch);

	// Loading state
	if (loading) {
		return <Spinner size="lg" />;
	}

	// No subscription - show available plans
	if (error?.error === "no active subscription found" || !currentSubscription) {
		return <NoSubscriptionState />;
	}

	// Error state
	if (error) {
		return <ErrorState message={`Something went wrong: ${error.error}`} />;
	}

	return (
		<Stack gap="lg" animate>
			<SubscriptionStatus subscription={currentSubscription} />
			<div style={{ maxWidth: "400px" }}>
				<SubscriptionActions
					status={currentSubscription.status}
					onCancel={cancelSubscription}
					onResubscribe={handleResubscribe}
					onUpdatePayment={handleUpdatePaymentMethod}
				/>
			</div>
		</Stack>
	);
});

AccountPage.displayName = "AccountPage";
