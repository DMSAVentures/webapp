/**
 * CampaignOverview Component
 * Container component for campaign overview page
 */

import { useNavigate } from "@tanstack/react-router";
import { Calendar, CheckCircle2, ChevronRight, Circle, Loader2, Mail, Pause, Play, Rocket, Share } from "lucide-react";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useGlobalBanner } from "@/contexts/globalBanner";
import type { EmailTemplate } from "@/hooks/useEmailTemplates";
import { useGetEmailTemplates } from "@/hooks/useEmailTemplates";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
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

/** Map campaign status to Badge variant */
function getStatusVariant(
	status: Campaign["status"],
): "success" | "warning" | "secondary" | "primary" {
	switch (status) {
		case "active":
			return "success";
		case "completed":
			return "primary";
		case "paused":
			return "secondary";
		default:
			return "warning";
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
						<span className={styles.checklistItemBadge}>Required</span>
						<Icon icon={ChevronRight} size="sm" className={styles.checklistArrow} />
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
										: buildEmailRequirementsMessage(
												needsVerificationEmail,
												needsWelcomeEmail,
											)}
								</span>
							</div>
							<Icon icon={ChevronRight} size="sm" className={styles.checklistArrow} />
						</li>
					)}
				</ul>
				<div className={styles.checklistFooter}>
					<Button
						variant="primary"
						leftIcon={
							isUpdating ? <Loader2 size={16} className={styles.spin} /> : <Rocket size={16} />
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
		<Stack gap="md" className={styles.configSection}>
			<Text as="h3" size="lg" weight="semibold">Configuration</Text>
			<div className={styles.configGrid}>
				{/* Email Config Card */}
				<Card padding="md" className={styles.configCard}>
					<Stack gap="sm">
						<Stack direction="row" gap="sm" align="center">
							<Icon icon={Mail} size="md" color="secondary" />
							<Text weight="semibold">Email</Text>
							<Badge
								variant={
									campaign.emailSettings?.verificationRequired ? "primary" : "secondary"
								}
								size="sm"
							>
								{campaign.emailSettings?.verificationRequired
									? "Verification On"
									: "Verification Off"}
							</Badge>
						</Stack>
						{(campaign.emailSettings?.fromName ||
							campaign.emailSettings?.fromEmail) && (
							<Stack gap="xs">
								{campaign.emailSettings.fromName && (
									<Text size="sm" color="secondary">
										From: {campaign.emailSettings.fromName}
									</Text>
								)}
								{campaign.emailSettings.fromEmail && (
									<Text size="sm" color="secondary">
										{campaign.emailSettings.fromEmail}
									</Text>
								)}
								{campaign.emailSettings.replyTo && (
									<Text size="sm" color="secondary">
										Reply to: {campaign.emailSettings.replyTo}
									</Text>
								)}
							</Stack>
						)}
					</Stack>
				</Card>

				{/* Referrals Config Card */}
				<Card padding="md" className={styles.configCard}>
					<Stack gap="sm">
						<Stack direction="row" gap="sm" align="center">
							<Icon icon={Share} size="md" color="secondary" />
							<Text weight="semibold">Referrals</Text>
							<Badge
								variant={campaign.referralSettings?.enabled ? "success" : "secondary"}
								size="sm"
							>
								{campaign.referralSettings?.enabled ? "Enabled" : "Disabled"}
							</Badge>
						</Stack>
						{campaign.referralSettings?.enabled && (
							<Stack gap="xs">
								{campaign.referralSettings.pointsPerReferral != null &&
									campaign.referralSettings.pointsPerReferral > 0 && (
										<Text size="sm" color="secondary">
											<Text as="strong" weight="semibold">
												{campaign.referralSettings.pointsPerReferral}
											</Text>{" "}
											points per referral
										</Text>
									)}
								{campaign.referralSettings.verifiedOnly && (
									<Text size="sm" color="secondary">
										Verified referrals only
									</Text>
								)}
								{campaign.referralSettings.sharingChannels &&
									campaign.referralSettings.sharingChannels.length > 0 && (
										<Stack direction="row" gap="xs" wrap>
											{campaign.referralSettings.sharingChannels.map(
												(channel) => (
													<Badge
														key={channel}
														variant="secondary"
														size="sm"
													>
														{channel}
													</Badge>
												),
											)}
										</Stack>
									)}
							</Stack>
						)}
					</Stack>
				</Card>

				{/* Timeline Config Card */}
				<Card padding="md" className={styles.configCard}>
					<Stack gap="sm">
						<Stack direction="row" gap="sm" align="center">
							<Icon icon={Calendar} size="md" color="secondary" />
							<Text weight="semibold">Timeline</Text>
						</Stack>
						<Stack gap="xs">
							<Text size="sm" color="secondary">
								Created: {formatDate(campaign.createdAt)}
							</Text>
							<Text size="sm" color="secondary">
								Updated: {formatDate(campaign.updatedAt)}
							</Text>
							{campaign.launchDate && (
								<Text size="sm" color="secondary">
									Launch: {formatDate(campaign.launchDate)}
								</Text>
							)}
							{campaign.endDate && (
								<Text size="sm" color="secondary">
									End: {formatDate(campaign.endDate)}
								</Text>
							)}
						</Stack>
					</Stack>
				</Card>
			</div>
		</Stack>
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
		<Stack gap="lg" className={styles.overviewContent}>
			<Stack gap="xs">
				<Text as="h2" size="xl" weight="semibold">Overview</Text>
				<Text color="secondary">
					Monitor your campaign performance and configuration at a glance
				</Text>
			</Stack>

			{/* Campaign Status Row */}
			<Stack direction="row" gap="sm" align="center">
				<Text size="sm" weight="medium" color="secondary">Status</Text>
				<Badge variant={getStatusVariant(campaign.status)}>
					{formatStatusText(campaign.status)}
				</Badge>
				{isActive && (
					<Button
						variant="secondary"
						size="sm"
						leftIcon={
							updatingStatus ? <Loader2 size={16} className={styles.spin} /> : <Pause size={16} />
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
						size="sm"
						leftIcon={
							updatingStatus ? <Loader2 size={16} className={styles.spin} /> : <Play size={16} />
						}
						onClick={handleResume}
						disabled={updatingStatus}
					>
						{updatingStatus ? "Resuming..." : "Resume"}
					</Button>
				)}
			</Stack>

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
		</Stack>
	);
});

CampaignOverview.displayName = "CampaignOverview";
