import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ErrorState } from "@/components/error/error";
import { CampaignFormPreview } from "@/features/campaigns/components/CampaignFormPreview/component";
import { CampaignStats } from "@/features/campaigns/components/CampaignStats/component";
import { useCampaignHelpers } from "@/hooks/useCampaignStatus";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { useUpdateCampaignStatus } from "@/hooks/useUpdateCampaignStatus";
import { Button } from "@/proto-design-system/Button/button";
import { Badge } from "@/proto-design-system/badge/badge";
import Banner from "@/proto-design-system/banner/banner";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const navigate = useNavigate();
	const { getStatusVariant, getTypeLabel } = useCampaignHelpers();
	const {
		data: campaign,
		loading,
		error,
		refetch,
	} = useGetCampaign(campaignId);
	const {
		updateStatus,
		loading: updating,
		error: updateError,
	} = useUpdateCampaignStatus();
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleEdit = () => {
		navigate({ to: `/campaigns/$campaignId/edit`, params: { campaignId } });
	};

	const handleGoLive = async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			setSuccessMessage("Campaign is now live!");
			refetch();
			setTimeout(() => setSuccessMessage(null), 3000);
		}
	};

	const handlePause = async () => {
		const updated = await updateStatus(campaignId, { status: "paused" });
		if (updated) {
			setSuccessMessage("Campaign has been paused");
			refetch();
			setTimeout(() => setSuccessMessage(null), 3000);
		}
	};

	const handleResume = async () => {
		const updated = await updateStatus(campaignId, { status: "active" });
		if (updated) {
			setSuccessMessage("Campaign has been resumed");
			refetch();
			setTimeout(() => setSuccessMessage(null), 3000);
		}
	};

	const handleEnd = async () => {
		const updated = await updateStatus(campaignId, { status: "completed" });
		if (updated) {
			setSuccessMessage("Campaign has been ended");
			refetch();
			setTimeout(() => setSuccessMessage(null), 3000);
		}
	};

	if (loading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading campaign..."
			/>
		);
	}

	if (error) {
		return <ErrorState message={`Failed to load campaign: ${error.error}`} />;
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
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
	const hasFormFields =
		campaign.formFields && campaign.formFields.length > 0;
	const canGoLive = campaign.status === "draft" && hasFormFields;

	const handleConfigureForm = () => {
		navigate({
			to: `/campaigns/$campaignId/form-builder`,
			params: { campaignId },
		});
	};

	const handleViewEmbed = () => {
		navigate({ to: `/campaigns/$campaignId/embed`, params: { campaignId } });
	};

	const handleStatCardClick = (
		cardType: "totalSignups" | "verified" | "referrals" | "kFactor",
	) => {
		// K-Factor card leads to analytics, others lead to users
		if (cardType === "kFactor") {
			navigate({ to: "/analytics" });
		} else {
			navigate({ to: `/campaigns/$campaignId/users`, params: { campaignId } });
		}
	};

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerActions}>
					<Breadcrumb
						items={[
							<BreadcrumbItem key="campaigns" state="default" path="/campaigns">
								Campaigns
							</BreadcrumbItem>,
							<BreadcrumbItem key="current" state="active">
								{campaign.name}
							</BreadcrumbItem>,
						]}
						divider="arrow"
					/>
				</div>
				<div className={styles.headerTop}>
					<div className={styles.headerContent}>
						<h1 className={styles.pageTitle}>{campaign.name}</h1>
						{campaign.description && (
							<p className={styles.pageDescription}>{campaign.description}</p>
						)}
						<div className={styles.badges}>
							<Badge
								text={campaign.status}
								variant={getStatusVariant(campaign.status)}
								styleType="light"
								size="medium"
							/>
							<Badge
								text={getTypeLabel(campaign.type)}
								variant="purple"
								styleType="light"
								size="medium"
							/>
						</div>
					</div>
					<div className={styles.actions}>
						{campaign.status === "draft" && (
							<>
								<Button
									variant={hasFormFields ? "secondary" : "primary"}
									leftIcon="ri-edit-box-line"
									onClick={handleConfigureForm}
								>
									Configure Form
								</Button>
								{hasFormFields && (
									<Button
										variant="secondary"
										leftIcon="ri-code-s-slash-line"
										onClick={handleViewEmbed}
									>
										View Embed
									</Button>
								)}
								<Button
									variant={hasFormFields ? "primary" : "secondary"}
									leftIcon={
										updating ? "ri-loader-4-line ri-spin" : "ri-rocket-line"
									}
									onClick={handleGoLive}
									disabled={updating || !canGoLive}
								>
									{updating ? "Launching..." : "Go Live"}
								</Button>
							</>
						)}
						{campaign.status === "active" && (
							<>
								{hasFormFields && (
									<Button
										variant="secondary"
										leftIcon="ri-code-s-slash-line"
										onClick={handleViewEmbed}
									>
										View Embed
									</Button>
								)}
								<Button
									variant="secondary"
									leftIcon={
										updating ? "ri-loader-4-line ri-spin" : "ri-pause-line"
									}
									onClick={handlePause}
									disabled={updating}
								>
									{updating ? "Pausing..." : "Pause"}
								</Button>
								<Button
									variant="secondary"
									leftIcon={
										updating
											? "ri-loader-4-line ri-spin"
											: "ri-stop-circle-line"
									}
									onClick={handleEnd}
									disabled={updating}
								>
									{updating ? "Ending..." : "End Campaign"}
								</Button>
							</>
						)}
						{campaign.status === "paused" && (
							<>
								{hasFormFields && (
									<Button
										variant="secondary"
										leftIcon="ri-code-s-slash-line"
										onClick={handleViewEmbed}
									>
										View Embed
									</Button>
								)}
								<Button
									variant="primary"
									leftIcon={
										updating ? "ri-loader-4-line ri-spin" : "ri-play-line"
									}
									onClick={handleResume}
									disabled={updating}
								>
									{updating ? "Resuming..." : "Resume"}
								</Button>
								<Button
									variant="secondary"
									leftIcon={
										updating
											? "ri-loader-4-line ri-spin"
											: "ri-stop-circle-line"
									}
									onClick={handleEnd}
									disabled={updating}
								>
									{updating ? "Ending..." : "End Campaign"}
								</Button>
							</>
						)}
						{campaign.status !== "completed" && (
							<Button
								variant="secondary"
								leftIcon="ri-edit-line"
								onClick={handleEdit}
							>
								Edit Campaign
							</Button>
						)}
					</div>
				</div>
			</div>

			<div className={styles.pageContent}>
				{campaign.status === "draft" && !hasFormFields && (
					<Banner
						bannerType="warning"
						variant="filled"
						alertTitle="Form not configured"
						alertDescription="You need to configure your waitlist form before launching this campaign. Click 'Configure Form' to get started."
						dismissible={false}
					/>
				)}

				{successMessage && (
					<Banner
						bannerType="success"
						variant="filled"
						alertTitle={successMessage}
						alertDescription=""
					/>
				)}

				{updateError && (
					<Banner
						bannerType="error"
						variant="filled"
						alertTitle="Failed to update campaign status"
						alertDescription={updateError.error}
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
														{campaign.referralSettings.sharingChannels.join(
															", ",
														)}
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
												<strong className={styles.detailLabel}>
													From Name:
												</strong>
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
												<strong className={styles.detailLabel}>
													Reply To:
												</strong>
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
		</motion.div>
	);
}
