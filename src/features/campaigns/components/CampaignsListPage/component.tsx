/**
 * CampaignsListPage Component
 * Container component for the campaigns list page
 */

import { useNavigate } from "@tanstack/react-router";
import { Megaphone, Plus } from "lucide-react";
import { motion } from "motion/react";
import { memo, useCallback } from "react";
import { ErrorState } from "@/components/error/error";
import { LimitUpgradeModal, useLimitGate } from "@/components/gating";
import { useDeleteCampaign } from "@/hooks/useDeleteCampaign";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { Button, EmptyState, Spinner, Stack, Text } from "@/proto-design-system";
import type { Campaign } from "@/types/campaign";
import { CampaignList } from "../CampaignList/component";
import styles from "./component.module.scss";

// ============================================================================
// Custom Hooks
// ============================================================================

interface CampaignListActionsOptions {
	refetch: () => void;
	checkAndBlock: () => boolean;
}

/** Hook for campaign list actions (navigation and delete) */
function useCampaignListActions({
	refetch,
	checkAndBlock,
}: CampaignListActionsOptions) {
	const navigate = useNavigate();
	const { deleteCampaign } = useDeleteCampaign();

	const handleCreateCampaign = useCallback(() => {
		if (checkAndBlock()) return;
		navigate({ to: "/campaigns/new" });
	}, [navigate, checkAndBlock]);

	const handleCampaignClick = useCallback(
		(campaign: Campaign) => {
			navigate({ to: `/campaigns/${campaign.id}` });
		},
		[navigate],
	);

	const handleEdit = useCallback(
		(campaign: Campaign) => {
			navigate({ to: `/campaigns/${campaign.id}/edit` });
		},
		[navigate],
	);

	const handleDelete = useCallback(
		async (campaign: Campaign) => {
			if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
				const success = await deleteCampaign(campaign.id);
				if (success) {
					refetch();
				}
			}
		},
		[deleteCampaign, refetch],
	);

	return {
		handleCreateCampaign,
		handleCampaignClick,
		handleEdit,
		handleDelete,
	};
}

// ============================================================================
// Component
// ============================================================================

/**
 * CampaignsListPage displays the list of all campaigns
 */
export const CampaignsListPage = memo(function CampaignsListPage() {
	// Data fetching
	const { data, loading, error, refetch } = useGetCampaigns();

	// Limit gating
	const { showModal, closeModal, checkAndBlock } = useLimitGate({
		limitKey: "campaigns",
		currentCount: data?.campaigns?.length ?? 0,
	});

	// Actions
	const {
		handleCreateCampaign,
		handleCampaignClick,
		handleEdit,
		handleDelete,
	} = useCampaignListActions({
		refetch,
		checkAndBlock,
	});

	// Loading state
	if (loading) {
		return (
			<Spinner
				size="lg"
				label="Loading campaigns..."
			/>
		);
	}

	// Error state
	if (error) {
		return <ErrorState message={`Failed to load campaigns: ${error.error}`} />;
	}

	// Empty/no data state
	if (!data || !data.campaigns) {
		return <EmptyState title="No campaigns found" icon={<Megaphone size={48} />} />;
	}

	const campaigns = data.campaigns;

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<Stack direction="row" justify="between" align="start" wrap className={styles.pageHeader}>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">Campaigns</Text>
					<Text color="secondary">
						Manage your marketing campaigns and promotional activities
					</Text>
				</Stack>
				{campaigns.length > 0 && (
					<Button
						variant="primary"
						leftIcon={<Plus size={16} />}
						onClick={handleCreateCampaign}
					>
						Create Campaign
					</Button>
				)}
			</Stack>

			<div className={styles.pageContent}>
				<CampaignList
					campaigns={campaigns}
					showStats={true}
					onCampaignClick={handleCampaignClick}
					onEdit={handleEdit}
					onDelete={handleDelete}
					onCreateCampaign={handleCreateCampaign}
				/>
			</div>

			{/* Upgrade Modal for Campaign Limit */}
			<LimitUpgradeModal
				isOpen={showModal}
				onClose={closeModal}
				limitKey="campaigns"
				resourceName="campaign"
			/>
		</motion.div>
	);
});

CampaignsListPage.displayName = "CampaignsListPage";
