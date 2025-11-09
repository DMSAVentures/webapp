import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ErrorState } from "@/components/error/error";
import {
	CampaignForm,
	type CampaignFormData,
} from "@/features/campaigns/components/CampaignForm/component";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { useUpdateCampaign } from "@/hooks/useUpdateCampaign";
import Banner from "@/proto-design-system/banner/banner";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import styles from "./campaignEdit.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const navigate = useNavigate();
	const {
		data: campaign,
		loading: loadingCampaign,
		error: errorCampaign,
	} = useGetCampaign(campaignId);
	const {
		updateCampaign,
		loading: updating,
		error: updateError,
	} = useUpdateCampaign();

	const handleSubmit = async (data: CampaignFormData) => {
		const updated = await updateCampaign(campaignId, {
			name: data.name,
			description: data.description,
			referral_config: {
				enabled: data.settings.enableReferrals,
				points_per_referral: 1,
				verified_only: true,
			},
			email_config: {
				verification_required: data.settings.emailVerificationRequired,
			},
		});

		if (updated) {
			navigate({ to: `/campaigns/$campaignId`, params: { campaignId } });
		}
	};

	const handleCancel = () => {
		navigate({ to: `/campaigns/$campaignId`, params: { campaignId } });
	};

	if (loadingCampaign) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading campaign..."
			/>
		);
	}

	if (errorCampaign) {
		return (
			<ErrorState message={`Failed to load campaign: ${errorCampaign.error}`} />
		);
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
	}

	// Prepare initial form data from campaign
	const initialData: Partial<CampaignFormData> = {
		name: campaign.name,
		description: campaign.description,
		settings: {
			emailVerificationRequired:
				campaign.email_config?.verification_required ?? true,
			duplicateHandling: "block",
			enableReferrals: campaign.referral_config?.enabled ?? true,
			enableRewards: true,
		},
	};

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
							<BreadcrumbItem key="edit" state="active">
								Edit
							</BreadcrumbItem>,
						]}
						divider="arrow"
					/>
				</div>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Edit Campaign</h1>
					<p className={styles.pageDescription}>
						Update your campaign details and settings
					</p>
				</div>
			</div>

			{updateError && (
				<Banner
					bannerType="error"
					variant="filled"
					alertTitle="Failed to update campaign"
					alertDescription={updateError.error}
				/>
			)}

			<div className={styles.pageContent}>
				<CampaignForm
					initialData={initialData}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					loading={updating}
					submitText="Save Changes"
				/>
			</div>
		</motion.div>
	);
}
