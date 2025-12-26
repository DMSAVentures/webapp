import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import {
	CampaignForm,
	type CampaignFormData,
} from "@/features/campaigns/components/CampaignForm/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { useUpdateCampaign } from "@/hooks/useUpdateCampaign";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Button } from "@/proto-design-system/Button/button";
import styles from "./settings.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const navigate = useNavigate();
	const { campaign, refetch } = useCampaignContext();
	const {
		updateStatus,
		loading: updatingStatus,
		error: statusError,
	} = useUpdateCampaignStatus();
	const {
		updateCampaign,
		loading: updatingCampaign,
		error: updateError,
	} = useUpdateCampaign();
	const { showBanner } = useGlobalBanner();

	// Show error banners when errors occur
	useEffect(() => {
		if (statusError) {
			showBanner({
				type: "error",
				title: "Failed to update campaign status",
				description: statusError.error,
			});
		}
	}, [statusError, showBanner]);

	useEffect(() => {
		if (updateError) {
			showBanner({
				type: "error",
				title: "Failed to update campaign",
				description: updateError.error,
			});
		}
	}, [updateError, showBanner]);

	if (!campaign) {
		return null;
	}

	const handleEnd = async () => {
		const updated = await updateStatus(campaignId, { status: "completed" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign has been ended" });
			refetch();
		}
	};

	const handleFormSubmit = async (data: CampaignFormData) => {
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
			showBanner({ type: "success", title: "Campaign settings saved!" });
			refetch();
		}
	};

	const handleFormCancel = () => {
		navigate({ to: `/campaigns/$campaignId`, params: { campaignId } });
	};

	// Prepare initial form data from campaign
	const initialFormData: Partial<CampaignFormData> = {
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
		<div className={styles.settings}>
			{/* Campaign Settings Form */}
			{campaign.status !== "completed" && (
				<CampaignForm
					campaignId={campaignId}
					initialData={initialFormData}
					onSubmit={handleFormSubmit}
					onCancel={handleFormCancel}
					loading={updatingCampaign}
					submitText="Save Changes"
				/>
			)}

			{/* Danger Zone */}
			{campaign.status !== "completed" && (
				<section className={styles.section}>
					<h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>
						Danger Zone
					</h3>
					<div className={`${styles.card} ${styles.dangerCard}`}>
						<div className={styles.dangerRow}>
							<div className={styles.dangerInfo}>
								<span className={styles.dangerLabel}>End Campaign</span>
								<span className={styles.dangerDescription}>
									Once ended, the campaign cannot be reactivated. All data will
									be preserved.
								</span>
							</div>
							<Button
								variant="secondary"
								leftIcon={
									updatingStatus
										? "ri-loader-4-line ri-spin"
										: "ri-stop-circle-line"
								}
								onClick={handleEnd}
								disabled={updatingStatus}
							>
								{updatingStatus ? "Ending..." : "End Campaign"}
							</Button>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
