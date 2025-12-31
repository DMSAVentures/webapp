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
import { Plus, Search, Megaphone } from "lucide-react";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { ButtonGroup } from "@/proto-design-system/components/primitives/Button/ButtonGroup";
import { Grid } from "@/proto-design-system/components/layout/Grid";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
			<Stack gap="md" align="center" className={styles.emptyState}>
				<Icon icon={Megaphone} size="2xl" color="muted" />
				<Text as="h3" size="lg" weight="semibold">No campaigns yet</Text>
				<Text color="muted" align="center">
					Create your first campaign to start building your waitlist
				</Text>
				{onCreateCampaign && (
					<Button onClick={onCreateCampaign} variant={'primary'}>
						<Plus size={16} />
						Create Campaign
					</Button>
				)}
			</Stack>
		);
	}

	return (
		<div className={classNames} {...props}>
			{/* Header with filters and view toggle */}
			{(showFilters || showViewToggle) && (
				<div className={styles.header}>
					{/* Left side - Filters */}
					{showFilters && (
						<Stack direction="row" gap="sm" align="center" className={styles.filters}>
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

							{/* Status filter pills */}
							<ButtonGroup isAttached size="sm">
								{STATUS_OPTIONS.map((option) => (
									<Button
										key={option.value}
										variant={statusFilter === option.value ? "primary" : "outline"}
										onClick={() => setStatusFilter(option.value)}
										aria-label={`${option.label} campaigns`}
									>
										{option.label}
									</Button>
								))}
							</ButtonGroup>
						</Stack>
					)}
				</div>
			)}

			{/* Results count */}
			<Text size="sm" color="muted" className={styles.resultsInfo}>
				{filteredCampaigns.length} campaign
				{filteredCampaigns.length !== 1 ? "s" : ""}
				{searchQuery && ` matching "${searchQuery}"`}
			</Text>

			{/* Campaign grid/list */}
			{loading ? (
				<Grid columns={view === "list" ? "1" : "3"} gap="md" className={styles.campaignGrid}>
					{[...Array(6)].map((_, i) => (
						<div key={i} className={styles.skeletonCard} />
					))}
				</Grid>
			) : filteredCampaigns.length === 0 ? (
				<Stack gap="md" align="center" className={styles.noResults}>
					<Icon icon={Search} size="xl" color="muted" />
					<Text color="muted">No campaigns found</Text>
					{searchQuery && (
						<Button onClick={clearFilters} variant="secondary">
							Clear filters
						</Button>
					)}
				</Stack>
			) : (
				<Grid columns={view === "list" ? "1" : "3"} gap="md" className={styles.campaignGrid}>
					{filteredCampaigns.map((campaign) => (
						<CampaignCard
							key={campaign.id}
							campaign={campaign}
							showStats={showStats}
							onClick={() => onCampaignClick?.(campaign)}
						/>
					))}
				</Grid>
			)}
		</div>
	);
});

CampaignList.displayName = "CampaignList";
