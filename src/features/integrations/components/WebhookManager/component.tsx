/**
 * WebhookManager Component
 * Manages webhooks for a campaign
 */

import {
	AlertTriangle,
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
	FileText,
	Link2,
	Pencil,
	Plus,
	Send,
	Trash2,
	Webhook,
	X,
} from "lucide-react";
import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import type { Webhook as WebhookType } from "@/types/common.types";
import styles from "./component.module.scss";

export interface WebhookManagerProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign ID for the webhooks */
	campaignId: string;
	/** List of webhooks */
	webhooks: WebhookType[];
	/** Create webhook handler */
	onCreate?: () => void;
	/** Edit webhook handler */
	onEdit?: (webhookId: string) => void;
	/** Delete webhook handler */
	onDelete?: (webhookId: string) => void;
	/** Test webhook handler */
	onTest?: (webhookId: string) => void;
	/** View logs handler */
	onViewLogs?: (webhookId: string) => void;
	/** Loading state */
	loading?: boolean;
	/** Additional CSS class name */
	className?: string;
}

type WebhookHealth = "healthy" | "warning" | "error";

// ============================================================================
// Pure Functions
// ============================================================================

/** Maps webhook status to StatusBadge variant */
function getStatusVariant(
	status: WebhookType["status"],
): "success" | "secondary" {
	return status === "active" ? "success" : "secondary";
}

/** Gets display text for status */
function getStatusText(status: WebhookType["status"]): string {
	return status === "active" ? "Active" : "Inactive";
}

