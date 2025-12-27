/**
 * CampaignOverview Component
 * Container component for campaign overview page
 */

import { useNavigate } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import type { EmailTemplate } from "@/hooks/useEmailTemplates";
import { useGetEmailTemplates } from "@/hooks/useEmailTemplates";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Button } from "@/proto-design-system/Button/button";
import { Badge } from "@/proto-design-system/badge/badge";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import type { Campaign } from "@/types/campaign";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import { CampaignFormPreview } from "../CampaignFormPreview/component";
import { CampaignStats } from "../CampaignStats/component";
import styles from "./component.module.scss";

export interface CampaignOverviewProps {
	/** Campaign ID */
	campaignId: string;
	/** Campaign data */
	campaign: Campaign;
	/** Callback to refetch campaign data */
	onRefetch: () => void;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Map campaign status to StatusBadge variant */
function getStatusVariant(
	status: Campaign["status"],
): "completed" | "pending" | "disabled" {
	switch (status) {
		case "active":
		case "completed":
			return "completed";
		case "paused":
			return "disabled";
		default:
			return "pending";
	}
}

/** Format status text for display */
function formatStatusText(status: string): string {
	return status.charAt(0).toUpperCase() + status.slice(1);
}

/** Format date for display */
function formatDate(date: string | Date): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

/** Calculate campaign stats */
function calculateStats(campaign: Campaign): CampaignStatsType {
	return {
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
}

/** Check if required email templates are configured */
function checkEmailTemplates(
	templates: EmailTemplate[] | undefined,
	needsVerification: boolean,
	needsWelcome: boolean,
	isLoading: boolean,
): boolean {
	if (isLoading) return true;
	const hasVerification =
		templates?.some((t) => t.type === "verification") ?? false;
	const hasWelcome = templates?.some((t) => t.type === "welcome") ?? false;
	return (
		(!needsVerification || hasVerification) && (!needsWelcome || hasWelcome)
	);
}

/** Build required email types message */
function buildEmailRequirementsMessage(
	needsVerification: boolean,
	needsWelcome: boolean,
): string {
	const types = [
		needsVerification && "verification",
		needsWelcome && "welcome",
	].filter(Boolean);
	const suffix = types.length > 1 ? "s" : "";
	return `Configure ${types.join(" & ")} email${suffix}`;
}

/** Get icon class for sharing channel */
function getChannelIcon(channel: string): string {
	switch (channel) {
		case "twitter":
			return "twitter-x-line";
		case "facebook":
			return "facebook-line";
		case "linkedin":
			return "linkedin-line";
		case "email":
			return "mail-line";
		default:
			return "link";
	}
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing campaign status updates */
function useCampaignStatusActions(campaignId: string, onRefetch: () => void) {
	const { updateStatus, loading, error } = useUpdateCampaignStatus();
	const { showBanner } = useGlobalBanner();

	useEffect(() => {
		if (error) {
			showBanner({
				type: "error",
				title: "Failed to update campaign status",
				description: error.error,
			});
		}
	}, [error, showBanner]);

	const handleGoLive = useCallback(async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign is now live!" });
			onRefetch();
		}
	}, [campaignId, updateStatus, showBanner, onRefetch]);

	const handlePause = useCallback(async () => {
		const updated = await updateStatus(campaignId, { status: "paused" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign has been paused" });
			onRefetch();
		}
	}, [campaignId, updateStatus, showBanner, onRefetch]);

	const handleResume = useCallback(async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			showBanner({ type: "success", title: "Campaign has been resumed" });
			onRefetch();
		}
	}, [campaignId, updateStatus, showBanner, onRefetch]);

	return {
		loading,
		handleGoLive,
		handlePause,
		handleResume,
	};
}

/** Hook for checking launch readiness */
function useLaunchReadiness(
	campaign: Campaign,
	emailTemplates: EmailTemplate[] | undefined,
	emailTemplatesLoading: boolean,
) {
	const hasFormFields = Boolean(
		campaign.formFields && campaign.formFields.length > 0,
	);
	const isDraft = campaign.status === "draft";
	const isActive = campaign.status === "active";
	const isPaused = campaign.status === "paused";

	const needsVerificationEmail =
		campaign.emailSettings?.verificationRequired ?? false;
	const needsWelcomeEmail = campaign.emailSettings?.sendWelcomeEmail ?? false;

	const hasRequiredEmailTemplates = checkEmailTemplates(
		emailTemplates,
		needsVerificationEmail,
		needsWelcomeEmail,
		emailTemplatesLoading,
	);

	const canGoLive = isDraft && hasFormFields && hasRequiredEmailTemplates;

	return {
		hasFormFields,
		isDraft,
		isActive,
		isPaused,
		needsVerificationEmail,
		needsWelcomeEmail,
		hasRequiredEmailTemplates,
		canGoLive,
	};
}

// ============================================================================
// Sub-Components
// ============================================================================

interface LaunchChecklistProps {
	campaignId: string;
	hasFormFields: boolean;
	formFieldCount: number;
	needsVerificationEmail: boolean;
	needsWelcomeEmail: boolean;
	hasRequiredEmailTemplates: boolean;
	canGoLive: boolean;
	isUpdating: boolean;
	onGoLive: () => void;
}

