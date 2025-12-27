import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
	useZapierDisconnect,
	useZapierStatus,
	useZapierSubscriptions,
} from "@/hooks/useZapierIntegration";
import { Button } from "@/proto-design-system/Button/button";
import Feedback from "@/proto-design-system/feedback/feedback";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import Modal from "@/proto-design-system/modal/modal";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import styles from "./integrations.module.scss";

export const Route = createFileRoute("/integrations/")({
	component: IntegrationsPage,
});

function IntegrationsPage() {
	const {
		data: zapierStatus,
		loading: statusLoading,
		refetch: refetchStatus,
	} = useZapierStatus();
	const {
		data: subscriptions,
		loading: subsLoading,
		refetch: refetchSubs,
	} = useZapierSubscriptions();
	const { disconnect, loading: disconnecting } = useZapierDisconnect();

	const [showDisconnectModal, setShowDisconnectModal] = useState(false);
	const [feedback, setFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const handleConnect = () => {
		// Zapier uses API key authentication - users connect from the Zapier app
		// Direct users to the API keys page to create a key with 'zapier' scope
		window.location.href = "/api-keys";
	};

	const handleDisconnect = async () => {
		const success = await disconnect();
		setShowDisconnectModal(false);

		if (success) {
			setFeedback({
				type: "success",
				message: "Zapier disconnected successfully",
			});
			refetchStatus();
			refetchSubs();
		} else {
			setFeedback({
				type: "error",
				message: "Failed to disconnect Zapier",
			});
		}

		setTimeout(() => setFeedback(null), 4000);
	};

	const loading = statusLoading || subsLoading;

	return (
		<div className={styles.page}>
			{/* Header */}
			<header className={styles.header}>
				<h1 className={styles.title}>Integrations</h1>
				<p className={styles.description}>
					Connect your favorite apps to automate your workflow
				</p>
			</header>

			{/* Feedback */}
			{feedback && (
				<Feedback
					feedbackType={feedback.type}
					variant="light"
					size="small"
					alertTitle={feedback.message}
					dismissable
				/>
			)}

			{/* Content */}
			<div className={styles.content}>
				{/* Zapier Integration */}
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Automation</h2>

					<div className={styles.integrationCard}>
						<div className={styles.integrationIcon}>
							<i className="ri-flashlight-line" aria-hidden="true" />
						</div>

						<div className={styles.integrationInfo}>
							<h3 className={styles.integrationName}>Zapier</h3>
							<p className={styles.integrationDescription}>
								Connect to thousands of apps with automated workflows. Trigger
								Zaps when users sign up, verify, or earn rewards.
							</p>
							{zapierStatus?.connected && (
								<div className={styles.integrationStatus}>
									<StatusBadge
										text="Connected"
										variant="completed"
										styleType="stroke"
									/>
									<span>
										{zapierStatus.active_subscriptions} active subscription
										{zapierStatus.active_subscriptions !== 1 ? "s" : ""}
									</span>
								</div>
							)}
						</div>

						<div className={styles.integrationActions}>
							{loading ? (
								<LoadingSpinner size="small" />
							) : zapierStatus?.connected ? (
								<>
									<Button
										variant="secondary"
										onClick={() => setShowDisconnectModal(true)}
										leftIcon="ri-uninstall-line"
									>
										Disconnect
									</Button>
								</>
							) : (
								<Button
									variant="primary"
									onClick={handleConnect}
									leftIcon="ri-key-2-line"
								>
									Get API Key
								</Button>
							)}
						</div>
					</div>

					{/* Subscriptions List */}
					{zapierStatus?.connected && (
						<div className={styles.subscriptionsList}>
							<h4 className={styles.sectionTitle}>Active Subscriptions</h4>
							{subscriptions.length === 0 ? (
								<div className={styles.emptySubscriptions}>
									<p>No active Zapier subscriptions.</p>
									<p>Create a Zap in Zapier to subscribe to events.</p>
								</div>
							) : (
								subscriptions.map((sub) => (
									<div key={sub.id} className={styles.subscriptionItem}>
										<div className={styles.subscriptionInfo}>
											<span className={styles.subscriptionEvent}>
												{formatEventType(sub.event_type)}
											</span>
											<span className={styles.subscriptionMeta}>
												{sub.trigger_count} trigger
												{sub.trigger_count !== 1 ? "s" : ""}
												{sub.last_triggered_at && (
													<>
														{" "}
														| Last triggered {formatDate(sub.last_triggered_at)}
													</>
												)}
											</span>
										</div>
										<StatusBadge
											text={sub.status}
											variant={
												sub.status === "active" ? "completed" : "pending"
											}
											styleType="stroke"
										/>
									</div>
								))
							)}
						</div>
					)}
				</section>

				{/* Coming Soon */}
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Coming Soon</h2>

					<div className={styles.integrationCard} style={{ opacity: 0.6 }}>
						<div className={styles.integrationIcon}>
							<i className="ri-slack-line" aria-hidden="true" />
						</div>
						<div className={styles.integrationInfo}>
							<h3 className={styles.integrationName}>Slack</h3>
							<p className={styles.integrationDescription}>
								Get real-time notifications in your Slack channels when users
								sign up or reach milestones.
							</p>
						</div>
						<Button variant="secondary" disabled>
							Coming Soon
						</Button>
					</div>
				</section>
			</div>

			{/* Disconnect Modal */}
			<Modal
				isOpen={showDisconnectModal}
				onClose={() => setShowDisconnectModal(false)}
				title="Disconnect Zapier"
				description="Are you sure you want to disconnect Zapier? This will remove all active subscriptions and stop triggering any connected Zaps."
				icon="warning"
				proceedText={disconnecting ? "Disconnecting..." : "Disconnect"}
				cancelText="Cancel"
				onProceed={handleDisconnect}
				onCancel={() => setShowDisconnectModal(false)}
			/>
		</div>
	);
}

/**
 * Formats event type for display
 */
function formatEventType(eventType: string): string {
	return eventType
		.replace(/\./g, " ")
		.replace(/_/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Formats date for display
 */
function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}
