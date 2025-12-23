import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ErrorState } from "@/components/error/error";
import { useDeleteWebhook } from "@/hooks/useDeleteWebhook";
import { useGetWebhooks } from "@/hooks/useGetWebhooks";
import { useTestWebhook } from "@/hooks/useTestWebhook";
import { Badge } from "@/proto-design-system/badge/badge";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import Feedback from "@/proto-design-system/feedback/feedback";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { WebhookStatus } from "@/types/webhook";
import styles from "./webhooks.module.scss";

export const Route = createFileRoute("/webhooks/")({
	component: RouteComponent,
});

interface TestFeedback {
	webhookId: string;
	type: "success" | "error";
	message: string;
}

function RouteComponent() {
	const navigate = useNavigate();
	const { data: webhooks, loading, error, refetch } = useGetWebhooks();
	const { deleteWebhook } = useDeleteWebhook();
	const { testWebhook } = useTestWebhook();

	const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
	const [testFeedback, setTestFeedback] = useState<TestFeedback | null>(null);

	const handleCreateWebhook = () => {
		navigate({ to: "/webhooks/new" });
	};

	const handleDelete = async (webhookId: string) => {
		if (confirm(`Are you sure you want to delete this webhook?`)) {
			const success = await deleteWebhook(webhookId);
			if (success) {
				refetch();
			}
		}
	};

	const handleTest = async (webhookId: string) => {
		setTestingWebhookId(webhookId);
		setTestFeedback(null);

		try {
			const success = await testWebhook(webhookId);

			setTestFeedback({
				webhookId,
				type: success ? "success" : "error",
				message: success
					? "Test webhook sent successfully"
					: "Failed to send test webhook",
			});
		} catch {
			setTestFeedback({
				webhookId,
				type: "error",
				message: "Failed to send test webhook",
			});
		} finally {
			setTestingWebhookId(null);

			// Auto-dismiss after 4 seconds
			setTimeout(() => {
				setTestFeedback((current) =>
					current?.webhookId === webhookId ? null : current
				);
			}, 4000);
		}
	};

	const handleViewDeliveries = (webhookId: string) => {
		navigate({ to: `/webhooks/${webhookId}` });
	};

	if (loading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading webhooks..."
			/>
		);
	}

	if (error) {
		return <ErrorState message={`Failed to load webhooks: ${error.error}`} />;
	}

	const getStatusBadge = (status: WebhookStatus) => {
		switch (status) {
			case "active":
				return <Badge variant="green" text="Active" styleType="light" size="small" />;
			case "paused":
				return <Badge variant="yellow" text="Paused" styleType="light" size="small" />;
			case "failed":
				return <Badge variant="red" text="Failed" styleType="light" size="small" />;
			default:
				return <Badge variant="gray" text={status} styleType="light" size="small" />;
		}
	};

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Webhooks</h1>
					<p className={styles.pageDescription}>
						Configure webhook endpoints to receive real-time notifications when events occur
					</p>
				</div>
				<Button
					variant="primary"
					leftIcon="ri-add-line"
					onClick={handleCreateWebhook}
				>
					Create Webhook
				</Button>
			</div>

			<div className={styles.pageContent}>
				{!webhooks || webhooks.length === 0 ? (
					<EmptyState
						icon="webhook-line"
						title="No webhooks configured"
						description="Create a webhook to receive real-time notifications when users sign up, verify their email, or other events occur."
						action={{
							label: "Create Your First Webhook",
							onClick: handleCreateWebhook,
						}}
					/>
				) : (
					<div className={styles.webhooksList}>
						{webhooks.map((webhook) => (
							<div key={webhook.id} className={styles.webhookCard}>
								<div className={styles.webhookHeader}>
									<div className={styles.webhookInfo}>
										<p className={styles.webhookUrl}>{webhook.url}</p>
										<div className={styles.webhookMeta}>
											{getStatusBadge(webhook.status)}
											<span>Created {new Date(webhook.created_at).toLocaleDateString()}</span>
										</div>
									</div>
									<div className={styles.webhookActions}>
										<Button
											variant="secondary"
											size="small"
											onClick={() => handleTest(webhook.id)}
											disabled={testingWebhookId === webhook.id || webhook.status !== "active"}
										>
											{testingWebhookId === webhook.id ? "Sending..." : "Test"}
										</Button>
										<IconOnlyButton
											ariaLabel="View deliveries"
											variant="secondary"
											iconClass="list-check"
											onClick={() => handleViewDeliveries(webhook.id)}
										/>
										<IconOnlyButton
											ariaLabel="Delete webhook"
											variant="secondary"
											iconClass="delete-bin-line"
											onClick={() => handleDelete(webhook.id)}
										/>
									</div>
								</div>

								{testFeedback?.webhookId === webhook.id && (
									<Feedback
										feedbackType={testFeedback.type}
										variant="light"
										size="small"
										alertTitle={testFeedback.message}
										dismissable
									/>
								)}

								<div className={styles.webhookEvents}>
									{webhook.events.map((event) => (
										<Badge key={event} variant="gray" text={event} styleType="lighter" size="small" />
									))}
								</div>

								<div className={styles.webhookStats}>
									<div className={styles.statItem}>
										<span className={styles.statLabel}>Delivered:</span>
										<span className={`${styles.statValue} ${styles.statValueSuccess}`}>
											{webhook.total_sent}
										</span>
									</div>
									<div className={styles.statItem}>
										<span className={styles.statLabel}>Failed:</span>
										<span className={`${styles.statValue} ${webhook.total_failed > 0 ? styles.statValueError : ''}`}>
											{webhook.total_failed}
										</span>
									</div>
									{webhook.last_success_at && (
										<div className={styles.statItem}>
											<span className={styles.statLabel}>Last success:</span>
											<span className={styles.statValue}>
												{new Date(webhook.last_success_at).toLocaleString()}
											</span>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
}
