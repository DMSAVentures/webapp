/**
 * CampaignSettings Component
 * Container component for campaign settings page
 */

import { useNavigate } from "@tanstack/react-router";
import { Loader2, StopCircle } from "lucide-react";
import { memo, useCallback, useEffect, useMemo } from "react";
import type { ApiTrackingIntegrationType } from "@/api/types/campaign";
import { useGlobalBanner } from "@/contexts/globalBanner";
import { useUpdateCampaign } from "@/hooks/useUpdateCampaign";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Banner } from "@/proto-design-system/components/feedback/Banner";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Campaign } from "@/types/campaign";
import { CampaignForm, type CampaignFormData } from "../CampaignForm/component";
import styles from "./component.module.scss";

export interface CampaignSettingsProps {
	/** Campaign ID */
	campaignId: string;
	/** Campaign data */
	campaign: Campaign;
	/** Callback to refetch campaign data */
	onRefetch: () => void;
}

// ============================================================================
// Types
// ============================================================================

interface UpdateCampaignPayload {
	name: string;
	description?: string;
	referral_settings:
		| {
				enabled: true;
				points_per_referral: number;
				verified_only: boolean;
				positions_to_jump: number;
				referrer_positions_to_jump: number;
				sharing_channels: Array<
					"email" | "twitter" | "facebook" | "linkedin" | "whatsapp"
				>;
		  }
		| {
				enabled: false;
		  };
	email_settings: {
		verification_required: boolean;
		send_welcome_email: boolean;
	};
	tracking_integrations?: Array<{
		integration_type: ApiTrackingIntegrationType;
		enabled: boolean;
		tracking_id: string;
		tracking_label?: string;
	}>;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Transform campaign data to form data format */
function transformCampaignToFormData(
	campaign: Campaign,
): Partial<CampaignFormData> {
	return {
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
}

/** Transform form data to API payload format */
function transformFormDataToApiPayload(
	data: CampaignFormData,
): UpdateCampaignPayload {
	return {
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
			integration_type: i.type as ApiTrackingIntegrationType,
			enabled: i.enabled,
			tracking_id: i.id,
			tracking_label: i.label,
		})),
	};
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing campaign settings updates */
function useCampaignSettingsActions(campaignId: string, onRefetch: () => void) {
	const { showBanner } = useGlobalBanner();
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

	const handleEnd = useCallback(async () => {
		const updated = await updateStatus(campaignId, { status: "completed" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign has been ended" });
			onRefetch();
		}
	}, [campaignId, updateStatus, showBanner, onRefetch]);

	const handleSave = useCallback(
		async (data: CampaignFormData) => {
			const payload = transformFormDataToApiPayload(data);
			const updated = await updateCampaign(campaignId, payload);
			if (updated) {
				showBanner({ type: "success", title: "Campaign settings saved!" });
				onRefetch();
			}
		},
		[campaignId, updateCampaign, showBanner, onRefetch],
	);

	return {
		updatingStatus,
		updatingCampaign,
		handleEnd,
		handleSave,
	};
}

// ============================================================================
// Sub-Components
// ============================================================================

interface DangerZoneProps {
	onEnd: () => void;
	loading: boolean;
}

/** Danger zone section for ending a campaign */
const DangerZone = memo(function DangerZone({
	onEnd,
	loading,
}: DangerZoneProps) {
	return (
		<Stack gap="sm" as="section">
			<Text as="h3" size="lg" weight="semibold" className={styles.dangerTitle}>
				Danger Zone
			</Text>
			<Card variant="outlined" padding="md" className={styles.dangerCard}>
				<Stack direction="row" justify="between" align="center" gap="md" wrap>
					<Stack gap="xs">
						<Text size="md" weight="medium">End Campaign</Text>
						<Text size="sm" color="muted">
							Once ended, the campaign cannot be reactivated. All data will be
							preserved.
						</Text>
					</Stack>
					<Button
						variant="destructive"
						leftIcon={
							loading ? <Loader2 size={16} className={styles.spin} /> : <StopCircle size={16} />
						}
						onClick={onEnd}
						disabled={loading}
					>
						{loading ? "Ending..." : "End Campaign"}
					</Button>
				</Stack>
			</Card>
		</Stack>
	);
});

DangerZone.displayName = "DangerZone";

// ============================================================================
// Component
// ============================================================================

/**
 * CampaignSettings displays and manages campaign configuration
 */
export const CampaignSettings = memo(function CampaignSettings({
	campaignId,
	campaign,
	onRefetch,
}: CampaignSettingsProps) {
	const navigate = useNavigate();

	// Hooks
	const { updatingStatus, updatingCampaign, handleEnd, handleSave } =
		useCampaignSettingsActions(campaignId, onRefetch);

	// Derived state
	const initialFormData = useMemo(
		() => transformCampaignToFormData(campaign),
		[campaign],
	);

	// Handlers
	const handleCancel = useCallback(() => {
		navigate({ to: `/campaigns/$campaignId`, params: { campaignId } });
	}, [navigate, campaignId]);

	// Don't render form for completed campaigns
	const isCompleted = campaign.status === "completed";

	return (
		<Stack gap="lg" className={styles.settings} animate>
			{/* Page Header */}
			<Stack gap="xs">
				<Text as="h2" size="xl" weight="semibold">Campaign Settings</Text>
				<Text size="md" color="secondary">
					Configure your campaign settings, email options, and growth features
				</Text>
			</Stack>

			{/* Ended Campaign Notice */}
			{isCompleted && (
				<Banner
					type="warning"
					variant="lighter"
					title="Campaign Ended"
					description="This campaign has ended. Settings are read-only."
					dismissible={false}
				/>
			)}

			{/* Campaign Settings Form */}
			<CampaignForm
				campaignId={campaignId}
				initialData={initialFormData}
				onSubmit={handleSave}
				onCancel={handleCancel}
				loading={updatingCampaign}
				submitText="Save Changes"
				disabled={isCompleted}
			/>

			{/* Danger Zone - only show for active campaigns */}
			{!isCompleted && (
				<DangerZone onEnd={handleEnd} loading={updatingStatus} />
			)}
		</Stack>
	);
});

CampaignSettings.displayName = "CampaignSettings";
