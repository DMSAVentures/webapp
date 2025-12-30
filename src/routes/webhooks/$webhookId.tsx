import { Send } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ErrorState } from "@/components/error/error";
import { DeliveryList } from "@/features/webhooks/components/DeliveryList/component";
import { useGetWebhook } from "@/hooks/useGetWebhook";
import { useGetWebhookDeliveries } from "@/hooks/useGetWebhookDeliveries";
import { useTestWebhook } from "@/hooks/useTestWebhook";
import { Button, Breadcrumb, Toast, Spinner } from "@/proto-design-system";
import styles from "./webhookDetail.module.scss";

export const Route = createFileRoute("/webhooks/$webhookId")({
	component: RouteComponent,
});

const DEFAULT_PAGE_SIZE = 20;

function RouteComponent() {
	const { webhookId } = Route.useParams();
	const [page, setPage] = useState(1);
	const [testFeedback, setTestFeedback] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);

	const { data: webhook, loading: webhookLoading } = useGetWebhook(webhookId);
	const { data, loading, error, refetch } = useGetWebhookDeliveries(webhookId, {
		page,
		limit: DEFAULT_PAGE_SIZE,
	});
	const { testWebhook } = useTestWebhook();

	const handleTest = async () => {
		setTestFeedback(null);

		try {
			const success = await testWebhook(webhookId);
			setTestFeedback({
				type: success ? "success" : "error",
				message: success
					? "Test webhook sent successfully"
					: "Failed to send test webhook",
			});

			if (success) {
				// Refresh deliveries after a short delay
				setTimeout(() => refetch(), 1000);
			}
		} catch {
			setTestFeedback({
				type: "error",
				message: "Failed to send test webhook",
			});
		}

		// Auto-dismiss after 4 seconds
		setTimeout(() => setTestFeedback(null), 4000);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	if (webhookLoading) {
		return (
			<Spinner
				size="lg"
				label="Loading webhook..."
			/>
		);
	}

	if (error) {
		return <ErrorState message={`Failed to load deliveries: ${error.error}`} />;
	}

	const deliveries = data?.deliveries || [];
	const totalPages = Math.ceil((data?.total || 0) / DEFAULT_PAGE_SIZE);

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerActions}>
					<Breadcrumb
						items={[
							{ label: "Webhooks", href: "/webhooks" },
							{ label: "Delivery History" },
						]}
					/>
				</div>
				<div className={styles.headerTop}>
					<div className={styles.headerContent}>
						<h1 className={styles.pageTitle}>Delivery History</h1>
						{webhook && (
							<>
								<p className={styles.pageDescription}>{webhook.url}</p>
								<p className={styles.retryInfo}>
									{webhook.retryEnabled
										? `Retries enabled (max ${webhook.maxRetries} attempts)`
										: "Retries disabled"}
								</p>
							</>
						)}
					</div>
					<Button
						variant="secondary"
						leftIcon={<Send size={16} />}
						onClick={handleTest}
						disabled={webhook?.status !== "active"}
					>
						Send Test
					</Button>
				</div>

				{testFeedback && (
					<Toast
						variant={testFeedback.type === "success" ? "success" : "error"}
						title={testFeedback.message}
						closable
					>
						{testFeedback.message}
					</Toast>
				)}
			</div>

			<div className={styles.pageContent}>
				<DeliveryList
					deliveries={deliveries}
					loading={loading}
					currentPage={page}
					totalPages={totalPages}
					pageSize={DEFAULT_PAGE_SIZE}
					maxRetries={webhook?.maxRetries}
					onPageChange={handlePageChange}
					onRefresh={refetch}
				/>
			</div>
		</motion.div>
	);
}
