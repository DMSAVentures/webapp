import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import { CampaignFormPreview } from "@/features/campaigns/components/CampaignFormPreview/component";
import { CampaignStats } from "@/features/campaigns/components/CampaignStats/component";
import { useCampaignContext } from "@/features/campaigns/contexts/CampaignContext";
import { useGetEmailTemplates } from "@/hooks/useEmailTemplates";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Badge } from "@/proto-design-system/badge/badge";
import { Button } from "@/proto-design-system/Button/button";
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
		// K-Factor card leads to analytics tab, others lead to leads
		if (cardType === "kFactor") {
			navigate({
				to: `/campaigns/$campaignId/analytics`,
				params: { campaignId },
			});
		} else {
			navigate({ to: `/campaigns/$campaignId/leads`, params: { campaignId } });
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

			<div className={styles.configSection}>
				<h3 className={styles.detailsTitle}>Configuration</h3>
				<div className={styles.configGrid}>
					<div className={styles.configCard}>
						<div className={styles.configCardHeader}>
							<i
								className={`ri-mail-line ${styles.configCardIcon}`}
								aria-hidden="true"
							/>
							<span className={styles.configCardTitle}>Email</span>
							<Badge
								text={
									campaign.emailSettings?.verificationRequired
										? "Verification On"
										: "Verification Off"
								}
								variant={
									campaign.emailSettings?.verificationRequired ? "blue" : "gray"
								}
								styleType="light"
								size="small"
							/>
						</div>
						{(campaign.emailSettings?.fromName ||
							campaign.emailSettings?.fromEmail) && (
							<div className={styles.configCardDetails}>
								{campaign.emailSettings.fromName && (
									<span className={styles.configDetail}>
										From: {campaign.emailSettings.fromName}
									</span>
								)}
								{campaign.emailSettings.fromEmail && (
									<span className={styles.configDetail}>
										{campaign.emailSettings.fromEmail}
									</span>
								)}
								{campaign.emailSettings.replyTo && (
									<span className={styles.configDetail}>
										Reply to: {campaign.emailSettings.replyTo}
									</span>
								)}
							</div>
						)}
					</div>

					<div className={styles.configCard}>
						<div className={styles.configCardHeader}>
							<i
								className={`ri-share-line ${styles.configCardIcon}`}
								aria-hidden="true"
							/>
							<span className={styles.configCardTitle}>Referrals</span>
							<Badge
								text={
									campaign.referralSettings?.enabled ? "Enabled" : "Disabled"
								}
								variant={campaign.referralSettings?.enabled ? "green" : "gray"}
								styleType="light"
								size="small"
							/>
						</div>
						{campaign.referralSettings?.enabled && (
							<div className={styles.configCardDetails}>
								{campaign.referralSettings.pointsPerReferral != null &&
									campaign.referralSettings.pointsPerReferral > 0 && (
										<span className={styles.configDetail}>
											<strong>
												{campaign.referralSettings.pointsPerReferral}
											</strong>{" "}
											points per referral
										</span>
									)}
								{campaign.referralSettings.verifiedOnly && (
									<span className={styles.configDetail}>
										Verified referrals only
									</span>
								)}
								{campaign.referralSettings.sharingChannels &&
									campaign.referralSettings.sharingChannels.length > 0 && (
										<div className={styles.configChannels}>
											{campaign.referralSettings.sharingChannels.map(
												(channel) => (
													<Badge
														key={channel}
														text={channel}
														variant="gray"
														styleType="lighter"
														size="small"
														iconClass={
															channel === "twitter"
																? "twitter-x-line"
																: channel === "facebook"
																	? "facebook-line"
																	: channel === "linkedin"
																		? "linkedin-line"
																		: channel === "email"
																			? "mail-line"
																			: "link"
														}
														iconPosition="left"
													/>
												),
											)}
										</div>
									)}
							</div>
						)}
					</div>

					<div className={styles.configCard}>
						<div className={styles.configCardHeader}>
							<i
								className={`ri-calendar-line ${styles.configCardIcon}`}
								aria-hidden="true"
							/>
							<span className={styles.configCardTitle}>Timeline</span>
						</div>
						<div className={styles.configCardDetails}>
							<span className={styles.configDetail}>
								Created:{" "}
								{new Date(campaign.createdAt).toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</span>
							<span className={styles.configDetail}>
								Updated:{" "}
								{new Date(campaign.updatedAt).toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</span>
							{campaign.launchDate && (
								<span className={styles.configDetail}>
									Launch:{" "}
									{new Date(campaign.launchDate).toLocaleDateString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							)}
							{campaign.endDate && (
								<span className={styles.configDetail}>
									End:{" "}
									{new Date(campaign.endDate).toLocaleDateString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{hasFormFields && <CampaignFormPreview campaign={campaign} />}
		</div>
	);
}
