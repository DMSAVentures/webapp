import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useTier } from "@/contexts/tier";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { EmailBuilder } from "@/features/email-builder/components/EmailBuilder/component";
import styles from "./email-builder.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/email-builder")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const { campaign } = useCampaignContext();
	const { isAtLeast } = useTier();

	// Gate access to pro tier
	if (!isAtLeast("pro")) {
		return <Navigate to="/billing/plans" />;
	}

	if (!campaign) {
		return null;
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
