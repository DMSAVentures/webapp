/**
 * WebhookManager Component
 * Manages webhooks for a campaign
 */

import { type HTMLAttributes, memo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import type { Webhook } from "@/types/common.types";
import styles from "./component.module.scss";

export interface WebhookManagerProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign ID for the webhooks */
	campaignId: string;
	/** List of webhooks */
	webhooks: Webhook[];
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

/**
 * Maps webhook status to StatusBadge variant
 */
const getStatusVariant = (
	status: Webhook["status"],
): "completed" | "disabled" => {
	return status === "active" ? "completed" : "disabled";
};

/**
 * Gets display text for status
 */
const getStatusText = (status: Webhook["status"]): string => {
	return status === "active" ? "Active" : "Inactive";
};

/**
 * Formats event name for display
 */
const formatEventName = (event: string): string => {
	return event
		.split(".")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
};

/**
 * Truncates URL for display
 */
const truncateUrl = (url: string, maxLength: number = 50): string => {
	if (url.length <= maxLength) return url;
	return `${url.slice(0, maxLength)}...`;
};

/**
 * Calculates webhook health status
 */
const getWebhookHealth = (
	webhook: Webhook,
): "healthy" | "warning" | "error" => {
	if (webhook.stats.totalAttempts === 0) return "warning";

	const successRate =
		webhook.stats.successfulDeliveries / webhook.stats.totalAttempts;

	if (successRate >= 0.95) return "healthy";
	if (successRate >= 0.7) return "warning";
	return "error";
};

/**
 * Gets health icon class
 */
const getHealthIcon = (health: "healthy" | "warning" | "error"): string => {
	switch (health) {
		case "healthy":
			return "ri-check-line";
		case "warning":
			return "ri-alert-line";
		case "error":
			return "ri-close-line";
	}
};

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
		const [expandedWebhookId, setExpandedWebhookId] = useState<string | null>(
			null,
		);

		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		// Empty state
		if (!loading && webhooks.length === 0) {
			return (
				<div className={styles.emptyState}>
					<div className={styles.emptyStateIcon}>
						<i className="ri-webhook-line" aria-hidden="true" />
					</div>
					<h3 className={styles.emptyStateTitle}>No webhooks configured</h3>
					<p className={styles.emptyStateDescription}>
						Create a webhook to receive real-time events from your campaign
					</p>
					{onCreate && (
						<Button onClick={onCreate} variant="primary" leftIcon="ri-add-line">
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
						<Button onClick={onCreate} variant="primary" leftIcon="ri-add-line">
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
							const isExpanded = expandedWebhookId === webhook.id;
							const health = getWebhookHealth(webhook);

							return (
								<div key={webhook.id} className={styles.webhookCard}>
									{/* Main row */}
									<div className={styles.webhookMain}>
										{/* Info */}
										<div className={styles.webhookInfo}>
											<div className={styles.webhookHeader}>
												<h3 className={styles.webhookName}>{webhook.name}</h3>
												<StatusBadge
													text={getStatusText(webhook.status)}
													variant={getStatusVariant(webhook.status)}
													styleType="stroke"
												/>
											</div>

											<div className={styles.webhookUrl}>
												<i className="ri-link" aria-hidden="true" />
												<span title={webhook.url}>
													{truncateUrl(webhook.url)}
												</span>
											</div>

											<div className={styles.webhookMeta}>
												<div className={styles.metaItem}>
													<i
														className="ri-calendar-event-line"
														aria-hidden="true"
													/>
													<span>{webhook.events.length} events</span>
												</div>
												{webhook.stats.totalAttempts > 0 && (
													<div
														className={`${styles.metaItem} ${styles[`health_${health}`]}`}
													>
														<i
															className={getHealthIcon(health)}
															aria-hidden="true"
														/>
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
													size="small"
													onClick={() => onTest(webhook.id)}
													leftIcon="ri-send-plane-line"
												>
													Test
												</Button>
											)}
											{onViewLogs && (
												<Button
													variant="secondary"
													size="small"
													onClick={() => onViewLogs(webhook.id)}
													leftIcon="ri-file-list-3-line"
												>
													Logs
												</Button>
											)}
											{onEdit && (
												<IconOnlyButton
													iconClass="edit-line"
													variant="secondary"
													ariaLabel="Edit webhook"
													onClick={() => onEdit(webhook.id)}
												/>
											)}
											{onDelete && (
												<IconOnlyButton
													iconClass="delete-bin-line"
													variant="secondary"
													ariaLabel="Delete webhook"
													onClick={() => onDelete(webhook.id)}
												/>
											)}
											<IconOnlyButton
												iconClass={
													isExpanded ? "arrow-up-s-line" : "arrow-down-s-line"
												}
												variant="secondary"
												ariaLabel={isExpanded ? "Collapse" : "Expand"}
												onClick={() =>
													setExpandedWebhookId(isExpanded ? null : webhook.id)
												}
											/>
										</div>
									</div>

									{/* Expanded details */}
									{isExpanded && (
										<>
											<ContentDivider size="thin" />
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
																	{new Date(
																		webhook.stats.lastDeliveryAt,
																	).toLocaleDateString("en-US", {
																		month: "short",
																		day: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																	})}
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