const LaunchChecklist = memo(function LaunchChecklist({
	campaignId,
	hasFormFields,
	formFieldCount,
	needsVerificationEmail,
	needsWelcomeEmail,
	hasRequiredEmailTemplates,
	canGoLive,
	isUpdating,
	onGoLive,
}: LaunchChecklistProps) {
	const navigate = useNavigate();
	const needsEmailSetup = needsVerificationEmail || needsWelcomeEmail;

	return (
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
									? `${formFieldCount} field${formFieldCount === 1 ? "" : "s"} configured`
									: "Add fields to collect user information"}
							</span>
						</div>
						<span className={styles.checklistItemBadge}>Required</span>
						<i className={`${styles.checklistArrow} ri-arrow-right-s-line`} />
					</li>
					{needsEmailSetup && (
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
										: buildEmailRequirementsMessage(
												needsVerificationEmail,
												needsWelcomeEmail,
											)}
								</span>
							</div>
							<i className={`${styles.checklistArrow} ri-arrow-right-s-line`} />
						</li>
					)}
				</ul>
				<div className={styles.checklistFooter}>
					<Button
						variant="primary"
						leftIcon={
							isUpdating ? "ri-loader-4-line ri-spin" : "ri-rocket-line"
						}
						onClick={onGoLive}
						disabled={isUpdating || !canGoLive}
					>
						{isUpdating ? "Launching..." : "Go Live"}
					</Button>
				</div>
			</div>
		</div>
	);
});

interface ConfigurationSectionProps {
	campaign: Campaign;
}

const ConfigurationSection = memo(function ConfigurationSection({
	campaign,
}: ConfigurationSectionProps) {
	return (
		<div className={styles.configSection}>
			<h3 className={styles.detailsTitle}>Configuration</h3>
			<div className={styles.configGrid}>
				{/* Email Config Card */}
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

				{/* Referrals Config Card */}
				<div className={styles.configCard}>
					<div className={styles.configCardHeader}>
						<i
							className={`ri-share-line ${styles.configCardIcon}`}
							aria-hidden="true"
						/>
						<span className={styles.configCardTitle}>Referrals</span>
						<Badge
							text={campaign.referralSettings?.enabled ? "Enabled" : "Disabled"}
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
													iconClass={getChannelIcon(channel)}
													iconPosition="left"
												/>
											),
										)}
									</div>
								)}
						</div>
					)}
				</div>

				{/* Timeline Config Card */}
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
							Created: {formatDate(campaign.createdAt)}
						</span>
						<span className={styles.configDetail}>
							Updated: {formatDate(campaign.updatedAt)}
						</span>
						{campaign.launchDate && (
							<span className={styles.configDetail}>
								Launch: {formatDate(campaign.launchDate)}
							</span>
						)}
						{campaign.endDate && (
							<span className={styles.configDetail}>
								End: {formatDate(campaign.endDate)}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

// ============================================================================
// Component
// ============================================================================

/**
 * CampaignOverview displays campaign status, stats, and configuration
 */
export const CampaignOverview = memo(function CampaignOverview({
	campaignId,
	campaign,
	onRefetch,
}: CampaignOverviewProps) {
	// Hooks
	const navigate = useNavigate();
	const { templates: emailTemplates, loading: emailTemplatesLoading } =
		useGetEmailTemplates(campaign.id);

	const {
		loading: updatingStatus,
		handleGoLive,
		handlePause,
		handleResume,
	} = useCampaignStatusActions(campaignId, onRefetch);

	const {
		hasFormFields,
		isDraft,
		isActive,
		isPaused,
		needsVerificationEmail,
		needsWelcomeEmail,
		hasRequiredEmailTemplates,
		canGoLive,
	} = useLaunchReadiness(campaign, emailTemplates, emailTemplatesLoading);

	// Derived state
	const stats = useMemo(() => calculateStats(campaign), [campaign]);

	// Handlers
	const handleStatCardClick = useCallback(
		(cardType: "totalSignups" | "verified" | "referrals" | "kFactor") => {
			if (cardType === "kFactor") {
				navigate({
					to: "/campaigns/$campaignId/analytics",
					params: { campaignId },
				});
			} else {
				navigate({
					to: "/campaigns/$campaignId/leads",
					params: { campaignId },
				});
			}
		},
		[navigate, campaignId],
	);

	// Render
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
					text={formatStatusText(campaign.status)}
					variant={getStatusVariant(campaign.status)}
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
				<LaunchChecklist
					campaignId={campaignId}
					hasFormFields={hasFormFields}
					formFieldCount={campaign.formFields?.length ?? 0}
					needsVerificationEmail={needsVerificationEmail}
					needsWelcomeEmail={needsWelcomeEmail}
					hasRequiredEmailTemplates={hasRequiredEmailTemplates}
					canGoLive={canGoLive}
					isUpdating={updatingStatus}
					onGoLive={handleGoLive}
				/>
			)}

			<CampaignStats
				stats={stats}
				verificationEnabled={
					campaign.emailSettings?.verificationRequired ?? false
				}
				referralsEnabled={campaign.referralSettings?.enabled ?? false}
				onCardClick={handleStatCardClick}
			/>

			<ConfigurationSection campaign={campaign} />

			{hasFormFields && <CampaignFormPreview campaign={campaign} />}
		</div>
	);
});

CampaignOverview.displayName = "CampaignOverview";
