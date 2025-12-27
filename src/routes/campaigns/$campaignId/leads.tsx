import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { ErrorState } from "@/components/error/error";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { FilterChips } from "@/features/users/components/FilterChips";
import { UserFilters } from "@/features/users/components/UserFilters";
import { UserList } from "@/features/users/components/UserList/component";
import { useExportCampaignUsers } from "@/hooks/useExportCampaignUsers";
import { useGetCampaignUsers } from "@/hooks/useGetCampaignUsers";
import type {
	SortDirection,
	UserFilters as UserFiltersType,
	UserSortField,
} from "@/types/users.types";
import { exportUsersToCSV } from "@/utils/csvExport";
import { filtersToChips, removeFilterById } from "@/utils/filterHelpers";
import styles from "./leads.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/leads")({
	component: RouteComponent,
});

const DEFAULT_PAGE_SIZE = 25;

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();

	// Pagination state
	const [page, setPage] = useState(1);

	// Filter state
	const [filters, setFilters] = useState<UserFiltersType>({});

	// Sort state
	const [sortField, setSortField] = useState<UserSortField>("position");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	// Build API params from filters
	const apiParams = useMemo(() => {
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
	}, [page, filters, sortField, sortDirection]);

	const {
		data: usersData,
		loading: usersLoading,
		error: usersError,
	} = useGetCampaignUsers(campaignId, apiParams);

	// Export hook
	const { fetchAllUsers } = useExportCampaignUsers(campaignId);

	// Convert active filters to chips
	const customFieldLabels = useMemo(() => {
		const labels: Record<string, string> = {};
		campaign?.formFields?.forEach((field) => {
			labels[field.id] = field.label;
		});
		return labels;
	}, [campaign?.formFields]);

	const activeFilters = useMemo(
		() => filtersToChips(filters, customFieldLabels),
		[filters, customFieldLabels],
	);

	// Handle page change
	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

	// Handle filter change
	const handleFilterChange = useCallback((newFilters: UserFiltersType) => {
		setFilters(newFilters);
		setPage(1); // Reset to first page when filters change
	}, []);

	// Handle filter reset
	const handleFilterReset = useCallback(() => {
		setFilters({});
		setPage(1);
	}, []);

	// Handle filter chip removal
	const handleRemoveFilter = useCallback(
		(filterId: string) => {
			const newFilters = removeFilterById(filters, filterId);
			setFilters(newFilters);
			setPage(1);
		},
		[filters],
	);

	// Handle sort change
	const handleSortChange = useCallback(
		(field: UserSortField, direction: SortDirection) => {
			setSortField(field);
			setSortDirection(direction);
			setPage(1);
		},
		[],
	);

	if (!campaign) {
		return null;
	}

	const users = usersData?.users || [];

	return (
		<div className={styles.leads}>
			<div className={styles.header}>
				<h2 className={styles.title}>Leads</h2>
				<p className={styles.description}>
					Manage and view all users who have signed up for this campaign
				</p>
			</div>

			<div className={styles.content}>
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
						onUserClick={(user) => {
							console.log("User clicked:", user);
						}}
						onExport={async (selectedUserIds) => {
							if (selectedUserIds.length === 0) {
								// No selection - fetch and export all users
								const allUsers = await fetchAllUsers();
								exportUsersToCSV(allUsers, campaign.name);
							} else {
								// Export selected users from current page
								const selectedUsers = users.filter((u) =>
									selectedUserIds.includes(u.id),
								);
								exportUsersToCSV(selectedUsers, campaign.name);
							}
						}}
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
			</div>
		</div>
	);
}
