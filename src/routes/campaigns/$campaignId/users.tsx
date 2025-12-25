import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { ErrorState } from "@/components/error/error";
import { UserList } from "@/features/users/components/UserList/component";
import { useExportCampaignUsers } from "@/hooks/useExportCampaignUsers";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { useGetCampaignUsers } from "@/hooks/useGetCampaignUsers";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import { exportUsersToCSV } from "@/utils/csvExport";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/users")({
	component: RouteComponent,
});

const DEFAULT_PAGE_SIZE = 25;

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { data: campaign, loading, error } = useGetCampaign(campaignId);

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

	if (loading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading campaign..."
			/>
		);
	}

	if (error) {
		return <ErrorState message={`Failed to load campaign: ${error.error}`} />;
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
	}

	const users = usersData?.users || [];

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerActions}>
					<Breadcrumb
						items={[
							<BreadcrumbItem key="campaigns" state="default" path="/campaigns">
								Campaigns
							</BreadcrumbItem>,
							<BreadcrumbItem
								key="campaign"
								state="default"
								path={`/campaigns/${campaignId}`}
							>
								{campaign.name}
							</BreadcrumbItem>,
							<BreadcrumbItem key="users" state="active">
								Users
							</BreadcrumbItem>,
						]}
						divider="arrow"
					/>
				</div>

				<div className={styles.headerTop}>
					<div className={styles.headerContent}>
						<h1 className={styles.pageTitle}>Campaign Users</h1>
						<p className={styles.pageDescription}>
							Manage and view all users who have signed up for this campaign
						</p>
					</div>
				</div>
			</div>

			<div className={styles.pageContent}>
				{usersError && (
					<ErrorState message={`Failed to load users: ${usersError.error}`} />
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
		</motion.div>
	);
}
