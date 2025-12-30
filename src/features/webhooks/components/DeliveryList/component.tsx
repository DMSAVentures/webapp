/**
 * DeliveryList Component
 * Display webhook delivery history with expandable details
 */

import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Fragment, type HTMLAttributes, memo, useState } from "react";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button, ButtonGroup } from "@/proto-design-system/components/primitives/Button";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Pagination } from "@/proto-design-system/components/navigation/Pagination";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/proto-design-system/components/data/Table";
import type { DeliveryStatus, WebhookDelivery } from "@/types/webhook";
import styles from "./component.module.scss";

export interface DeliveryListProps extends HTMLAttributes<HTMLDivElement> {
	/** Deliveries to display */
	deliveries: WebhookDelivery[];
	/** Loading state */
	loading?: boolean;
	/** Pagination - current page */
	currentPage?: number;
	/** Pagination - total pages */
	totalPages?: number;
	/** Pagination - items per page */
	pageSize?: number;
	/** Max retries configured for the webhook */
	maxRetries?: number;
	/** Page change handler */
	onPageChange?: (page: number) => void;
	/** Refresh handler */
	onRefresh?: () => void;
	/** Additional CSS class name */
	className?: string;
}

const getStatusVariant = (
	status: DeliveryStatus,
): "success" | "error" | "warning" => {
	switch (status) {
		case "success":
			return "success";
		case "failed":
			return "error";
		case "pending":
			return "warning";
		default:
			return "warning";
	}
};

const formatDuration = (ms?: number): string => {
	if (!ms) return "-";
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
};

