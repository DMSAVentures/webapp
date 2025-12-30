/**
 * CampaignList Component
 * Displays a list or grid of campaign cards with filtering
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useState,
} from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { Button, ButtonGroup, Input } from "@/proto-design-system";
import type { Campaign } from "@/types/campaign";
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

type StatusFilter = Campaign["status"] | "all";
type ViewMode = "list" | "grid";

// ============================================================================
// Pure Functions
// ============================================================================

/** Filter campaigns by status and search query */
function filterCampaigns(
	campaigns: Campaign[],
	statusFilter: StatusFilter,
	searchQuery: string,
): Campaign[] {
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
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "active", label: "Active" },
	{ value: "draft", label: "Draft" },
	{ value: "paused", label: "Paused" },
	{ value: "completed", label: "Completed" },
];

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing campaign list filters and view */
function useCampaignFilters(initialView: ViewMode) {
	const [view, setView] = useState<ViewMode>(initialView);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearchChange = useCallback((value: string) => {
		setSearchQuery(value);
	}, []);

	const clearFilters = useCallback(() => {
		setSearchQuery("");
		setStatusFilter("all");
	}, []);

	return {
		view,
		setView,
		statusFilter,
		setStatusFilter,
		searchQuery,
		handleSearchChange,
		clearFilters,
	};
}

// ============================================================================
// Component
// ============================================================================

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
	// Hooks
	const {
		view,
		setView,
		statusFilter,
		setStatusFilter,
		searchQuery,
		handleSearchChange,
		clearFilters,
	} = useCampaignFilters(initialView);

	// Derived state
	const filteredCampaigns = filterCampaigns(campaigns, statusFilter, searchQuery);

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
								<Input
									placeholder="Search campaigns..."
									value={searchQuery}
									onChange={(e) => handleSearchChange(e.target.value)}
									leftElement={<Search size={16} />}
									aria-label="Search campaigns"
								/>
							</div>

							{/* Status filter */}
							<ButtonGroup>
								{STATUS_OPTIONS.map((option) => (
									<Button
										key={option.value}
										variant={statusFilter === option.value ? "primary" : "secondary"}
										size="sm"
										onClick={() => setStatusFilter(option.value)}
										aria-label={`${option.label} campaigns`}
									>
										{option.label}
									</Button>
								))}
							</ButtonGroup>
						</div>
					)}

					{/* Right side - View toggle */}
					{showViewToggle && (
						<ButtonGroup>
							<Button
								variant={view === "grid" ? "primary" : "secondary"}
								size="sm"
								leftIcon={<LayoutGrid size={16} />}
								onClick={() => setView("grid")}
								aria-label="Grid view"
							/>
							<Button
								variant={view === "list" ? "primary" : "secondary"}
								size="sm"
								leftIcon={<List size={16} />}
								onClick={() => setView("list")}
								aria-label="List view"
							/>
						</ButtonGroup>
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
						<Button onClick={clearFilters} variant="secondary">
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
