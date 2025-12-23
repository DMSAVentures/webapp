import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
	CampaignForm,
	type CampaignFormData,
} from "@/features/campaigns/components/CampaignForm/component";
import { useCreateCampaign } from "@/hooks/useCreateCampaign";
import Banner from "@/proto-design-system/banner/banner";
import styles from "./campaigns.module.scss";

export const Route = createFileRoute("/campaigns/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { createCampaign, loading, error } = useCreateCampaign();

	const handleSubmit = async (data: CampaignFormData) => {
		// Generate slug from campaign name
		const slug = data.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");

		const campaign = await createCampaign({
			name: data.name,
			slug: slug,
			type: "waitlist",
			description: data.description,
			form_config: {
				captcha_enabled: data.formConfig?.captchaEnabled ?? false,
			},
			referral_config: data.settings.enableReferrals
				? {
						enabled: true,
						points_per_referral: data.referralConfig?.pointsPerReferral || 1,
						verified_only: data.referralConfig?.verifiedOnly ?? true,
						positions_to_jump: data.referralConfig?.positionsToJump || 0,
						referrer_positions_to_jump: data.referralConfig?.referrerPositionsToJump || 1,
						sharing_channels: (data.referralConfig?.sharingChannels ||
							[]) as Array<
							"email" | "twitter" | "facebook" | "linkedin" | "whatsapp"
						>,
					}
				: {
						enabled: false,
					},
			email_config: {
				verification_required: data.settings.emailVerificationRequired,
			},
		});

		if (campaign) {
			navigate({ to: `/campaigns/${campaign.id}` });
		}
	};

	const handleCancel = () => {
		navigate({ to: "/campaigns" });
	};

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

			{error && (
				<Banner
					bannerType="error"
					variant="filled"
					alertTitle="Failed to create campaign"
					alertDescription={error.error}
				/>
			)}

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
}
