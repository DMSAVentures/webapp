import { Plus } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ErrorState } from "@/components/error/error";
import { useGetAllEmailTemplates } from "@/hooks/useEmailTemplates";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { Button, Badge, EmptyState, Spinner } from "@/proto-design-system";
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
			<Spinner
				size="lg"
				label="Loading email templates..."
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
						variant="primary"
						size="sm"
					>
						Verification
					</Badge>
				);
			case "welcome":
				return (
					<Badge
						variant="success"
						size="sm"
					>
						Welcome
					</Badge>
				);
			case "position_update":
				return (
					<Badge
						variant="secondary"
						size="sm"
					>
						Position Update
					</Badge>
				);
			case "reward_earned":
				return (
					<Badge
						variant="warning"
						size="sm"
					>
						Reward Earned
					</Badge>
				);
			case "milestone":
				return (
					<Badge
						variant="primary"
						size="sm"
					>
						Milestone
					</Badge>
				);
			case "custom":
				return (
					<Badge variant="secondary" size="sm">Custom</Badge>
				);
			default:
				return (
					<Badge variant="secondary" size="sm">{type}</Badge>
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
					leftIcon={<Plus size={16} />}
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
						action={<Button variant="primary" onClick={handleCreateTemplate}>Go to Campaigns</Button>}
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
												variant={template.enabled ? "success" : "secondary"}
												size="sm"
											>
												{template.enabled ? "Enabled" : "Disabled"}
											</Badge>
											<span className={styles.campaignName}>
												{getCampaignName(template.campaign_id)}
											</span>
										</div>
									</div>
									<div className={styles.templateActions}>
										<Button
											variant="secondary"
											size="sm"
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
