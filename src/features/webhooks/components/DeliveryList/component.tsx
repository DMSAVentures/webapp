/**
 * DeliveryList Component
 * Display webhook delivery history with expandable details
 */

import { Fragment, type HTMLAttributes, memo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import ButtonGroup from "@/proto-design-system/buttongroup/buttongroup";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import Pagination from "@/proto-design-system/pagination/pagination";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import { Table } from "@/proto-design-system/Table";
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
): "completed" | "failed" | "pending" => {
	switch (status) {
		case "success":
			return "completed";
		case "failed":
			return "failed";
		case "pending":
			return "pending";
		default:
			return "pending";
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
				return deliveries.filter((d) => d.attempt_number < 5);
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
					<ButtonGroup
						size="small"
						ariaLabel="Filter deliveries"
						items={[
							{
								text: "All",
								icon: "ri-list-check",
								iconPosition: "left",
								iconOnly: false,
								selected: filter === "all",
								onClick: () => setFilter("all"),
							},
							{
								text: "Failed",
								icon: "ri-close-circle-line",
								iconPosition: "left",
								iconOnly: false,
								selected: filter === "failed",
								onClick: () => setFilter("failed"),
							},
						]}
					/>
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
						size="small"
						leftIcon="ri-refresh-line"
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
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Status</Table.HeaderCell>
								<Table.HeaderCell>Event</Table.HeaderCell>
								<Table.HeaderCell>Response</Table.HeaderCell>
								<Table.HeaderCell>Duration</Table.HeaderCell>
								<Table.HeaderCell>Attempt</Table.HeaderCell>
								<Table.HeaderCell>Next Retry</Table.HeaderCell>
								<Table.HeaderCell>Created At</Table.HeaderCell>
								<Table.HeaderCell narrow />
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{filteredDeliveries.map((delivery) => (
								<Fragment key={delivery.id}>
									<Table.Row
										expandable
										expanded={expandedDeliveryId === delivery.id}
										onClick={() => toggleDelivery(delivery.id)}
									>
										<Table.Cell fitContent>
											<StatusBadge
												text={formatStatus(delivery.status)}
												variant={getStatusVariant(delivery.status)}
												styleType="light"
											/>
										</Table.Cell>
										<Table.Cell>
											<span className={styles.eventType}>
												{delivery.event_type}
											</span>
										</Table.Cell>
										<Table.Cell>
											{delivery.response_status ? (
												<span
													className={`${styles.statusCode} ${delivery.response_status >= 200 && delivery.response_status < 300 ? styles.statusCodeSuccess : styles.statusCodeError}`}
												>
													{delivery.response_status}
												</span>
											) : (
												<span className={styles.noResponse}>-</span>
											)}
										</Table.Cell>
										<Table.Cell>
											<span className={styles.duration}>
												{formatDuration(delivery.duration_ms)}
											</span>
										</Table.Cell>
										<Table.Cell>
											<span className={styles.attempt}>
												{maxRetries
													? `${delivery.status === "pending" ? delivery.attempt_number - 1 : delivery.attempt_number} / ${maxRetries}`
													: delivery.status === "pending"
														? delivery.attempt_number - 1
														: delivery.attempt_number}
											</span>
										</Table.Cell>
										<Table.Cell>
											{delivery.next_retry_at && delivery.attempt_number < 5 ? (
												<span className={styles.nextRetry}>
													{new Date(delivery.next_retry_at).toLocaleString()}
												</span>
											) : (
												<span className={styles.noRetry}>-</span>
											)}
										</Table.Cell>
										<Table.Cell>
											<span className={styles.timestamp}>
												{new Date(delivery.created_at).toLocaleString()}
											</span>
										</Table.Cell>
										<Table.Cell narrow>
											<div className={styles.expandIcon}>
												<i
													className={`ri-arrow-${expandedDeliveryId === delivery.id ? "up" : "down"}-s-line`}
												/>
											</div>
										</Table.Cell>
									</Table.Row>
									<Table.ExpandedRow
										colSpan={8}
										expanded={expandedDeliveryId === delivery.id}
									>
										<div className={styles.detailsContent}>
											{delivery.error_message && (
												<div className={styles.errorMessage}>
													<strong>Error:</strong> {delivery.error_message}
												</div>
											)}

											<div className={styles.detailSection}>
												<h4 className={styles.detailTitle}>Request Payload</h4>
												<pre className={styles.codeBlock}>
													{JSON.stringify(delivery.payload, null, 2)}
												</pre>
											</div>

											{delivery.response_body && (
												<div className={styles.detailSection}>
													<h4 className={styles.detailTitle}>Response Body</h4>
													<pre className={styles.codeBlock}>
														{delivery.response_body}
													</pre>
												</div>
											)}

											{delivery.delivered_at && (
												<div className={styles.detailMeta}>
													<span className={styles.metaItem}>
														<strong>Delivered at:</strong>{" "}
														{new Date(delivery.delivered_at).toLocaleString()}
													</span>
												</div>
											)}
										</div>
									</Table.ExpandedRow>
								</Fragment>
							))}
						</Table.Body>
					</Table>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className={styles.pagination}>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							itemsPerPage={pageSize}
							style="rounded"
							onPageChange={onPageChange ?? (() => undefined)}
						/>
					</div>
				)}
			</div>
		</div>
	);
});

DeliveryList.displayName = "DeliveryList";
