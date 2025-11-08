/**
 * CampaignList Component
 * Displays a list or grid of campaign cards with filtering
 */

import { type HTMLAttributes, memo, useMemo, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import ButtonGroup from "@/proto-design-system/buttongroup/buttongroup";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import type { Campaign } from "@/types/common.types";
import { CampaignCard } from "../CampaignCard/component";
import styles from "./component.module.scss";

export interface CampaignListProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaigns to display */
	campaigns: Campaign[];
	/** View mode: list or grid */
	view?: "list" | "grid";
	/** Show filters */
	showFilters?: boolean;
	/** Show view toggle */
	showViewToggle?: boolean;
	/** Show stats on cards */
	showStats?: boolean;
	/** Loading state */
	loading?: boolean;
	/** Click handler for campaign card */
	onCampaignClick?: (campaign: Campaign) => void;
	/** Action handlers for campaign cards */
	onEdit?: (campaign: Campaign) => void;
	onDuplicate?: (campaign: Campaign) => void;
	onDelete?: (campaign: Campaign) => void;
	/** Create campaign handler */
	onCreateCampaign?: () => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * CampaignList displays a filterable list or grid of campaigns
 */
export const CampaignList = memo<CampaignListProps>(function CampaignList({
	campaigns,
	view: initialView = "grid",
	showFilters = true,
	showViewToggle = true,
	showStats = true,
	loading = false,
	onCampaignClick,
	onEdit,
	onDuplicate,
	onDelete,
	onCreateCampaign,
	className: customClassName,
	...props
}) {
	const [view, setView] = useState<"list" | "grid">(initialView);
	const [statusFilter, setStatusFilter] = useState<Campaign["status"] | "all">(
		"all",
	);
	const [searchQuery, setSearchQuery] = useState("");

	// Filter campaigns
	const filteredCampaigns = useMemo(() => {
		let filtered = campaigns;

		// Filter by status
		if (statusFilter !== "all") {
			filtered = filtered.filter((c) => c.status === statusFilter);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(c) =>
					c.name.toLowerCase().includes(query) ||
					c.description?.toLowerCase().includes(query),
			);
		}

		return filtered;
	}, [campaigns, statusFilter, searchQuery]);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Empty state
	if (!loading && campaigns.length === 0) {
		return (
			<div className={styles.emptyState}>
				<div className={styles.emptyStateIcon}>
					<i className="ri-megaphone-line" aria-hidden="true" />
				</div>
				<h3 className={styles.emptyStateTitle}>No campaigns yet</h3>
				<p className={styles.emptyStateDescription}>
					Create your first campaign to start building your waitlist
				</p>
				{onCreateCampaign && (
					<Button
						onClick={onCreateCampaign}
						variant="primary"
						leftIcon="ri-add-line"
					>
						Create Campaign
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className={classNames} {...props}>
			{/* Header with filters and view toggle */}
			{(showFilters || showViewToggle) && (
				<div className={styles.header}>
					{/* Left side - Filters */}
					{showFilters && (
						<div className={styles.filters}>
							{/* Search */}
							<div className={styles.searchBox}>
								<TextInput
									label=""
									placeholder="Search campaigns..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									leftIcon="ri-search-line"
									showLeftIcon={true}
									aria-label="Search campaigns"
								/>
							</div>

							{/* Status filter */}
							<ButtonGroup
								items={[
									{
										text: "All",
										icon: "",
										iconPosition: "left",
										iconOnly: false,
										onClick: () => setStatusFilter("all"),
										selected: statusFilter === "all",
										ariaLabel: "All campaigns",
									},
									{
										text: "Active",
										icon: "",
										iconPosition: "left",
										iconOnly: false,
										onClick: () => setStatusFilter("active"),
										selected: statusFilter === "active",
										ariaLabel: "Active campaigns",
									},
									{
										text: "Draft",
										icon: "",
										iconPosition: "left",
										iconOnly: false,
										onClick: () => setStatusFilter("draft"),
										selected: statusFilter === "draft",
										ariaLabel: "Draft campaigns",
									},
									{
										text: "Paused",
										icon: "",
										iconPosition: "left",
										iconOnly: false,
										onClick: () => setStatusFilter("paused"),
										selected: statusFilter === "paused",
										ariaLabel: "Paused campaigns",
									},
									{
										text: "Completed",
										icon: "",
										iconPosition: "left",
										iconOnly: false,
										onClick: () => setStatusFilter("completed"),
										selected: statusFilter === "completed",
										ariaLabel: "Completed campaigns",
									},
								]}
								size="small"
								ariaLabel="Filter by status"
							/>
						</div>
					)}

					{/* Right side - View toggle */}
					{showViewToggle && (
						<ButtonGroup
							items={[
								{
									text: "Grid view",
									icon: "ri-grid-line",
									iconPosition: "left",
									iconOnly: true,
									onClick: () => setView("grid"),
									selected: view === "grid",
									ariaLabel: "Grid view",
								},
								{
									text: "List view",
									icon: "ri-list-check",
									iconPosition: "left",
									iconOnly: true,
									onClick: () => setView("list"),
									selected: view === "list",
									ariaLabel: "List view",
								},
							]}
							size="small"
							ariaLabel="View options"
						/>
					)}
				</div>
			)}

			{/* Results count */}
			<div className={styles.resultsInfo}>
				{filteredCampaigns.length} campaign
				{filteredCampaigns.length !== 1 ? "s" : ""}
				{searchQuery && ` matching "${searchQuery}"`}
			</div>

			{/* Campaign grid/list */}
			{loading ? (
				<div
					className={`${styles.campaignGrid} ${view === "list" ? styles.campaignList : ""}`}
				>
					{[...Array(6)].map((_, i) => (
						<div key={i} className={styles.skeletonCard} />
					))}
				</div>
			) : filteredCampaigns.length === 0 ? (
				<div className={styles.noResults}>
					<i className="ri-search-line" aria-hidden="true" />
					<p>No campaigns found</p>
					{searchQuery && (
						<Button
							onClick={() => {
								setSearchQuery("");
								setStatusFilter("all");
							}}
							variant="secondary"
						>
							Clear filters
						</Button>
					)}
				</div>
			) : (
				<div
					className={`${styles.campaignGrid} ${view === "list" ? styles.campaignList : ""}`}
				>
					{filteredCampaigns.map((campaign) => (
						<CampaignCard
							key={campaign.id}
							campaign={campaign}
							showStats={showStats}
							onClick={() => onCampaignClick?.(campaign)}
							actions={{
								onEdit: onEdit ? () => onEdit(campaign) : undefined,
								onDuplicate: onDuplicate
									? () => onDuplicate(campaign)
									: undefined,
								onDelete: onDelete ? () => onDelete(campaign) : undefined,
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
});

CampaignList.displayName = "CampaignList";
