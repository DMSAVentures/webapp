import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useDeleteCampaign } from "@/hooks/useDeleteCampaign";
import { CampaignList } from "@/features/campaigns/components/CampaignList/component";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import { ErrorState } from "@/components/error/error";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { Button } from "@/proto-design-system/Button/button";
import type { Campaign } from "@/types/common.types";
import styles from "./page.module.scss";

export const Route = createFileRoute("/campaigns")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { data, loading, error, refetch } = useGetCampaigns();
	const { deleteCampaign } = useDeleteCampaign();

	const handleCreateCampaign = () => {
		navigate({ to: "/campaigns/new" });
	};

	const handleCampaignClick = (campaign: Campaign) => {
		navigate({ to: `/campaigns/${campaign.id}` });
	};

	const handleEdit = (campaign: Campaign) => {
		navigate({ to: `/campaigns/${campaign.id}/edit` });
	};

	const handleDelete = async (campaign: Campaign) => {
		if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
			const success = await deleteCampaign(campaign.id);
			if (success) {
				refetch();
			}
		}
	};

	if (loading) {
		return <LoadingSpinner size="large" mode="centered" message="Loading campaigns..." />;
	}

	if (error) {
		return <ErrorState message={`Failed to load campaigns: ${error.error}`} />;
	}

	if (!data || !data.campaigns) {
		return <EmptyState title="No campaigns found" icon="megaphone-line" />;
	}

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div>
					<h1 className={styles.pageTitle}>Campaigns</h1>
					<p className={styles.pageDescription}>
						Manage your marketing campaigns and promotional activities
					</p>
				</div>
				<Button
					variant="primary"
					leftIcon="ri-add-line"
					onClick={handleCreateCampaign}
				>
					Create Campaign
				</Button>
			</div>

			<div className={styles.pageContent}>
				<CampaignList
					campaigns={data.campaigns}
					showStats={true}
					onCampaignClick={handleCampaignClick}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onCreateCampaign={handleCreateCampaign}
				/>
			</div>
		</motion.div>
	);
}
