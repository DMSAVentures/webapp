/**
 * LeadsPage Component
 * Container component for campaign leads/users page
 */

import { memo, useCallback, useMemo, useState } from "react";
import { ErrorState } from "@/components/error/error";
import { useExportCampaignUsers } from "@/hooks/useExportCampaignUsers";
import { useGetCampaignUsers } from "@/hooks/useGetCampaignUsers";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Campaign, FormField } from "@/types/campaign";
import type {
	SortDirection,
	UserFilters as UserFiltersType,
	UserSortField,
} from "@/types/users.types";
import { exportUsersToCSV } from "@/utils/csvExport";
import { filtersToChips, removeFilterById } from "@/utils/filterHelpers";
import { FilterChips } from "../FilterChips";
import { UserFilters } from "../UserFilters";
import { UserList } from "../UserList/component";
import styles from "./component.module.scss";

export interface LeadsPageProps {
	/** Campaign ID */
	campaignId: string;
	/** Campaign data */
	campaign: Campaign;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_PAGE_SIZE = 25;

// ============================================================================
// Pure Functions
// ============================================================================

/** Build custom field labels map from form fields */
function buildCustomFieldLabels(
	formFields: FormField[] | undefined,
): Record<string, string> {
	const labels: Record<string, string> = {};
	formFields?.forEach((field) => {
		labels[field.id] = field.label;
	});
	return labels;
}

/** Transform filters to API params */
function buildApiParams(
	page: number,
	filters: UserFiltersType,
	sortField: UserSortField,
	sortDirection: SortDirection,
) {
	return {
		page,
		limit: DEFAULT_PAGE_SIZE,
		status: filters.status,
		source: filters.source,
		hasReferrals: filters.hasReferrals,
		minPosition: filters.minPosition,
		maxPosition: filters.maxPosition,
		dateFrom: filters.dateRange?.start?.toISOString(),
		dateTo: filters.dateRange?.end?.toISOString(),
		customFields: filters.customFields
			? Object.fromEntries(
					Object.entries(filters.customFields).map(([k, v]) => [
						k,
						Array.isArray(v) ? v[0] : v,
					]),
				)
			: undefined,
		sort: sortField,
		order: sortDirection,
	};
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing leads page state (filters, pagination, sorting) */
function useLeadsState() {
	const [page, setPage] = useState(1);
	const [filters, setFilters] = useState<UserFiltersType>({});
	const [sortField, setSortField] = useState<UserSortField>("position");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	const handleFilterChange = useCallback((newFilters: UserFiltersType) => {
		setFilters(newFilters);
		setPage(1); // Reset to first page when filters change
	}, []);

	const handleFilterReset = useCallback(() => {
		setFilters({});
		setPage(1);
	}, []);

	const handleSortChange = useCallback(
		(field: UserSortField, direction: SortDirection) => {
			setSortField(field);
			setSortDirection(direction);
			setPage(1);
		},
		[],
	);

	return {
		page,
		filters,
		sortField,
		sortDirection,
		handlePageChange,
		handleFilterChange,
		handleFilterReset,
		handleSortChange,
	};
}

/** Hook for managing filter removal */
function useFilterRemoval(
	filters: UserFiltersType,
	onFilterChange: (filters: UserFiltersType) => void,
) {
	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			const newFilters = removeFilterById(filters, filterId);
			onFilterChange(newFilters);
		},
		[filters, onFilterChange],
	);

	return { handleRemoveFilter };
}

/** Hook for managing export functionality */
function useLeadsExport(
	campaignId: string,
	campaignName: string,
	currentUsers: ReturnType<typeof useGetCampaignUsers>["data"],
) {
	const { fetchAllUsers } = useExportCampaignUsers(campaignId);

	const handleExport = useCallback(
		async (selectedUserIds: string[]) => {
			if (selectedUserIds.length === 0) {
				// No selection - fetch and export all users
				const allUsers = await fetchAllUsers();
				exportUsersToCSV(allUsers, campaignName);
			} else {
				// Export selected users from current page
				const users = currentUsers?.users || [];
				const selectedUsers = users.filter((u) =>
					selectedUserIds.includes(u.id),
				);
				exportUsersToCSV(selectedUsers, campaignName);
			}
		},
		[fetchAllUsers, campaignName, currentUsers],
	);

	return { handleExport };
}

// ============================================================================
// Component
// ============================================================================

/**
 * LeadsPage displays and manages campaign leads/users
 */
export const LeadsPage = memo(function LeadsPage({
	campaignId,
	campaign,
}: LeadsPageProps) {
	// Hooks
	const {
		page,
		filters,
		sortField,
		sortDirection,
		handlePageChange,
		handleFilterChange,
		handleFilterReset,
		handleSortChange,
	} = useLeadsState();

	// Derived state
	const apiParams = useMemo(
		() => buildApiParams(page, filters, sortField, sortDirection),
		[page, filters, sortField, sortDirection],
	);

	const customFieldLabels = useMemo(
		() => buildCustomFieldLabels(campaign.formFields),
		[campaign.formFields],
	);

	const activeFilters = useMemo(
		() => filtersToChips(filters, customFieldLabels),
		[filters, customFieldLabels],
	);

	// Data fetching
	const {
		data: usersData,
		loading: usersLoading,
		error: usersError,
	} = useGetCampaignUsers(campaignId, apiParams);

	// More hooks that depend on data
	const { handleRemoveFilter } = useFilterRemoval(filters, (newFilters) => {
		handleFilterChange(newFilters);
	});

	const { handleExport } = useLeadsExport(campaignId, campaign.name, usersData);

	// Handlers
	const handleUserClick = useCallback((user: { id: string; email: string }) => {
		console.log("User clicked:", user);
	}, []);

	// Render
	const users = usersData?.users || [];

	return (
		<Stack gap="lg" className={styles.leads} animate>
			<Stack gap="xs">
				<Text as="h2" size="xl" weight="semibold">Leads</Text>
				<Text color="secondary">
					Manage and view all users who have signed up for this campaign
				</Text>
			</Stack>

			<Stack gap="md" className={styles.content}>
				{/* Filters */}
				<UserFilters
					filters={filters}
					onChange={handleFilterChange}
					onReset={handleFilterReset}
					formFields={campaign.formFields}
				/>

				{/* Active filter chips */}
				<FilterChips
					activeFilters={activeFilters}
					onRemoveFilter={handleRemoveFilter}
					onClearAll={handleFilterReset}
				/>

				{usersError && (
					<ErrorState message={`Failed to load leads: ${usersError.error}`} />
				)}
				{!usersError && (
					<UserList
						campaignId={campaignId}
						users={users}
						loading={usersLoading}
						currentPage={usersData?.page ?? 1}
						totalPages={usersData?.totalPages ?? 1}
						pageSize={usersData?.pageSize ?? DEFAULT_PAGE_SIZE}
						totalUsers={usersData?.totalCount ?? 0}
						onPageChange={handlePageChange}
						onUserClick={handleUserClick}
						onExport={handleExport}
						referralEnabled={campaign.referralSettings?.enabled ?? false}
						emailVerificationEnabled={
							campaign.emailSettings?.verificationRequired ?? false
						}
						formFields={campaign.formFields}
						sortField={sortField}
						sortDirection={sortDirection}
						onSortChange={handleSortChange}
					/>
				)}
			</Stack>
		</Stack>
	);
});

LeadsPage.displayName = "LeadsPage";
