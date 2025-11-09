import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ErrorState } from "@/components/error/error";
import { UserList } from "@/features/users/components/UserList/component";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { WaitlistUser } from "@/types/common.types";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/users")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { data: campaign, loading, error } = useGetCampaign(campaignId);

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

	// Mock users for now - in production, you'd fetch from API
	const mockUsers: WaitlistUser[] = [];

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
				<UserList
					campaignId={campaignId}
					users={mockUsers}
					loading={false}
					showFilters={true}
					onUserClick={(user) => {
						console.log("User clicked:", user);
					}}
					onExport={async (userIds) => {
						console.log("Export users:", userIds);
					}}
					onBulkAction={async (action, userIds) => {
						console.log("Bulk action:", action, userIds);
					}}
				/>
			</div>
		</motion.div>
	);
}
