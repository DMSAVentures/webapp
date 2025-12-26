import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import { CampaignFormPreview } from "@/features/campaigns/components/CampaignFormPreview/component";
import { CampaignStats } from "@/features/campaigns/components/CampaignStats/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { useGetEmailTemplates } from "@/hooks/useEmailTemplates";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Button } from "@/proto-design-system/Button/button";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const navigate = useNavigate();
	const { campaign, refetch } = useCampaignContext();
	const { templates: emailTemplates, loading: emailTemplatesLoading } =
		useGetEmailTemplates(campaign?.id ?? "");
	const {
		updateStatus,
		loading: updatingStatus,
		error: statusError,
	} = useUpdateCampaignStatus();
	const { showBanner } = useGlobalBanner();

	// Check setup status
	const hasFormFields = campaign?.formFields && campaign.formFields.length > 0;
	const isDraft = campaign?.status === "draft";
	const isActive = campaign?.status === "active";
	const isPaused = campaign?.status === "paused";

	// Check email template requirements based on settings
	const needsVerificationEmail =
		campaign?.emailSettings?.verificationRequired ?? false;
	const needsWelcomeEmail = campaign?.emailSettings?.sendWelcomeEmail ?? false;
	const hasVerificationTemplate = emailTemplates?.some(
		(t) => t.type === "verification",
	);
	const hasWelcomeTemplate = emailTemplates?.some((t) => t.type === "welcome");

	const hasRequiredEmailTemplates =
		emailTemplatesLoading ||
		((!needsVerificationEmail || hasVerificationTemplate) &&
			(!needsWelcomeEmail || hasWelcomeTemplate));

	// Can go live only if form is configured AND required email templates are set up
	const canGoLive = isDraft && hasFormFields && hasRequiredEmailTemplates;

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

	const handleGoLive = async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign is now live!" });
			refetch();
		}
	};

	const handlePause = async () => {
		const updated = await updateStatus(campaignId, { status: "paused" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign has been paused" });
			refetch();
		}
	};

	const handleResume = async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign has been resumed" });
			refetch();
		}
	};

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

			{/* Campaign Status Row */}
			<div className={styles.statusRow}>
				<span className={styles.statusLabel}>Status</span>
				<StatusBadge
					text={
						campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)
					}
					variant={
						campaign.status === "active"
							? "completed"
							: campaign.status === "paused"
								? "disabled"
								: campaign.status === "completed"
									? "completed"
									: "pending"
					}
				/>
				{isActive && (
					<Button
						variant="secondary"
						size="small"
						leftIcon={
							updatingStatus ? "ri-loader-4-line ri-spin" : "ri-pause-line"
						}
						onClick={handlePause}
						disabled={updatingStatus}
					>
						{updatingStatus ? "Pausing..." : "Pause"}
					</Button>
				)}
				{isPaused && (
					<Button
						variant="primary"
						size="small"
						leftIcon={
							updatingStatus ? "ri-loader-4-line ri-spin" : "ri-play-line"
						}
						onClick={handleResume}
						disabled={updatingStatus}
					>
						{updatingStatus ? "Resuming..." : "Resume"}
					</Button>
				)}
			</div>

			{/* Launch Checklist for draft campaigns */}
			{isDraft && (
				<div className={styles.checklistSection}>
					<h3 className={styles.checklistTitle}>Launch Checklist</h3>
					<div className={styles.checklistCard}>
						<ul className={styles.checklistItems}>
							<li
								className={`${styles.checklistItem} ${hasFormFields ? styles.checklistItemComplete : ""}`}
								onClick={() =>
									navigate({
										to: "/campaigns/$campaignId/form-builder",
										params: { campaignId },
									})
								}
							>
								<i
									className={`${styles.checklistIcon} ${
										hasFormFields
											? "ri-checkbox-circle-fill"
											: "ri-checkbox-blank-circle-line"
									}`}
								/>
								<div className={styles.checklistItemContent}>
									<span className={styles.checklistItemText}>
										Configure signup form
									</span>
									<span className={styles.checklistItemDescription}>
										{hasFormFields
											? `${campaign.formFields?.length} field${campaign.formFields?.length === 1 ? "" : "s"} configured`
											: "Add fields to collect user information"}
									</span>
								</div>
								<span className={styles.checklistItemBadge}>Required</span>
								<i
									className={`${styles.checklistArrow} ri-arrow-right-s-line`}
								/>
							</li>
							{(needsVerificationEmail || needsWelcomeEmail) && (
								<li
									className={`${styles.checklistItem} ${hasRequiredEmailTemplates ? styles.checklistItemComplete : ""}`}
									onClick={() =>
										navigate({
											to: "/campaigns/$campaignId/email-builder",
											params: { campaignId },
										})
									}
								>
									<i
										className={`${styles.checklistIcon} ${
											hasRequiredEmailTemplates
												? "ri-checkbox-circle-fill"
												: "ri-checkbox-blank-circle-line"
										}`}
									/>
									<div className={styles.checklistItemContent}>
										<span className={styles.checklistItemText}>
											Set up email templates
										</span>
										<span className={styles.checklistItemDescription}>
											{hasRequiredEmailTemplates
												? "Email templates configured"
												: `Configure ${[
														needsVerificationEmail && "verification",
														needsWelcomeEmail && "welcome",
													]
														.filter(Boolean)
														.join(
															" & ",
														)} email${needsVerificationEmail && needsWelcomeEmail ? "s" : ""}`}
										</span>
									</div>
									<i
										className={`${styles.checklistArrow} ri-arrow-right-s-line`}
									/>
								</li>
							)}
						</ul>
						<div className={styles.checklistFooter}>
							<Button
								variant="primary"
								leftIcon={
									updatingStatus ? "ri-loader-4-line ri-spin" : "ri-rocket-line"
								}
								onClick={handleGoLive}
								disabled={updatingStatus || !canGoLive}
							>
								{updatingStatus ? "Launching..." : "Go Live"}
							</Button>
						</div>
					</div>
				</div>
			)}

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
									{campaign.referralSettings.pointsPerReferral != null && (
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
