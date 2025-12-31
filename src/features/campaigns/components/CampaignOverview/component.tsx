/**
 * CampaignOverview Component
 * Container component for campaign overview page
 */

import { useNavigate } from "@tanstack/react-router";
import {
	Calendar,
	CheckCircle2,
	ChevronRight,
	Circle,
	Loader2,
	Mail,
	Rocket,
	Settings,
	Share2,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import type { EmailTemplate } from "@/hooks/useEmailTemplates";
import { useGetEmailTemplates } from "@/hooks/useEmailTemplates";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
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

/** Format date for display (short format) */
function formatDateShort(date: string | Date): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return dateObj.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
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

	return {
		loading,
		handleGoLive,
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

	const needsVerificationEmail =
		campaign.emailSettings?.verificationRequired ?? false;
	const needsWelcomeEmail = campaign.emailSettings?.sendWelcomeEmail ?? false;

	const hasRequiredEmailTemplates = checkEmailTemplates(
		emailTemplates,
		needsVerificationEmail,
		needsWelcomeEmail,
		emailTemplatesLoading,
	);

	const hasReferralRewards = Boolean(
		campaign.referralSettings?.enabled &&
			campaign.referralSettings?.pointsPerReferral != null &&
			campaign.referralSettings.pointsPerReferral > 0,
	);

	return {
		hasFormFields,
		isDraft,
		needsVerificationEmail,
		needsWelcomeEmail,
		hasRequiredEmailTemplates,
		hasReferralRewards,
	};
}

// ============================================================================
// Sub-Components
// ============================================================================

interface LaunchChecklistProps {
	campaignId: string;
	hasFormFields: boolean;
	formFieldCount: number;
	hasRequiredEmailTemplates: boolean;
	hasReferralRewards: boolean;
	referralsEnabled: boolean;
	canGoLive: boolean;
	isUpdating: boolean;
	onGoLive: () => void;
}

const LaunchChecklist = memo(function LaunchChecklist({
	campaignId,
	hasFormFields,
	formFieldCount,
	hasRequiredEmailTemplates,
	hasReferralRewards,
	referralsEnabled,
	canGoLive,
	isUpdating,
	onGoLive,
}: LaunchChecklistProps) {
	const navigate = useNavigate();

	// Calculate completion count
	const totalItems = referralsEnabled ? 3 : 2;
	let completedItems = 0;
	if (hasFormFields) completedItems++;
	if (hasRequiredEmailTemplates) completedItems++;
	if (referralsEnabled && hasReferralRewards) completedItems++;
	const isComplete = completedItems === totalItems;

	return (
		<div className={styles.checklistCard}>
			<div className={styles.checklistHeader}>
				<div>
					<h3 className={styles.checklistTitle}>Launch Checklist</h3>
					<p className={styles.checklistSubtitle}>
						Complete these steps before going live
					</p>
				</div>
				<Badge variant="success" size="sm">
					{completedItems}/{totalItems} Complete
				</Badge>
			</div>

			<ul className={styles.checklistItems}>
				{/* Configure signup form */}
				<li
					className={`${styles.checklistItem} ${hasFormFields ? styles.checklistItemComplete : ""}`}
					onClick={() =>
						navigate({
							to: "/campaigns/$campaignId/form-builder",
							params: { campaignId },
						})
					}
				>
					<Icon
						icon={hasFormFields ? CheckCircle2 : Circle}
						size="md"
						className={styles.checklistIcon}
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
					{!hasFormFields && (
						<span className={styles.checklistItemBadge}>Required</span>
					)}
					<Icon
						icon={ChevronRight}
						size="sm"
						className={styles.checklistArrow}
					/>
				</li>

				{/* Set up email templates */}
				<li
					className={`${styles.checklistItem} ${hasRequiredEmailTemplates ? styles.checklistItemComplete : ""}`}
					onClick={() =>
						navigate({
							to: "/campaigns/$campaignId/email-builder",
							params: { campaignId },
						})
					}
				>
					<Icon
						icon={hasRequiredEmailTemplates ? CheckCircle2 : Circle}
						size="md"
						className={styles.checklistIcon}
					/>
					<div className={styles.checklistItemContent}>
						<span className={styles.checklistItemText}>
							Set up email templates
						</span>
						<span className={styles.checklistItemDescription}>
							{hasRequiredEmailTemplates
								? "Email templates configured"
								: "Configure verification & welcome emails"}
						</span>
					</div>
					<Icon
						icon={ChevronRight}
						size="sm"
						className={styles.checklistArrow}
					/>
				</li>

				{/* Configure referral rewards - only show if referrals enabled */}
				{referralsEnabled && (
					<li
						className={`${styles.checklistItem} ${hasReferralRewards ? styles.checklistItemComplete : ""}`}
						onClick={() =>
							navigate({
								to: "/campaigns/$campaignId/settings",
								params: { campaignId },
							})
						}
					>
						<Icon
							icon={hasReferralRewards ? CheckCircle2 : Circle}
							size="md"
							className={styles.checklistIcon}
						/>
						<div className={styles.checklistItemContent}>
							<span className={styles.checklistItemText}>
								Configure referral rewards
							</span>
							<span className={styles.checklistItemDescription}>
								{hasReferralRewards
									? "Rewards configured"
									: "Set up rewards for successful referrals"}
							</span>
						</div>
						<Icon
							icon={ChevronRight}
							size="sm"
							className={styles.checklistArrow}
						/>
					</li>
				)}
			</ul>

			<div className={styles.checklistFooter}>
				{isComplete ? (
					<Button
						variant="primary"
						onClick={onGoLive}
						disabled={isUpdating || !canGoLive}
					>
						{isUpdating ? (
							<Icon icon={Loader2} size="sm" className={styles.spin} />
						) : (
							<Icon icon={Rocket} size="sm" />
						)}
						{isUpdating ? "Launching..." : "Go Live"}
					</Button>
				) : (
					<Button
						variant="outline"
						onClick={() => {
							// Navigate to first incomplete item
							if (!hasFormFields) {
								navigate({
									to: "/campaigns/$campaignId/form-builder",
									params: { campaignId },
								});
							} else if (!hasRequiredEmailTemplates) {
								navigate({
									to: "/campaigns/$campaignId/email-builder",
									params: { campaignId },
								});
							} else if (referralsEnabled && !hasReferralRewards) {
								navigate({
									to: "/campaigns/$campaignId/settings",
									params: { campaignId },
								});
							}
						}}
					>
						{!hasFormFields
							? "Configure Form"
							: !hasRequiredEmailTemplates
								? "Set Up Email Templates"
								: "Set Up Referral Rewards"}
						<Icon icon={ChevronRight} size="sm" />
					</Button>
				)}
			</div>
		</div>
	);
});

interface ConfigurationCardProps {
	campaign: Campaign;
	campaignId: string;
}

const ConfigurationCard = memo(function ConfigurationCard({
	campaign,
	campaignId,
}: ConfigurationCardProps) {
	const navigate = useNavigate();
	const verificationEnabled =
		campaign.emailSettings?.verificationRequired ?? false;
	const referralsEnabled = campaign.referralSettings?.enabled ?? false;

	return (
		<div className={styles.configCard}>
			<h3 className={styles.configTitle}>Configuration</h3>

			<div className={styles.configList}>
				{/* Email Verification */}
				<div className={styles.configRow}>
					<div className={styles.configRowLeft}>
						<Icon icon={Mail} size="sm" className={styles.configIcon} />
						<span className={styles.configLabel}>Email Verification</span>
					</div>
					<Badge
						variant={verificationEnabled ? "success" : "secondary"}
						size="sm"
					>
						{verificationEnabled ? "On" : "Off"}
					</Badge>
				</div>

				{/* Referrals */}
				<div className={styles.configRow}>
					<div className={styles.configRowLeft}>
						<Icon icon={Share2} size="sm" className={styles.configIcon} />
						<span className={styles.configLabel}>Referrals</span>
					</div>
					<span className={styles.configValue}>
						{referralsEnabled ? "On" : "Off"}
					</span>
				</div>

				{/* Created */}
				<div className={styles.configRow}>
					<div className={styles.configRowLeft}>
						<Icon icon={Calendar} size="sm" className={styles.configIcon} />
						<span className={styles.configLabel}>Created</span>
					</div>
					<span className={styles.configValue}>
						{formatDateShort(campaign.createdAt)}
					</span>
				</div>
			</div>

			<button
				className={styles.configSettingsLink}
				onClick={() =>
					navigate({
						to: "/campaigns/$campaignId/settings",
						params: { campaignId },
					})
				}
			>
				<Icon icon={Settings} size="sm" />
				Settings
			</button>
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

	const { loading: updatingStatus, handleGoLive } = useCampaignStatusActions(
		campaignId,
		onRefetch,
	);

	const {
		hasFormFields,
		isDraft,
		hasRequiredEmailTemplates,
		hasReferralRewards,
	} = useLaunchReadiness(campaign, emailTemplates, emailTemplatesLoading);

	// Derived state
	const stats = useMemo(() => calculateStats(campaign), [campaign]);
	const referralsEnabled = campaign.referralSettings?.enabled ?? false;
	const canGoLive = hasFormFields && hasRequiredEmailTemplates;

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
		<Stack gap="lg" className={styles.overviewContent} animate>
			{/* Stats Cards Row */}
			<CampaignStats
				stats={stats}
				verificationEnabled={
					campaign.emailSettings?.verificationRequired ?? false
				}
				referralsEnabled={referralsEnabled}
				onCardClick={handleStatCardClick}
			/>

			{/* Two-column layout for Checklist and Configuration */}
			{isDraft && (
				<div className={styles.twoColumnGrid}>
					<LaunchChecklist
						campaignId={campaignId}
						hasFormFields={hasFormFields}
						formFieldCount={campaign.formFields?.length ?? 0}
						hasRequiredEmailTemplates={hasRequiredEmailTemplates}
						hasReferralRewards={hasReferralRewards}
						referralsEnabled={referralsEnabled}
						canGoLive={canGoLive}
						isUpdating={updatingStatus}
						onGoLive={handleGoLive}
					/>
					<ConfigurationCard campaign={campaign} campaignId={campaignId} />
				</div>
			)}

			{/* Configuration only when not draft */}
			{!isDraft && (
				<ConfigurationCard campaign={campaign} campaignId={campaignId} />
			)}

			{/* Form Preview */}
			{hasFormFields && <CampaignFormPreview campaign={campaign} />}
		</Stack>
	);
});

CampaignOverview.displayName = "CampaignOverview";
