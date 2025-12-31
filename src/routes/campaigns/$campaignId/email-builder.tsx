import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { GatedEmptyState } from "@/components/gating";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { EmailBuilder } from "@/features/email-builder/components/EmailBuilder/component";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import styles from "./email-builder.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/email-builder")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();
	const { hasAccess } = useFeatureAccess("visual_email_builder");

	if (!campaign) {
		return null;
	}

	// Show gated empty state for users without access
	if (!hasAccess) {
		return (
			<div className={styles.emailBuilder}>
				<div className={styles.header}>
					<h2 className={styles.title}>Email Templates</h2>
					<p className={styles.description}>
						Customize verification and welcome emails sent to your users
					</p>
				</div>
				<GatedEmptyState
					feature="visual_email_builder"
					icon={<Mail />}
					title="Visual Email Builder"
					description="Design beautiful emails with our drag-and-drop visual editor."
					bannerDescription="Upgrade to Pro to customize your email templates with the visual editor."
				/>
			</div>
		);
	}

	return (
		<div className={styles.emailBuilder}>
			<div className={styles.header}>
				<h2 className={styles.title}>Email Templates</h2>
				<p className={styles.description}>
					Customize verification and welcome emails sent to your users
				</p>
			</div>

			<EmailBuilder campaignId={campaignId} />
		</div>
	);
}
