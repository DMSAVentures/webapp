import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ErrorState } from "@/components/error/error";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { UserList } from "@/features/users/components/UserList/component";
import { useExportCampaignUsers } from "@/hooks/useExportCampaignUsers";
import { useGetCampaignUsers } from "@/hooks/useGetCampaignUsers";
import { exportUsersToCSV } from "@/utils/csvExport";
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

	const {
		data: usersData,
		loading: usersLoading,
		error: usersError,
	} = useGetCampaignUsers(campaignId, {
		page,
		limit: DEFAULT_PAGE_SIZE,
		sort: "position",
		order: "asc",
	});

	// Export hook
	const { fetchAllUsers } = useExportCampaignUsers(campaignId);

	// Handle page change
	const handlePageChange = useCallback((newPage: number) => {
		setPage(newPage);
	}, []);

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
						onExport={async () => {
							const allUsers = await fetchAllUsers();
							exportUsersToCSV(allUsers, campaign.name);
						}}
						onBulkAction={async (action, userIds) => {
							console.log("Bulk action:", action, userIds);
						}}
						referralEnabled={campaign.referralSettings?.enabled ?? false}
						emailVerificationEnabled={
							campaign.emailSettings?.verificationRequired ?? false
						}
					/>
				)}
			</div>
		</div>
	);
}