const formatStatus = (status: DeliveryStatus): string => {
	return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * DeliveryList displays webhook delivery history
 */
type FilterType = "all" | "pending" | "failed";

export const DeliveryList = memo<DeliveryListProps>(function DeliveryList({
	deliveries,
	loading = false,
	currentPage = 1,
	totalPages = 1,
	pageSize = 20,
	maxRetries,
	onPageChange,
	onRefresh,
	className: customClassName,
	...props
}) {
	const [expandedDeliveryId, setExpandedDeliveryId] = useState<string | null>(
		null,
	);
	const [filter, setFilter] = useState<FilterType>("all");

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	const toggleDelivery = (deliveryId: string) => {
		setExpandedDeliveryId((prev) => (prev === deliveryId ? null : deliveryId));
	};

	// Filter deliveries based on selected filter
	const filteredDeliveries = (() => {
		switch (filter) {
			case "pending":
				// Deliveries in progress (initial or retrying)
				return deliveries.filter((d) => d.attemptNumber < 5);
			case "failed":
				// Permanently failed deliveries (all retries exhausted)
				return deliveries.filter((d) => d.status === "failed");
			default:
				return deliveries;
		}
	})();

	// Empty state
	if (!loading && deliveries.length === 0) {
		return (
			<EmptyState
				title="No deliveries yet"
				description="Webhook deliveries will appear here when events are triggered"
				icon="list-check"
			/>
		);
	}

	return (
		<div className={classNames} {...props}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<ButtonGroup aria-label="Filter deliveries">
						<Button
							variant={filter === "all" ? "primary" : "secondary"}
							size="sm"
							onClick={() => setFilter("all")}
						>
							All
						</Button>
						<Button
							variant={filter === "failed" ? "primary" : "secondary"}
							size="sm"
							onClick={() => setFilter("failed")}
						>
							Failed
						</Button>
					</ButtonGroup>
					<div className={styles.resultsInfo}>
						{filteredDeliveries.length} deliver
						{filteredDeliveries.length !== 1 ? "ies" : "y"}
						{filter !== "all" &&
							deliveries.length > 0 &&
							` of ${deliveries.length} total`}
					</div>
				</div>
				{onRefresh && (
					<Button
						variant="secondary"
						size="sm"
						leftIcon={<RefreshCw size={14} />}
						onClick={onRefresh}
					>
						Refresh
					</Button>
				)}
			</div>

			{/* Main content */}
			<div className={styles.main}>
				{!loading && filteredDeliveries.length === 0 ? (
					<EmptyState
						title={
							filter === "pending"
								? "No deliveries in progress"
								: filter === "failed"
									? "No failed deliveries"
									: "No deliveries"
						}
						description={
							filter === "pending"
								? "No deliveries are currently being attempted or retried"
								: filter === "failed"
									? "All webhook deliveries were successful or are still being retried"
									: "Webhook deliveries will appear here when events are triggered"
						}
						icon="list-check"
					/>
				) : (
					<Table loading={loading} loadingMessage="Loading deliveries...">
						<TableHeader>
							<TableRow>
								<TableHead>Status</TableHead>
								<TableHead>Event</TableHead>
								<TableHead>Response</TableHead>
								<TableHead>Duration</TableHead>
								<TableHead>Attempt</TableHead>
								<TableHead>Next Retry</TableHead>
								<TableHead>Created At</TableHead>
								<TableHead />
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredDeliveries.map((delivery) => (
								<Fragment key={delivery.id}>
									<TableRow
										onClick={() => toggleDelivery(delivery.id)}
									>
										<TableCell>
											<Badge
												variant={getStatusVariant(delivery.status)}
											>
												{formatStatus(delivery.status)}
											</Badge>
										</TableCell>
										<TableCell>
											<span className={styles.eventType}>
												{delivery.eventType}
											</span>
										</TableCell>
										<TableCell>
											{delivery.responseStatus ? (
												<span
													className={`${styles.statusCode} ${delivery.responseStatus >= 200 && delivery.responseStatus < 300 ? styles.statusCodeSuccess : styles.statusCodeError}`}
												>
													{delivery.responseStatus}
												</span>
											) : (
												<span className={styles.noResponse}>-</span>
											)}
										</TableCell>
										<TableCell>
											<span className={styles.duration}>
												{formatDuration(delivery.durationMs)}
											</span>
										</TableCell>
										<TableCell>
											<span className={styles.attempt}>
												{maxRetries
													? `${delivery.status === "pending" ? delivery.attemptNumber - 1 : delivery.attemptNumber} / ${maxRetries}`
													: delivery.status === "pending"
														? delivery.attemptNumber - 1
														: delivery.attemptNumber}
											</span>
										</TableCell>
										<TableCell>
											{delivery.nextRetryAt && delivery.attemptNumber < 5 ? (
												<span className={styles.nextRetry}>
													{new Date(delivery.nextRetryAt).toLocaleString()}
												</span>
											) : (
												<span className={styles.noRetry}>-</span>
											)}
										</TableCell>
										<TableCell>
											<span className={styles.timestamp}>
												{new Date(delivery.createdAt).toLocaleString()}
											</span>
										</TableCell>
										<TableCell>
											<div className={styles.expandIcon}>
												<Icon
													icon={expandedDeliveryId === delivery.id ? ChevronUp : ChevronDown}
													size="sm"
													color="muted"
												/>
											</div>
										</TableCell>
									</TableRow>
									{expandedDeliveryId === delivery.id && (
										<TableRow>
											<TableCell>
												<div className={styles.detailsContent}>
													{delivery.errorMessage && (
														<div className={styles.errorMessage}>
															<strong>Error:</strong> {delivery.errorMessage}
														</div>
													)}

													<div className={styles.detailSection}>
														<h4 className={styles.detailTitle}>Request Payload</h4>
														<pre className={styles.codeBlock}>
															{JSON.stringify(delivery.payload, null, 2)}
														</pre>
													</div>

													{delivery.responseBody && (
														<div className={styles.detailSection}>
															<h4 className={styles.detailTitle}>Response Body</h4>
															<pre className={styles.codeBlock}>
																{delivery.responseBody}
															</pre>
														</div>
													)}

													{delivery.deliveredAt && (
														<div className={styles.detailMeta}>
															<span className={styles.metaItem}>
																<strong>Delivered at:</strong>{" "}
																{new Date(delivery.deliveredAt).toLocaleString()}
															</span>
														</div>
													)}
												</div>
											</TableCell>
											<TableCell />
											<TableCell />
											<TableCell />
											<TableCell />
											<TableCell />
											<TableCell />
											<TableCell />
										</TableRow>
									)}
								</Fragment>
							))}
						</TableBody>
					</Table>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className={styles.pagination}>
						<Pagination
							page={currentPage}
							totalPages={totalPages}
							onPageChange={onPageChange ?? (() => undefined)}
						/>
					</div>
				)}
			</div>
		</div>
	);
});

DeliveryList.displayName = "DeliveryList";
