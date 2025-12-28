import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ErrorState } from "@/components/error/error";
import { useGetAllEmailTemplates } from "@/hooks/useEmailTemplates";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { Button } from "@/proto-design-system/Button/button";
import { Badge } from "@/proto-design-system/badge/badge";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import type { Campaign } from "@/types/campaign";
import styles from "./email-templates.module.scss";

export const Route = createFileRoute("/email-templates")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { templates, loading, error } = useGetAllEmailTemplates();
	const { data: campaignsData } = useGetCampaigns();

	const handleCreateTemplate = () => {
		// Navigate to campaigns page to select a campaign first
		navigate({ to: "/campaigns" });
	};

	const handleEditTemplate = (campaignId: string) => {
		navigate({ to: `/campaigns/${campaignId}/email-builder` });
	};

	if (loading) {
		return (
			<LoadingSpinner
				size="large"
				mode="centered"
				message="Loading email templates..."
			/>
		);
	}

	if (error) {
		return (
			<ErrorState message={`Failed to load email templates: ${error.error}`} />
		);
	}

	const getCampaignName = (campaignId: string) => {
		const campaign = campaignsData?.campaigns?.find(
			(c: Campaign) => c.id === campaignId,
		);
		return campaign?.name || "Unknown Campaign";
	};

	const getTypeBadge = (type: string) => {
		switch (type) {
			case "verification":
				return (
					<Badge
						variant="blue"
						text="Verification"
						styleType="light"
						size="small"
					/>
				);
			case "welcome":
				return (
					<Badge
						variant="green"
						text="Welcome"
						styleType="light"
						size="small"
					/>
				);
			case "position_update":
				return (
					<Badge
						variant="purple"
						text="Position Update"
						styleType="light"
						size="small"
					/>
				);
			case "reward_earned":
				return (
					<Badge
						variant="yellow"
						text="Reward Earned"
						styleType="light"
						size="small"
					/>
				);
			case "milestone":
				return (
					<Badge
						variant="teal"
						text="Milestone"
						styleType="light"
						size="small"
					/>
				);
			case "custom":
				return (
					<Badge variant="gray" text="Custom" styleType="light" size="small" />
				);
			default:
				return (
					<Badge variant="gray" text={type} styleType="light" size="small" />
				);
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
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>Email Templates</h1>
					<p className={styles.pageDescription}>
						Manage email templates across all your campaigns
					</p>
				</div>
				<Button
					variant="primary"
					leftIcon="ri-add-line"
					onClick={handleCreateTemplate}
				>
					Create Email Template
				</Button>
			</div>

			<div className={styles.pageContent}>
				{!templates || templates.length === 0 ? (
					<EmptyState
						icon="mail-line"
						title="No email templates yet"
						description="Create email templates within your campaigns to send automated emails to your users."
						action={{
							label: "Go to Campaigns",
							onClick: handleCreateTemplate,
						}}
					/>
				) : (
					<div className={styles.templatesList}>
						{templates.map((template) => (
							<div key={template.id} className={styles.templateCard}>
								<div className={styles.templateHeader}>
									<div className={styles.templateInfo}>
										<p className={styles.templateName}>{template.name}</p>
										<p className={styles.templateSubject}>{template.subject}</p>
										<div className={styles.templateMeta}>
											{getTypeBadge(template.type)}
											<Badge
												variant={template.enabled ? "green" : "gray"}
												text={template.enabled ? "Enabled" : "Disabled"}
												styleType="lighter"
												size="small"
											/>
											<span className={styles.campaignName}>
												{getCampaignName(template.campaign_id)}
											</span>
										</div>
									</div>
									<div className={styles.templateActions}>
										<Button
											variant="secondary"
											size="small"
											onClick={() => handleEditTemplate(template.campaign_id)}
										>
											Edit
										</Button>
									</div>
								</div>
								<div className={styles.templateStats}>
									<div className={styles.statItem}>
										<span className={styles.statLabel}>Auto-send:</span>
										<span className={styles.statValue}>
											{template.send_automatically ? "Yes" : "No"}
										</span>
									</div>
									<div className={styles.statItem}>
										<span className={styles.statLabel}>Created:</span>
										<span className={styles.statValue}>
											{new Date(template.created_at).toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
}
