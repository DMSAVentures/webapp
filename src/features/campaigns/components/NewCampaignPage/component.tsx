/**
 * NewCampaignPage Component
 * Container component for creating a new campaign
 */

import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { memo, useCallback, useEffect } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import { useCreateCampaign } from "@/hooks/useCreateCampaign";
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
	const { handleSubmit, handleCancel, loading, error } =
		useCreateCampaignHandler();
	const { showBanner } = useGlobalBanner();

	useEffect(() => {
		if (error) {
			showBanner({
				type: "error",
				title: "Failed to create campaign",
				description: error.error,
			});
		}
	}, [error, showBanner]);

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Create Campaign</h1>
					<p className={styles.pageDescription}>
						Create a new waitlist or referral campaign
					</p>
				</div>
			</div>

			<div className={styles.pageContent}>
				<CampaignForm
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					loading={loading}
					submitText="Create Campaign"
				/>
			</div>
		</motion.div>
	);
});

NewCampaignPage.displayName = "NewCampaignPage";
