/**
 * IntegrationList Component
 * Displays available integrations with their connection status
 */

import { type HTMLAttributes, memo, useMemo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import { TabMenuHorizontal } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontal";
import { TabMenuHorizontalItem } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontalItem";
import type { Integration } from "@/types/common.types";
import styles from "./component.module.scss";

export interface IntegrationListProps extends HTMLAttributes<HTMLDivElement> {
	/** List of integrations to display */
	integrations: Integration[];
	/** Connect handler */
	onConnect?: (integrationId: string) => void;
	/** Configure handler */
	onConfigure?: (integrationId: string) => void;
	/** Disconnect handler */
	onDisconnect?: (integrationId: string) => void;
	/** Loading state */
	loading?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Integration category type
 */
type IntegrationCategory = "all" | "email" | "crm" | "analytics" | "webhook";

/**
 * Category options for tab menu
 */
const CATEGORY_OPTIONS: { label: string; value: IntegrationCategory }[] = [
	{ label: "All", value: "all" },
	{ label: "Email", value: "email" },
	{ label: "CRM", value: "crm" },
	{ label: "Analytics", value: "analytics" },
	{ label: "Webhook", value: "webhook" },
];

/**
 * Maps integration type to category
 */
const getIntegrationCategory = (
	type: Integration["type"],
): IntegrationCategory => {
	switch (type) {
		case "mailchimp":
			return "email";
		case "hubspot":
		case "salesforce":
			return "crm";
		case "google_analytics":
		case "facebook_pixel":
			return "analytics";
		case "zapier":
		case "webhook":
			return "webhook";
		default:
			return "webhook";
	}
};

/**
 * Maps status to StatusBadge variant
 */
const getStatusVariant = (
	status: Integration["status"],
): "completed" | "pending" | "failed" | "disabled" => {
	switch (status) {
		case "connected":
			return "completed";
		case "disconnected":
			return "disabled";
		case "error":
			return "failed";
		default:
			return "pending";
	}
};

/**
 * Gets display text for status
 */
const getStatusText = (status: Integration["status"]): string => {
	switch (status) {
		case "connected":
			return "Connected";
		case "disconnected":
			return "Not Connected";
		case "error":
			return "Error";
		default:
			return "Unknown";
	}
};

/**
 * Gets integration icon class
 */
const getIntegrationIcon = (type: Integration["type"]): string => {
	switch (type) {
		case "zapier":
			return "ri-flashlight-line";
		case "webhook":
			return "ri-webhook-line";
		case "mailchimp":
			return "ri-mail-line";
		case "hubspot":
			return "ri-customer-service-2-line";
		case "salesforce":
			return "ri-building-line";
		case "google_analytics":
			return "ri-line-chart-line";
		case "facebook_pixel":
			return "ri-facebook-box-line";
		default:
			return "ri-plug-line";
	}
};

/**
 * Gets integration description
 */
const getIntegrationDescription = (type: Integration["type"]): string => {
	switch (type) {
		case "zapier":
			return "Connect to thousands of apps with automated workflows";
		case "webhook":
			return "Send real-time events to your custom endpoints";
		case "mailchimp":
			return "Sync your contacts with Mailchimp email campaigns";
		case "hubspot":
			return "Integrate with HubSpot CRM for sales and marketing";
		case "salesforce":
			return "Connect to Salesforce for enterprise CRM integration";
		case "google_analytics":
			return "Track campaign performance with Google Analytics";
		case "facebook_pixel":
			return "Optimize Facebook ads with pixel tracking";
		default:
			return "Custom integration for your specific needs";
	}
};

/**
 * IntegrationList displays available integrations in a filterable grid
 */
export const IntegrationList = memo<IntegrationListProps>(
	function IntegrationList({
		integrations,
		onConnect,
		onConfigure,
		onDisconnect,
		loading = false,
		className: customClassName,
		...props
	}) {
		const [categoryFilter, setCategoryFilter] =
			useState<IntegrationCategory>("all");

		// Filter integrations by category
		const filteredIntegrations = useMemo(() => {
			if (categoryFilter === "all") {
				return integrations;
			}
			return integrations.filter(
				(integration) =>
					getIntegrationCategory(integration.type) === categoryFilter,
			);
		}, [integrations, categoryFilter]);

		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		// Empty state
		if (!loading && integrations.length === 0) {
			return (
				<div className={styles.emptyState}>
					<div className={styles.emptyStateIcon}>
						<i className="ri-plug-line" aria-hidden="true" />
					</div>
					<h3 className={styles.emptyStateTitle}>No integrations available</h3>
					<p className={styles.emptyStateDescription}>
						Check back later for available integrations
					</p>
				</div>
			);
		}

		const activeTabIndex = CATEGORY_OPTIONS.findIndex(
			(opt) => opt.value === categoryFilter,
		);

		return (
			<div className={classNames} {...props}>
				{/* Category filter */}
				<div className={styles.header}>
					<TabMenuHorizontal
						items={CATEGORY_OPTIONS.map((option) => (
							<TabMenuHorizontalItem
								key={option.value}
								text={option.label}
								active={categoryFilter === option.value}
							/>
						))}
						activeTab={activeTabIndex}
						onTabClick={(index) => setCategoryFilter(CATEGORY_OPTIONS[index].value)}
					/>
				</div>

				{/* Results info */}
				<div className={styles.resultsInfo}>
					{filteredIntegrations.length} integration
					{filteredIntegrations.length !== 1 ? "s" : ""}
				</div>

				{/* Integration grid */}
				{loading ? (
					<div className={styles.integrationGrid}>
						{[...Array(6)].map((_, i) => (
							<div key={i} className={styles.skeletonCard} />
						))}
					</div>
				) : filteredIntegrations.length === 0 ? (
					<div className={styles.noResults}>
						<i className="ri-search-line" aria-hidden="true" />
						<p>No integrations found in this category</p>
						<Button onClick={() => setCategoryFilter("all")} variant="secondary">
							View all integrations
						</Button>
					</div>
				) : (
					<div className={styles.integrationGrid}>
						{filteredIntegrations.map((integration) => (
							<div key={integration.id} className={styles.integrationCard}>
								{/* Icon */}
								<div className={styles.integrationIcon}>
									<i
										className={getIntegrationIcon(integration.type)}
										aria-hidden="true"
									/>
								</div>

								{/* Content */}
								<div className={styles.integrationContent}>
									<div className={styles.integrationHeader}>
										<h3 className={styles.integrationTitle}>{integration.name}</h3>
										<StatusBadge
											text={getStatusText(integration.status)}
											variant={getStatusVariant(integration.status)}
											styleType="stroke"
										/>
									</div>

									<p className={styles.integrationDescription}>
										{getIntegrationDescription(integration.type)}
									</p>

									{/* Last synced info */}
									{integration.status === "connected" &&
										integration.lastSyncedAt && (
											<div className={styles.lastSynced}>
												<i className="ri-refresh-line" aria-hidden="true" />
												<span>
													Last synced{" "}
													{new Date(integration.lastSyncedAt).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
															year: "numeric",
														},
													)}
												</span>
											</div>
										)}
								</div>

								{/* Actions */}
								<div className={styles.integrationActions}>
									{integration.status === "disconnected" && onConnect && (
										<Button
											variant="primary"
											onClick={() => onConnect(integration.id)}
											leftIcon="ri-plug-line"
										>
											Connect
										</Button>
									)}
									{integration.status === "connected" && (
										<>
											{onConfigure && (
												<Button
													variant="secondary"
													onClick={() => onConfigure(integration.id)}
													leftIcon="ri-settings-3-line"
												>
													Configure
												</Button>
											)}
											{onDisconnect && (
												<Button
													variant="tertiary"
													onClick={() => onDisconnect(integration.id)}
													leftIcon="ri-uninstall-line"
												>
													Disconnect
												</Button>
											)}
										</>
									)}
									{integration.status === "error" && (
										<>
											{onConfigure && (
												<Button
													variant="primary"
													size="small"
													onClick={() => onConfigure(integration.id)}
													leftIcon="ri-error-warning-line"
												>
													Fix Error
												</Button>
											)}
											{onDisconnect && (
												<Button
													variant="tertiary"
													size="small"
													onClick={() => onDisconnect(integration.id)}
												>
													Disconnect
												</Button>
											)}
										</>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	},
);

IntegrationList.displayName = "IntegrationList";