/** Formats event name for display (e.g., "user.signup" -> "User Signup") */
function formatEventName(event: string): string {
	return event
		.split(".")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

/** Truncates URL for display */
function truncateUrl(url: string, maxLength: number = 50): string {
	if (url.length <= maxLength) return url;
	return `${url.slice(0, maxLength)}...`;
}

/** Calculates webhook health status based on delivery success rate */
function getWebhookHealth(webhook: WebhookType): WebhookHealth {
	if (webhook.stats.totalAttempts === 0) return "warning";

	const successRate =
		webhook.stats.successfulDeliveries / webhook.stats.totalAttempts;

	if (successRate >= 0.95) return "healthy";
	if (successRate >= 0.7) return "warning";
	return "error";
}

/** Gets icon for health status */
function HealthIcon({ health }: { health: WebhookHealth }) {
	switch (health) {
		case "healthy":
			return <Icon icon={Check} size="sm" />;
		case "warning":
			return <Icon icon={AlertTriangle} size="sm" />;
		case "error":
			return <Icon icon={X} size="sm" />;
	}
}

/** Formats last delivery date for display */
function formatLastDelivery(date: string | Date): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing webhook expansion state */
function useWebhookExpansion() {
	const [expandedWebhookId, setExpandedWebhookId] = useState<string | null>(
		null,
	);

	const isExpanded = useCallback(
		(webhookId: string) => expandedWebhookId === webhookId,
		[expandedWebhookId],
	);

	const toggleExpanded = useCallback((webhookId: string) => {
		setExpandedWebhookId((current) =>
			current === webhookId ? null : webhookId,
		);
	}, []);

	return {
		isExpanded,
		toggleExpanded,
	};
}

// ============================================================================
// Component
// ============================================================================

/**
 * WebhookManager displays and manages webhooks for a campaign
 */
export const WebhookManager = memo<WebhookManagerProps>(
	function WebhookManager({
		campaignId,
		webhooks,
		onCreate,
		onEdit,
		onDelete,
		onTest,
		onViewLogs,
		loading = false,
		className: customClassName,
		...props
	}) {
		// Hooks
		const { isExpanded, toggleExpanded } = useWebhookExpansion();

		// Derived state
		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		// Empty state
		if (!loading && webhooks.length === 0) {
			return (
				<div className={styles.emptyState}>
					<div className={styles.emptyStateIcon}>
						<Icon icon={Webhook} size="2xl" />
					</div>
					<h3 className={styles.emptyStateTitle}>No webhooks configured</h3>
					<p className={styles.emptyStateDescription}>
						Create a webhook to receive real-time events from your campaign
					</p>
					{onCreate && (
						<Button
							onClick={onCreate}
							variant="primary"
							leftIcon={<Plus size={16} />}
						>
							Create Webhook
						</Button>
					)}
				</div>
			);
		}

		return (
			<div className={classNames} {...props}>
				{/* Header */}
				<div className={styles.header}>
					<div className={styles.headerContent}>
						<h2 className={styles.title}>Webhooks</h2>
						<p className={styles.subtitle}>
							Manage webhooks to receive real-time events
						</p>
					</div>
					{onCreate && (
						<Button
							onClick={onCreate}
							variant="primary"
							leftIcon={<Plus size={16} />}
						>
							Create Webhook
						</Button>
					)}
				</div>

				{/* Webhook list */}
				{loading ? (
					<div className={styles.webhookList}>
						{[...Array(3)].map((_, i) => (
							<div key={i} className={styles.skeletonCard} />
						))}
					</div>
				) : (
					<div className={styles.webhookList}>
						{webhooks.map((webhook) => {
							const webhookIsExpanded = isExpanded(webhook.id);
							const health = getWebhookHealth(webhook);

							return (
								<div key={webhook.id} className={styles.webhookCard}>
									{/* Main row */}
									<div className={styles.webhookMain}>
										{/* Info */}
										<div className={styles.webhookInfo}>
											<div className={styles.webhookHeader}>
												<h3 className={styles.webhookName}>{webhook.name}</h3>
												<Badge variant={getStatusVariant(webhook.status)}>
													{getStatusText(webhook.status)}
												</Badge>
											</div>

											<div className={styles.webhookUrl}>
												<Icon icon={Link2} size="sm" />
												<span title={webhook.url}>
													{truncateUrl(webhook.url)}
												</span>
											</div>

											<div className={styles.webhookMeta}>
												<div className={styles.metaItem}>
													<Icon icon={Calendar} size="sm" />
													<span>{webhook.events.length} events</span>
												</div>
												{webhook.stats.totalAttempts > 0 && (
													<div
														className={`${styles.metaItem} ${styles[`health_${health}`]}`}
													>
														<HealthIcon health={health} />
														<span>
															{webhook.stats.successfulDeliveries}/
															{webhook.stats.totalAttempts} delivered
														</span>
													</div>
												)}
											</div>
										</div>

										{/* Actions */}
										<div className={styles.webhookActions}>
											{onTest && (
												<Button
													variant="secondary"
													size="sm"
													onClick={() => onTest(webhook.id)}
													leftIcon={<Send size={16} />}
												>
													Test
												</Button>
											)}
											{onViewLogs && (
												<Button
													variant="secondary"
													size="sm"
													onClick={() => onViewLogs(webhook.id)}
													leftIcon={<FileText size={16} />}
												>
													Logs
												</Button>
											)}
											{onEdit && (
												<Button
													leftIcon={<Pencil size={16} />}
													variant="secondary"
													aria-label="Edit webhook"
													onClick={() => onEdit(webhook.id)}
												/>
											)}
											{onDelete && (
												<Button
													leftIcon={<Trash2 size={16} />}
													variant="secondary"
													aria-label="Delete webhook"
													onClick={() => onDelete(webhook.id)}
												/>
											)}
											<Button
												leftIcon={
													webhookIsExpanded ? (
														<ChevronUp size={16} />
													) : (
														<ChevronDown size={16} />
													)
												}
												variant="secondary"
												aria-label={webhookIsExpanded ? "Collapse" : "Expand"}
												onClick={() => toggleExpanded(webhook.id)}
											/>
										</div>
									</div>

									{/* Expanded details */}
									{webhookIsExpanded && (
										<>
											<Divider />
											<div className={styles.webhookDetails}>
												{/* Events */}
												<div className={styles.detailSection}>
													<h4 className={styles.detailTitle}>Events</h4>
													<div className={styles.eventList}>
														{webhook.events.map((event) => (
															<span key={event} className={styles.eventBadge}>
																{formatEventName(event)}
															</span>
														))}
													</div>
												</div>

												{/* Stats */}
												<div className={styles.detailSection}>
													<h4 className={styles.detailTitle}>Statistics</h4>
													<div className={styles.statsGrid}>
														<div className={styles.statCard}>
															<span className={styles.statLabel}>
																Total Attempts
															</span>
															<span className={styles.statValue}>
																{webhook.stats.totalAttempts.toLocaleString()}
															</span>
														</div>
														<div className={styles.statCard}>
															<span className={styles.statLabel}>
																Successful
															</span>
															<span
																className={`${styles.statValue} ${styles.statSuccess}`}
															>
																{webhook.stats.successfulDeliveries.toLocaleString()}
															</span>
														</div>
														<div className={styles.statCard}>
															<span className={styles.statLabel}>Failed</span>
															<span
																className={`${styles.statValue} ${styles.statError}`}
															>
																{webhook.stats.failedDeliveries.toLocaleString()}
															</span>
														</div>
														{webhook.stats.lastDeliveryAt && (
															<div className={styles.statCard}>
																<span className={styles.statLabel}>
																	Last Delivery
																</span>
																<span className={styles.statValue}>
																	{formatLastDelivery(
																		webhook.stats.lastDeliveryAt,
																	)}
																</span>
															</div>
														)}
													</div>
												</div>

												{/* Retry config */}
												<div className={styles.detailSection}>
													<h4 className={styles.detailTitle}>
														Retry Configuration
													</h4>
													<div className={styles.retryConfig}>
														<div className={styles.configItem}>
															<span className={styles.configLabel}>
																Max Attempts:
															</span>
															<span className={styles.configValue}>
																{webhook.retryConfig.maxAttempts}
															</span>
														</div>
														<div className={styles.configItem}>
															<span className={styles.configLabel}>
																Backoff Multiplier:
															</span>
															<span className={styles.configValue}>
																{webhook.retryConfig.backoffMultiplier}x
															</span>
														</div>
													</div>
												</div>
											</div>
										</>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	},
);

WebhookManager.displayName = "WebhookManager";
