import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useGetCampaign } from "@/hooks/useGetCampaign";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import { ErrorState } from "@/components/error/error";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { Button } from "@/proto-design-system/Button/button";
import { Badge } from "@/proto-design-system/badge/badge";
import Breadcrumb from "@/proto-design-system/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import { CampaignStats } from "@/features/campaigns/components/CampaignStats/component";
import type { CampaignStats as CampaignStatsType } from "@/types/common.types";
import styles from "./campaignDetail.module.scss";

export const Route = createFileRoute("/campaigns/$campaignId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaignId } = Route.useParams();
	const navigate = useNavigate();
	const { data: campaign, loading, error } = useGetCampaign(campaignId);

	const handleEdit = () => {
		navigate({ to: `/campaigns/$campaignId/edit`, params: { campaignId } });
	}

	const getStatusVariant = (status: string) => {
		switch (status) {
			case 'active':
				return 'green';
			case 'paused':
				return 'orange';
			case 'completed':
				return 'blue';
			case 'draft':
			default:
				return 'gray';
		}
	}

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'waitlist':
				return 'Waitlist';
			case 'referral':
				return 'Referral';
			case 'contest':
				return 'Contest';
			default:
				return type
		}
	}

	if (loading) {
		return <LoadingSpinner size="large" mode="centered" message="Loading campaign..." />;
	}

	if (error) {
		return <ErrorState message={`Failed to load campaign: ${error.error}`} />;
	}

	if (!campaign) {
		return <EmptyState title="Campaign not found" icon="megaphone-line" />;
	}

	// Build stats object for CampaignStats component
	const stats: CampaignStatsType = {
		totalSignups: campaign.total_signups,
		verifiedSignups: campaign.total_verified,
		totalReferrals: campaign.total_referrals,
		conversionRate: campaign.total_signups > 0
			? (campaign.total_verified / campaign.total_signups) * 100
			: 0,
		viralCoefficient: campaign.total_signups > 0
			? campaign.total_referrals / campaign.total_signups
			: 0,
	}

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
						divider='arrow'
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
								styleType='light'
								size='medium'
							/>
							<Badge
								text={getTypeLabel(campaign.type)}
								variant='purple'
								styleType='light'
								size='medium'
							/>
						</div>
					</div>
					<Button
						variant="secondary"
						leftIcon="ri-edit-line"
						onClick={handleEdit}
					>
						Edit Campaign
					</Button>
				</div>
			</div>

			<div className={styles.pageContent}>
				<CampaignStats stats={stats} />

				<div className={styles.detailsCard}>
					<h3 className={styles.detailsTitle}>Configuration</h3>

					{campaign.referral_config && (
						<>
							<div className={styles.detailsSection}>
								<h4 className={styles.sectionTitle}>Referral Settings</h4>
								<div className={styles.detailsList}>
									<div className={styles.detailItem}>
										<strong className={styles.detailLabel}>Enabled:</strong>
										<span className={styles.detailValue}>{campaign.referral_config.enabled ? 'Yes' : 'No'}</span>
									</div>
									{campaign.referral_config.points_per_referral && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Points per Referral:</strong>
											<span className={styles.detailValue}>{campaign.referral_config.points_per_referral}</span>
										</div>
									)}
									<div className={styles.detailItem}>
										<strong className={styles.detailLabel}>Verified Only:</strong>
										<span className={styles.detailValue}>{campaign.referral_config.verified_only ? 'Yes' : 'No'}</span>
									</div>
									{campaign.referral_config.sharing_channels && campaign.referral_config.sharing_channels.length > 0 && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Sharing Channels:</strong>
											<span className={styles.detailValue}>{campaign.referral_config.sharing_channels.join(', ')}</span>
										</div>
									)}
								</div>
							</div>
							<ContentDivider size="thin" />
						</>
					)}

					{campaign.email_config && (
						<>
							<div className={styles.detailsSection}>
								<h4 className={styles.sectionTitle}>Email Settings</h4>
								<div className={styles.detailsList}>
									<div className={styles.detailItem}>
										<strong className={styles.detailLabel}>Verification Required:</strong>
										<span className={styles.detailValue}>{campaign.email_config.verification_required ? 'Yes' : 'No'}</span>
									</div>
									{campaign.email_config.from_name && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>From Name:</strong>
											<span className={styles.detailValue}>{campaign.email_config.from_name}</span>
										</div>
									)}
									{campaign.email_config.from_email && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>From Email:</strong>
											<span className={styles.detailValue}>{campaign.email_config.from_email}</span>
										</div>
									)}
									{campaign.email_config.reply_to && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Reply To:</strong>
											<span className={styles.detailValue}>{campaign.email_config.reply_to}</span>
										</div>
									)}
								</div>
							</div>
							<ContentDivider size="thin" />
						</>
					)}

					{campaign.branding_config && (
						<>
							<div className={styles.detailsSection}>
								<h4 className={styles.sectionTitle}>Branding Settings</h4>
								<div className={styles.detailsList}>
									{campaign.branding_config.logo_url && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Logo URL:</strong>
											<span className={styles.detailValue}>{campaign.branding_config.logo_url}</span>
										</div>
									)}
									{campaign.branding_config.primary_color && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Primary Color:</strong>
											<span className={styles.detailValue}>
												<span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: campaign.branding_config.primary_color, border: '1px solid var(--color-border-primary-default)', borderRadius: '4px', marginRight: '8px', verticalAlign: 'middle' }}></span>
												{campaign.branding_config.primary_color}
											</span>
										</div>
									)}
									{campaign.branding_config.font_family && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Font Family:</strong>
											<span className={styles.detailValue}>{campaign.branding_config.font_family}</span>
										</div>
									)}
									{campaign.branding_config.custom_domain && (
										<div className={styles.detailItem}>
											<strong className={styles.detailLabel}>Custom Domain:</strong>
											<span className={styles.detailValue}>{campaign.branding_config.custom_domain}</span>
										</div>
									)}
								</div>
							</div>
							<ContentDivider size="thin" />
						</>
					)}

					<div className={styles.detailsSection}>
						<h4 className={styles.sectionTitle}>Metadata</h4>
						<div className={styles.detailsList}>
							<div className={styles.detailItem}>
								<strong className={styles.detailLabel}>Campaign ID:</strong>
								<span className={styles.detailValueMono}>{campaign.id}</span>
							</div>
							<div className={styles.detailItem}>
								<strong className={styles.detailLabel}>Slug:</strong>
								<span className={styles.detailValueMono}>{campaign.slug}</span>
							</div>
							<div className={styles.detailItem}>
								<strong className={styles.detailLabel}>Account ID:</strong>
								<span className={styles.detailValueMono}>{campaign.account_id}</span>
							</div>
							<div className={styles.detailItem}>
								<strong className={styles.detailLabel}>Created:</strong>
								<span className={styles.detailValue}>{new Date(campaign.created_at).toLocaleString()}</span>
							</div>
							<div className={styles.detailItem}>
								<strong className={styles.detailLabel}>Last Updated:</strong>
								<span className={styles.detailValue}>{new Date(campaign.updated_at).toLocaleString()}</span>
							</div>
							{campaign.launch_date && (
								<div className={styles.detailItem}>
									<strong className={styles.detailLabel}>Launch Date:</strong>
									<span className={styles.detailValue}>{new Date(campaign.launch_date).toLocaleString()}</span>
								</div>
							)}
							{campaign.end_date && (
								<div className={styles.detailItem}>
									<strong className={styles.detailLabel}>End Date:</strong>
									<span className={styles.detailValue}>{new Date(campaign.end_date).toLocaleString()}</span>
								</div>
							)}
							{campaign.max_signups && (
								<div className={styles.detailItem}>
									<strong className={styles.detailLabel}>Max Signups:</strong>
									<span className={styles.detailValue}>{campaign.max_signups.toLocaleString()}</span>
								</div>
							)}
							{campaign.privacy_policy_url && (
								<div className={styles.detailItem}>
									<strong className={styles.detailLabel}>Privacy Policy:</strong>
									<a href={campaign.privacy_policy_url} target="_blank" rel="noopener noreferrer" className={styles.detailValue}>
										{campaign.privacy_policy_url}
									</a>
								</div>
							)}
							{campaign.terms_url && (
								<div className={styles.detailItem}>
									<strong className={styles.detailLabel}>Terms URL:</strong>
									<a href={campaign.terms_url} target="_blank" rel="noopener noreferrer" className={styles.detailValue}>
										{campaign.terms_url}
									</a>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}
