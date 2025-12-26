import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CampaignFormPreview } from "@/features/campaigns/components/CampaignFormPreview/component";
import { CampaignStats } from "@/features/campaigns/components/CampaignStats/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const navigate = useNavigate();
	const { campaign } = useCampaignContext();

	if (!campaign) {
		return null;
	}

	// Build stats object for CampaignStats component
	const stats: CampaignStatsType = {
		totalSignups: campaign.totalSignups,
		verifiedSignups: campaign.totalVerified,
		totalReferrals: campaign.totalReferrals,
		conversionRate:
			campaign.totalSignups > 0
				? (campaign.totalVerified / campaign.totalSignups) * 100
				: 0,
		viralCoefficient:
			campaign.totalSignups > 0
				? campaign.totalReferrals / campaign.totalSignups
				: 0,
	};

	// Check if form is configured
	const hasFormFields = campaign.formFields && campaign.formFields.length > 0;

	const handleStatCardClick = (
		cardType: "totalSignups" | "verified" | "referrals" | "kFactor",
	) => {
		// K-Factor card leads to analytics tab, others lead to users
		if (cardType === "kFactor") {
			navigate({
				to: `/campaigns/$campaignId/analytics`,
				params: { campaignId },
			});
		} else {
			navigate({ to: `/campaigns/$campaignId/users`, params: { campaignId } });
		}
	};

	return (
		<div className={styles.overviewContent}>
			<div className={styles.header}>
				<h2 className={styles.title}>Overview</h2>
				<p className={styles.description}>
					Monitor your campaign performance and configuration at a glance
				</p>
			</div>

			<CampaignStats
				stats={stats}
				verificationEnabled={
					campaign.emailSettings?.verificationRequired ?? false
				}
				referralsEnabled={campaign.referralSettings?.enabled ?? false}
				onCardClick={handleStatCardClick}
			/>

			<div className={styles.detailsCard}>
				<h3 className={styles.detailsTitle}>Configuration</h3>
				<div className={styles.detailsContent}>
					{campaign.referralSettings && (
						<>
							<div className={styles.detailsSection}>
								<div className={styles.sectionTitle}>Referral Settings</div>
								<div className={styles.detailsList}>
									<div className={styles.detailItem}>
										<strong className={styles.detailLabel}>Enabled:</strong>
										<span className={styles.detailValue}>
											{campaign.referralSettings.enabled ? "Yes" : "No"}
										</span>
									</div>
									{campaign.referralSettings.pointsPerReferral && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>
												Points per Referral:
											</strong>
											<span className={styles.detailValue}>
												{campaign.referralSettings.pointsPerReferral}
											</span>
										</div>
									)}
									<div className={styles.detailItem}>
										<strong className={styles.detailLabel}>
											Verified Only:
										</strong>
										<span className={styles.detailValue}>
											{campaign.referralSettings.verifiedOnly ? "Yes" : "No"}
										</span>
									</div>
									{campaign.referralSettings.sharingChannels &&
										campaign.referralSettings.sharingChannels.length > 0 && (
											<div className={styles.detailItem}>
												<strong className={styles.detailLabel}>
													Sharing Channels:
												</strong>
												<span className={styles.detailValue}>
													{campaign.referralSettings.sharingChannels.join(", ")}
												</span>
											</div>
										)}
								</div>
							</div>
							<ContentDivider size="thin" />
						</>
					)}

					{campaign.emailSettings && (
						<>
							<div className={styles.detailsSection}>
								<div className={styles.sectionTitle}>Email Settings</div>
								<div className={styles.detailsList}>
									<div className={styles.detailItem}>
										<strong className={styles.detailLabel}>
											Verification Required:
										</strong>
										<span className={styles.detailValue}>
											{campaign.emailSettings.verificationRequired
												? "Yes"
												: "No"}
										</span>
									</div>
									{campaign.emailSettings.fromName && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>From Name:</strong>
											<span className={styles.detailValue}>
												{campaign.emailSettings.fromName}
											</span>
										</div>
									)}
									{campaign.emailSettings.fromEmail && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>
												From Email:
											</strong>
											<span className={styles.detailValue}>
												{campaign.emailSettings.fromEmail}
											</span>
										</div>
									)}
									{campaign.emailSettings.replyTo && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Reply To:</strong>
											<span className={styles.detailValue}>
												{campaign.emailSettings.replyTo}
											</span>
										</div>
									)}
								</div>
							</div>
							<ContentDivider size="thin" />
						</>
					)}

					<div className={styles.detailsSection}>
						<div className={styles.detailsList}>
							<div className={styles.detailItem}>
								<strong className={styles.detailLabel}>Created:</strong>
								<span className={styles.detailValue}>
									{new Date(campaign.createdAt).toLocaleString()}
								</span>
							</div>
							<div className={styles.detailItem}>
								<strong className={styles.detailLabel}>Last Updated:</strong>
								<span className={styles.detailValue}>
									{new Date(campaign.updatedAt).toLocaleString()}
								</span>
							</div>
							{campaign.launchDate && (
								<div className={styles.detailItem}>
									<strong className={styles.detailLabel}>Launch Date:</strong>
									<span className={styles.detailValue}>
										{new Date(campaign.launchDate).toLocaleString()}
									</span>
								</div>
							)}
							{campaign.endDate && (
								<div className={styles.detailItem}>
									<strong className={styles.detailLabel}>End Date:</strong>
									<span className={styles.detailValue}>
										{new Date(campaign.endDate).toLocaleString()}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{hasFormFields && <CampaignFormPreview campaign={campaign} />}
		</div>
	);
}
