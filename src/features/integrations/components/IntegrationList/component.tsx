/**
 * IntegrationList Component
 * Displays available integrations with their connection status
 */

import {
	AlertTriangle,
	Building2,
	ChartLine,
	HeadsetIcon,
	type LucideIcon,
	Mail,
	Plug,
	RefreshCw,
	Search,
	Settings,
	Trash2,
	Webhook,
	Zap,
} from "lucide-react";
import { type HTMLAttributes, memo, useMemo, useState } from "react";
import {
	Tab,
	TabList,
	Tabs,
} from "@/proto-design-system/components/navigation/Tabs";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import type { Integration } from "@/types/common.types";
import "remixicon/fonts/remixicon.css";
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
): "success" | "warning" | "error" | "secondary" => {
	switch (status) {
		case "connected":
			return "success";
		case "disconnected":
			return "secondary";
		case "error":
			return "error";
		default:
			return "warning";
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
 * Gets integration icon - returns Lucide icon or RemixIcon class for brand icons
 */
const getIntegrationIcon = (type: Integration["type"]): LucideIcon | string => {
	switch (type) {
		case "zapier":
			return Zap;
		case "webhook":
			return Webhook;
		case "mailchimp":
			return Mail;
		case "hubspot":
			return HeadsetIcon;
		case "salesforce":
			return Building2;
		case "google_analytics":
			return ChartLine;
		case "facebook_pixel":
			return "ri-facebook-box-line"; // Brand icon - keep as RemixIcon
		default:
			return Plug;
	}
};

/**
 * Check if icon is a Lucide icon
 */
const isLucideIcon = (icon: LucideIcon | string): icon is LucideIcon => {
	return typeof icon !== "string";
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
						<Icon icon={Plug} size="2xl" />
					</div>
					<h3 className={styles.emptyStateTitle}>No integrations available</h3>
					<p className={styles.emptyStateDescription}>
						Check back later for available integrations
					</p>
				</div>
			);
		}

		return (
			<div className={classNames} {...props}>
				{/* Category filter */}
				<div className={styles.header}>
					<Tabs
						activeTab={categoryFilter}
						onTabChange={(tabId) =>
							setCategoryFilter(tabId as IntegrationCategory)
						}
					>
						<TabList aria-label="Integration categories">
							{CATEGORY_OPTIONS.map((option) => (
								<Tab key={option.value} id={option.value}>
									{option.label}
								</Tab>
							))}
						</TabList>
					</Tabs>
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
						<Icon icon={Search} size="lg" />
						<p>No integrations found in this category</p>
						<Button
							onClick={() => setCategoryFilter("all")}
							variant="secondary"
						>
							View all integrations
						</Button>
					</div>
				) : (
					<div className={styles.integrationGrid}>
						{filteredIntegrations.map((integration) => {
							const integrationIcon = getIntegrationIcon(integration.type);
							return (
								<div key={integration.id} className={styles.integrationCard}>
									{/* Icon */}
									<div className={styles.integrationIcon}>
										{isLucideIcon(integrationIcon) ? (
											<Icon icon={integrationIcon} size="lg" />
										) : (
											<i className={integrationIcon} aria-hidden="true" />
										)}
									</div>

									{/* Content */}
									<div className={styles.integrationContent}>
										<div className={styles.integrationHeader}>
											<h3 className={styles.integrationTitle}>
												{integration.name}
											</h3>
											<Badge variant={getStatusVariant(integration.status)}>
												{getStatusText(integration.status)}
											</Badge>
										</div>

										<p className={styles.integrationDescription}>
											{getIntegrationDescription(integration.type)}
										</p>

										{/* Last synced info */}
										{integration.status === "connected" &&
											integration.lastSyncedAt && (
												<div className={styles.lastSynced}>
													<Icon icon={RefreshCw} size="sm" />
													<span>
														Last synced{" "}
														{new Date(
															integration.lastSyncedAt,
														).toLocaleDateString("en-US", {
															month: "short",
															day: "numeric",
															year: "numeric",
														})}
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
												leftIcon={<Plug size={16} />}
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
														leftIcon={<Settings size={16} />}
													>
														Configure
													</Button>
												)}
												{onDisconnect && (
													<Button
														variant="secondary"
														onClick={() => onDisconnect(integration.id)}
														leftIcon={<Trash2 size={16} />}
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
														size="sm"
														onClick={() => onConfigure(integration.id)}
														leftIcon={<AlertTriangle size={16} />}
													>
														Fix Error
													</Button>
												)}
												{onDisconnect && (
													<Button
														variant="secondary"
														size="sm"
														onClick={() => onDisconnect(integration.id)}
													>
														Disconnect
													</Button>
												)}
											</>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	},
);

IntegrationList.displayName = "IntegrationList";
