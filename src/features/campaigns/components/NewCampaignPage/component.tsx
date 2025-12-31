/**
 * NewCampaignPage Component
 * Container component for creating a new campaign
 */

import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useEffect } from "react";
import { LimitUpgradeModal, useLimitGate } from "@/components/gating";
import { useCreateCampaign } from "@/hooks/useCreateCampaign";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useBannerCenter } from "@/proto-design-system/components/feedback/BannerCenter";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import { CampaignForm, type CampaignFormData } from "../CampaignForm/component";
import styles from "./component.module.scss";

// ============================================================================
// Types
// ============================================================================

type SharingChannel =
	| "email"
	| "twitter"
	| "facebook"
	| "linkedin"
	| "whatsapp";

interface CreateCampaignPayload {
	name: string;
	slug: string;
	type: "waitlist";
	description?: string;
	form_settings: {
		captcha_enabled: boolean;
	};
	referral_settings:
		| {
				enabled: true;
				points_per_referral: number;
				verified_only: boolean;
				positions_to_jump: number;
				referrer_positions_to_jump: number;
				sharing_channels: SharingChannel[];
		  }
		| {
				enabled: false;
		  };
	email_settings: {
		verification_required: boolean;
		send_welcome_email: boolean;
	};
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Generate URL-safe slug from campaign name */
function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

/** Transform form data to API create payload */
function transformFormDataToPayload(
	data: CampaignFormData,
): CreateCampaignPayload {
	return {
		name: data.name,
		slug: generateSlug(data.name),
		type: "waitlist",
		description: data.description,
		form_settings: {
			captcha_enabled: data.formConfig?.captchaEnabled ?? false,
		},
		referral_settings: data.settings.enableReferrals
			? {
					enabled: true,
					points_per_referral: data.referralConfig?.pointsPerReferral || 1,
					verified_only: data.referralConfig?.verifiedOnly ?? true,
					positions_to_jump: data.referralConfig?.positionsToJump || 0,
					referrer_positions_to_jump:
						data.referralConfig?.referrerPositionsToJump || 1,
					sharing_channels: (data.referralConfig?.sharingChannels ||
						[]) as SharingChannel[],
				}
			: {
					enabled: false,
				},
		email_settings: {
			verification_required: data.settings.emailVerificationRequired,
			send_welcome_email: data.settings.sendWelcomeEmail,
		},
	};
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for handling campaign creation and navigation */
function useCreateCampaignHandler() {
	const navigate = useNavigate();
	const { createCampaign, loading, error } = useCreateCampaign();

	const handleSubmit = useCallback(
		async (data: CampaignFormData) => {
			const payload = transformFormDataToPayload(data);
			const campaign = await createCampaign(payload);

			if (campaign) {
				navigate({ to: `/campaigns/${campaign.id}` });
			}
		},
		[createCampaign, navigate],
	);

	const handleCancel = useCallback(() => {
		navigate({ to: "/campaigns" });
	}, [navigate]);

	return { handleSubmit, handleCancel, loading, error };
}

// ============================================================================
// Component
// ============================================================================

/**
 * NewCampaignPage displays the form for creating a new campaign
 */
export const NewCampaignPage = memo(function NewCampaignPage() {
	const navigate = useNavigate();
	const { handleSubmit, handleCancel, loading, error } =
		useCreateCampaignHandler();
	const { addBanner } = useBannerCenter();

	// Check campaign limits
	const { data: campaignsData, loading: campaignsLoading } = useGetCampaigns();

	// Limit gating with auto-show for direct URL access
	const { isAtLimit, showModal, closeModal } = useLimitGate({
		limitKey: "campaigns",
		currentCount: campaignsData?.campaigns?.length ?? 0,
		autoShow: !campaignsLoading,
	});

	// Redirect to campaigns list when modal is closed
	const handleCloseModal = useCallback(() => {
		closeModal();
		navigate({ to: "/campaigns" });
	}, [closeModal, navigate]);

	useEffect(() => {
		if (error) {
			addBanner({
				type: "error",
				title: "Failed to create campaign",
				description: error.error,
				dismissible: true,
			});
		}
	}, [error, addBanner]);

	// Show loading while checking campaign count
	if (campaignsLoading) {
		return <Spinner size="lg" label="Loading..." />;
	}

	// If at limit, only show the modal (form is hidden)
	if (isAtLimit) {
		return (
			<LimitUpgradeModal
				isOpen={showModal}
				onClose={handleCloseModal}
				limitKey="campaigns"
				resourceName="campaign"
			/>
		);
	}

	return (
		<Stack gap="lg" className={styles.page} animate>
			<Stack gap="xs" className={styles.pageHeader}>
				<Text as="h1" size="2xl" weight="bold">
					Create Campaign
				</Text>
				<Text color="secondary">
					Create a new waitlist or referral campaign
				</Text>
			</Stack>

			<div className={styles.pageContent}>
				<CampaignForm
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					loading={loading}
					submitText="Create Campaign"
				/>
			</div>
		</Stack>
	);
});

NewCampaignPage.displayName = "NewCampaignPage";
