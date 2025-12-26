import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import {
	CampaignForm,
	type CampaignFormData,
} from "@/features/campaigns/components/CampaignForm/component";
import { useUpdateCampaign } from "@/hooks/useUpdateCampaign";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Button } from "@/proto-design-system/Button/button";
import Banner from "@/proto-design-system/banner/banner";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
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
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	if (!campaign) {
		return null;
	}

	const hasFormFields = campaign.formFields && campaign.formFields.length > 0;
	const canGoLive = campaign.status === "draft" && hasFormFields;
	const canEdit = campaign.status === "draft" || campaign.status === "paused";

	const showSuccess = (message: string) => {
		setSuccessMessage(message);
		setTimeout(() => setSuccessMessage(null), 3000);
	};

	const handleGoLive = async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			showSuccess("Campaign is now live!");
			refetch();
		}
	};

	const handlePause = async () => {
		const updated = await updateStatus(campaignId, { status: "paused" });
		if (updated) {
			showSuccess("Campaign has been paused");
			refetch();
		}
	};

	const handleResume = async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			showSuccess("Campaign has been resumed");
			refetch();
		}
	};

	const handleEnd = async () => {
		const updated = await updateStatus(campaignId, { status: "completed" });
		if (updated) {
			showSuccess("Campaign has been ended");
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
			showSuccess("Campaign settings saved!");
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
			<div className={styles.header}>
				<h2 className={styles.title}>Settings</h2>
				<p className={styles.description}>
					Manage campaign status, configuration, and danger zone actions
				</p>
			</div>

			{successMessage && (
				<Banner
					bannerType="success"
					variant="filled"
					alertTitle={successMessage}
					alertDescription=""
				/>
			)}

			{(statusError || updateError) && (
				<Banner
					bannerType="error"
					variant="filled"
					alertTitle="Failed to update campaign"
					alertDescription={statusError?.error || updateError?.error || ""}
				/>
			)}

			{/* Campaign Status Section */}
			<section className={styles.section}>
				<h3 className={styles.sectionTitle}>Campaign Status</h3>
				<div className={styles.card}>
					<div className={styles.statusRow}>
						<div className={styles.statusInfo}>
							<span className={styles.statusLabel}>Current Status</span>
							<span
								className={`${styles.statusValue} ${styles[`status_${campaign.status}`]}`}
							>
								{campaign.status.charAt(0).toUpperCase() +
									campaign.status.slice(1)}
							</span>
						</div>

						{campaign.status === "draft" && (
							<div className={styles.statusActions}>
								{!hasFormFields && (
									<p className={styles.statusWarning}>
										Configure your form before going live
									</p>
								)}
								<Button
									variant="primary"
									leftIcon={
										updatingStatus
											? "ri-loader-4-line ri-spin"
											: "ri-rocket-line"
									}
									onClick={handleGoLive}
									disabled={updatingStatus || !canGoLive}
								>
									{updatingStatus ? "Launching..." : "Go Live"}
								</Button>
							</div>
						)}

						{campaign.status === "active" && (
							<div className={styles.statusActions}>
								<Button
									variant="secondary"
									leftIcon={
										updatingStatus
											? "ri-loader-4-line ri-spin"
											: "ri-pause-line"
									}
									onClick={handlePause}
									disabled={updatingStatus}
								>
									{updatingStatus ? "Pausing..." : "Pause Campaign"}
								</Button>
							</div>
						)}

						{campaign.status === "paused" && (
							<div className={styles.statusActions}>
								<Button
									variant="primary"
									leftIcon={
										updatingStatus
											? "ri-loader-4-line ri-spin"
											: "ri-play-line"
									}
									onClick={handleResume}
									disabled={updatingStatus}
								>
									{updatingStatus ? "Resuming..." : "Resume Campaign"}
								</Button>
							</div>
						)}
					</div>
				</div>
			</section>

			<ContentDivider size="thin" />

			{/* Campaign Settings Form */}
			{campaign.status !== "completed" && (
				<>
					<section className={styles.section}>
						<h3 className={styles.sectionTitle}>Campaign Settings</h3>
						{!canEdit && (
							<Banner
								bannerType="info"
								variant="light"
								alertTitle="Editing disabled"
								alertDescription="Pause the campaign to edit settings."
								dismissible={false}
							/>
						)}
						<div className={canEdit ? "" : styles.formDisabled}>
							<CampaignForm
								campaignId={campaignId}
								initialData={initialFormData}
								onSubmit={handleFormSubmit}
								onCancel={handleFormCancel}
								loading={updatingCampaign}
								submitText="Save Changes"
							/>
						</div>
					</section>

					<ContentDivider size="thin" />
				</>
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
