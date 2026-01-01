import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ErrorState } from "@/components/error/error";
import { useDeleteWebhook } from "@/hooks/useDeleteWebhook";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useGetWebhooks } from "@/hooks/useGetWebhooks";
import { useTestWebhook } from "@/hooks/useTestWebhook";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Banner } from "@/proto-design-system/components/feedback/Banner";
import { Toast } from "@/proto-design-system/components/feedback/Toast";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Modal } from "@/proto-design-system/components/overlays/Modal";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
	const { hasAccess, requiredTierDisplayName } =
		useFeatureAccess("webhooks_zapier");

	const { data: webhooks, loading, error, refetch } = useGetWebhooks();
	const { deleteWebhook, error: deleteError } = useDeleteWebhook();
	const { testWebhook } = useTestWebhook();

	const [testingWebhookId, setTestingWebhookId] = useState<string | null>(null);
	const [testFeedback, setTestFeedback] = useState<TestFeedback | null>(null);
	const [deleteWebhookId, setDeleteWebhookId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteFeedback, setDeleteFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const handleCreateWebhook = () => {
		if (!hasAccess) return;
		navigate({ to: "/webhooks/new" });
	};

	const handleDeleteClick = (webhookId: string) => {
		setDeleteWebhookId(webhookId);
	};

	const handleDeleteConfirm = async () => {
		if (!deleteWebhookId) return;

		setIsDeleting(true);
		setDeleteFeedback(null);
		const success = await deleteWebhook(deleteWebhookId);
		setIsDeleting(false);
		setDeleteWebhookId(null);

		if (success) {
			setDeleteFeedback({
				type: "success",
				message: "Webhook deleted successfully",
			});
			refetch();
		} else {
			setDeleteFeedback({
				type: "error",
				message: deleteError?.error || "Failed to delete webhook",
			});
		}

		// Auto-dismiss feedback after 4 seconds
		setTimeout(() => {
			setDeleteFeedback(null);
		}, 4000);
	};

	const handleDeleteCancel = () => {
		setDeleteWebhookId(null);
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
					current?.webhookId === webhookId ? null : current,
				);
			}, 4000);
		}
	};

	const handleViewDeliveries = (webhookId: string) => {
		navigate({ to: `/webhooks/${webhookId}` });
	};

	if (loading) {
		return <Spinner size="lg" label="Loading webhooks..." />;
	}

	if (error) {
		return <ErrorState message={`Failed to load webhooks: ${error.error}`} />;
	}

	const getStatusBadge = (status: WebhookStatus) => {
		switch (status) {
			case "active":
				return (
					<Badge variant="success" size="sm">
						Active
					</Badge>
				);
			case "paused":
				return (
					<Badge variant="warning" size="sm">
						Paused
					</Badge>
				);
			case "failed":
				return (
					<Badge variant="error" size="sm">
						Failed
					</Badge>
				);
			default:
				return (
					<Badge variant="secondary" size="sm">
						{status}
					</Badge>
				);
		}
	};

	return (
		<Stack gap="lg" className={styles.page} animate>
			<Stack direction="row" justify="between" align="start" wrap>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Webhooks
					</Text>
					<Text color="muted">
						Configure webhook endpoints to receive real-time notifications when
						events occur
					</Text>
				</Stack>
				<Button
					variant="primary"
					leftIcon={<Plus size={16} />}
					onClick={handleCreateWebhook}
					disabled={!hasAccess}
				>
					Create Webhook
				</Button>
			</Stack>

			{/* Team Feature Banner */}
			{!hasAccess && (
				<Banner
					type="feature"
					variant="lighter"
					title={`${requiredTierDisplayName} Feature`}
					description={`Upgrade to ${requiredTierDisplayName} to create webhooks and receive real-time notifications.`}
					action={<a href="/billing/plans">Upgrade</a>}
					dismissible={false}
				/>
			)}

			{deleteFeedback && (
				<Toast
					variant={deleteFeedback.type === "success" ? "success" : "error"}
					title={deleteFeedback.message}
					closable
				>
					{deleteFeedback.message}
				</Toast>
			)}

			<div className={styles.pageContent}>
				{!webhooks || webhooks.length === 0 ? (
					<EmptyState
						title="No webhooks configured"
						description="Create a webhook to receive real-time notifications when users sign up, verify their email, or other events occur."
						action={
							<Button
								variant="primary"
								onClick={handleCreateWebhook}
								disabled={!hasAccess}
							>
								Create Your First Webhook
							</Button>
						}
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
											<span>
												Created{" "}
												{new Date(webhook.createdAt).toLocaleDateString()}
											</span>
										</div>
									</div>
									<div className={styles.webhookActions}>
										<Button
											variant="secondary"
											size="sm"
											onClick={() => handleTest(webhook.id)}
											disabled={
												testingWebhookId === webhook.id ||
												webhook.status !== "active"
											}
										>
											{testingWebhookId === webhook.id ? "Sending..." : "Test"}
										</Button>
										<Button
											aria-label="View deliveries"
											variant="secondary"
											leftIcon={<ListChecks size={16} />}
											onClick={() => handleViewDeliveries(webhook.id)}
										/>
										<Button
											aria-label="Delete webhook"
											variant="secondary"
											leftIcon={<Trash2 size={16} />}
											onClick={() => handleDeleteClick(webhook.id)}
										/>
									</div>
								</div>

								{testFeedback?.webhookId === webhook.id && (
									<Toast
										variant={
											testFeedback.type === "success" ? "success" : "error"
										}
										title={testFeedback.message}
										closable
									>
										{testFeedback.message}
									</Toast>
								)}

								<div className={styles.webhookEvents}>
									{webhook.events.map((event) => (
										<Badge key={event} variant="secondary" size="sm">
											{event}
										</Badge>
									))}
								</div>

								<div className={styles.webhookStats}>
									<div className={styles.statItem}>
										<span className={styles.statLabel}>Delivered:</span>
										<span
											className={`${styles.statValue} ${styles.statValueSuccess}`}
										>
											{webhook.totalSent}
										</span>
									</div>
									<div className={styles.statItem}>
										<span className={styles.statLabel}>Failed:</span>
										<span
											className={`${styles.statValue} ${webhook.totalFailed > 0 ? styles.statValueError : ""}`}
										>
											{webhook.totalFailed}
										</span>
									</div>
									{webhook.lastSuccessAt && (
										<div className={styles.statItem}>
											<span className={styles.statLabel}>Last success:</span>
											<span className={styles.statValue}>
												{new Date(webhook.lastSuccessAt).toLocaleString()}
											</span>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			<Modal
				isOpen={deleteWebhookId !== null}
				onClose={handleDeleteCancel}
				title="Delete Webhook"
				description="Are you sure you want to delete this webhook? This action cannot be undone."
				iconVariant="warning"
				footer={
					<>
						<Button variant="secondary" onClick={handleDeleteCancel}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteConfirm}
							isLoading={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</>
				}
			>
				{null}
			</Modal>
		</Stack>
	);
}
