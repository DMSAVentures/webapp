import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import { ErrorState } from "@/components/error/error";
import { useGlobalBanner } from "@/contexts/globalBanner";
import {
	CampaignForm,
	type CampaignFormData,
} from "@/features/campaigns/components/CampaignForm/component";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { useUpdateCampaign } from "@/hooks/useUpdateCampaign";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Breadcrumb } from "@/proto-design-system/components/navigation/Breadcrumb";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import styles from "./campaignEdit.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const navigate = useNavigate();
	const { showBanner } = useGlobalBanner();
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

	useEffect(() => {
		if (updateError) {
			showBanner({
				type: "error",
				title: "Failed to update campaign",
				description: updateError.error,
			});
		}
	}, [updateError, showBanner]);

	const handleSubmit = async (data: CampaignFormData) => {
		const updated = await updateCampaign(campaignId, {
			name: data.name,
			description: data.description,
			referral_settings: data.settings.enableReferrals
				? {
						enabled: true,
						points_per_referral: data.referralConfig?.pointsPerReferral || 1,
						verified_only: data.referralConfig?.verifiedOnly ?? true,
						positions_to_jump: data.referralConfig?.positionsToJump || 0,
						referrer_positions_to_jump:
							data.referralConfig?.referrerPositionsToJump || 1,
						sharing_channels: (data.referralConfig?.sharingChannels ||
							[]) as Array<
							"email" | "twitter" | "facebook" | "linkedin" | "whatsapp"
						>,
					}
				: {
						enabled: false,
					},
			email_settings: {
				verification_required: data.settings.emailVerificationRequired,
				send_welcome_email: data.settings.sendWelcomeEmail,
			},
			tracking_integrations: data.trackingConfig?.integrations?.map((i) => ({
				integration_type: i.type,
				enabled: i.enabled,
				tracking_id: i.id,
				tracking_label: i.label,
			})),
		});

		if (updated) {
			navigate({ to: `/campaigns/$campaignId`, params: { campaignId } });
		}
	};

	const handleCancel = () => {
		navigate({ to: `/campaigns/$campaignId`, params: { campaignId } });
	};

	if (loadingCampaign) {
		return <Spinner size="lg" label="Loading campaign..." />;
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
				campaign.emailSettings?.verificationRequired ?? true,
			sendWelcomeEmail: campaign.emailSettings?.sendWelcomeEmail ?? false,
			duplicateHandling: "block",
			enableReferrals: campaign.referralSettings?.enabled ?? false,
			enableRewards: false,
		},
		referralConfig: {
			pointsPerReferral: campaign.referralSettings?.pointsPerReferral ?? 1,
			verifiedOnly: campaign.referralSettings?.verifiedOnly ?? true,
			positionsToJump: campaign.referralSettings?.positionsToJump ?? 0,
			referrerPositionsToJump:
				campaign.referralSettings?.referrerPositionsToJump ?? 1,
			sharingChannels: campaign.referralSettings?.sharingChannels ?? [
				"email",
				"twitter",
				"facebook",
				"linkedin",
			],
		},
		trackingConfig: {
			integrations:
				campaign.trackingIntegrations?.map((i) => ({
					type: i.integrationType,
					enabled: i.enabled,
					id: i.trackingId,
					label: i.trackingLabel,
				})) ?? [],
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
							{ label: "Campaigns", href: "/campaigns" },
							{ label: campaign.name, href: `/campaigns/${campaignId}` },
							{ label: "Edit" },
						]}
					/>
				</div>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Edit Campaign</h1>
					<p className={styles.pageDescription}>
						Update your campaign details and settings
					</p>
				</div>
			</div>

			<div className={styles.pageContent}>
				<CampaignForm
					campaignId={campaignId}
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
