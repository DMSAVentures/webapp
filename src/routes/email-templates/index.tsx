import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Plus } from "lucide-react";
import { useState } from "react";
import { ErrorState } from "@/components/error/error";
import { GatedEmptyState } from "@/components/gating";
import { useGetBlastEmailTemplates } from "@/hooks/useBlastEmailTemplates";
import { useGetAllCampaignEmailTemplates } from "@/hooks/useCampaignEmailTemplates";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { EmptyState } from "@/proto-design-system/components/data/EmptyState";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { ButtonGroup } from "@/proto-design-system/components/primitives/Button/ButtonGroup";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { BlastEmailTemplate } from "@/types/blastEmailTemplate";
import type { Campaign } from "@/types/campaign";
import type { CampaignEmailTemplate } from "@/types/campaignEmailTemplate";
import styles from "../email-templates.module.scss";

export const Route = createFileRoute("/email-templates/")({
	component: RouteComponent,
});

type TemplateFilter = "all" | "campaign" | "blast";

interface UnifiedTemplate {
	id: string;
	name: string;
	subject: string;
	createdAt: Date;
	templateType: "campaign" | "blast";
	// Campaign-specific fields
	campaignId?: string;
	type?: string;
	enabled?: boolean;
	sendAutomatically?: boolean;
}

function RouteComponent() {
	const navigate = useNavigate();
	const [filter, setFilter] = useState<TemplateFilter>("all");
	const { hasAccess } = useFeatureAccess("visual_email_builder");

	const {
		templates: campaignTemplates,
		loading: campaignLoading,
		error: campaignError,
	} = useGetAllCampaignEmailTemplates();

	const {
		templates: blastTemplates,
		loading: blastLoading,
		error: blastError,
	} = useGetBlastEmailTemplates();

	const { data: campaignsData } = useGetCampaigns();

	const loading = campaignLoading || blastLoading;
	const error = campaignError || blastError;

	const handleCreateTemplate = () => {
		navigate({ to: "/email-templates/new" });
	};

	// Show gated empty state for users without access
	if (!hasAccess) {
		return (
			<Stack gap="lg" className={styles.page} animate>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Email Templates
					</Text>
					<Text color="muted">Manage campaign and blast email templates</Text>
				</Stack>
				<GatedEmptyState
					feature="visual_email_builder"
					icon={<Mail />}
					title="Email Templates"
					description="Create and manage email templates for your campaigns and blasts."
					bannerDescription="Upgrade to Pro to create and manage email templates."
				/>
			</Stack>
		);
	}

	const handleEditTemplate = (
		templateId: string,
		templateType: "campaign" | "blast",
	) => {
		navigate({
			to: `/email-templates/${templateId}`,
			search: { type: templateType },
		});
	};

	if (loading) {
		return <Spinner size="lg" label="Loading email templates..." />;
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

	const getCampaignTypeBadge = (type: string) => {
		switch (type) {
			case "verification":
				return (
					<Badge variant="primary" size="sm">
						Verification
					</Badge>
				);
			case "welcome":
				return (
					<Badge variant="success" size="sm">
						Welcome
					</Badge>
				);
			case "position_update":
				return (
					<Badge variant="secondary" size="sm">
						Position Update
					</Badge>
				);
			case "reward_earned":
				return (
					<Badge variant="warning" size="sm">
						Reward Earned
					</Badge>
				);
			case "milestone":
				return (
					<Badge variant="primary" size="sm">
						Milestone
					</Badge>
				);
			case "custom":
				return (
					<Badge variant="secondary" size="sm">
						Custom
					</Badge>
				);
			default:
				return (
					<Badge variant="secondary" size="sm">
						{type}
					</Badge>
				);
		}
	};

	// Convert campaign templates to unified format
	const unifiedCampaignTemplates: UnifiedTemplate[] = (
		campaignTemplates || []
	).map((template: CampaignEmailTemplate) => ({
		id: template.id,
		name: template.name,
		subject: template.subject,
		createdAt: template.createdAt,
		templateType: "campaign" as const,
		campaignId: template.campaignId,
		type: template.type,
		enabled: template.enabled,
		sendAutomatically: template.sendAutomatically,
	}));

	// Convert blast templates to unified format
	const unifiedBlastTemplates: UnifiedTemplate[] = (blastTemplates || []).map(
		(template: BlastEmailTemplate) => ({
			id: template.id,
			name: template.name,
			subject: template.subject,
			createdAt: template.createdAt,
			templateType: "blast" as const,
		}),
	);

	// Combine and filter templates
	const allTemplates = [...unifiedCampaignTemplates, ...unifiedBlastTemplates];
	const filteredTemplates = allTemplates.filter((template) => {
		if (filter === "all") return true;
		return template.templateType === filter;
	});

	// Sort by created date (newest first)
	filteredTemplates.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);

	const renderCampaignTemplate = (template: UnifiedTemplate) => (
		<div key={template.id} className={styles.templateCard}>
			<div className={styles.templateHeader}>
				<div className={styles.templateInfo}>
					<p className={styles.templateName}>{template.name}</p>
					<p className={styles.templateSubject}>{template.subject}</p>
					<div className={styles.templateMeta}>
						<Badge variant="primary" size="sm">
							Campaign
						</Badge>
						{template.type && getCampaignTypeBadge(template.type)}
						<Badge
							variant={template.enabled ? "success" : "secondary"}
							size="sm"
						>
							{template.enabled ? "Enabled" : "Disabled"}
						</Badge>
						{template.campaignId && (
							<span className={styles.campaignName}>
								{getCampaignName(template.campaignId)}
							</span>
						)}
					</div>
				</div>
				<div className={styles.templateActions}>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => handleEditTemplate(template.id, "campaign")}
					>
						Edit
					</Button>
				</div>
			</div>
			<div className={styles.templateStats}>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Auto-send:</span>
					<span className={styles.statValue}>
						{template.sendAutomatically ? "Yes" : "No"}
					</span>
				</div>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Created:</span>
					<span className={styles.statValue}>
						{new Date(template.createdAt).toLocaleDateString()}
					</span>
				</div>
			</div>
		</div>
	);

	const renderBlastTemplate = (template: UnifiedTemplate) => (
		<div key={template.id} className={styles.templateCard}>
			<div className={styles.templateHeader}>
				<div className={styles.templateInfo}>
					<p className={styles.templateName}>{template.name}</p>
					<p className={styles.templateSubject}>{template.subject}</p>
					<div className={styles.templateMeta}>
						<Badge variant="warning" size="sm">
							Blast
						</Badge>
					</div>
				</div>
				<div className={styles.templateActions}>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => handleEditTemplate(template.id, "blast")}
					>
						Edit
					</Button>
				</div>
			</div>
			<div className={styles.templateStats}>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Created:</span>
					<span className={styles.statValue}>
						{new Date(template.createdAt).toLocaleDateString()}
					</span>
				</div>
			</div>
		</div>
	);

	const renderTemplate = (template: UnifiedTemplate) => {
		if (template.templateType === "campaign") {
			return renderCampaignTemplate(template);
		}
		return renderBlastTemplate(template);
	};

	return (
		<Stack gap="lg" className={styles.page} animate>
			<Stack direction="row" justify="between" align="start" wrap>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Email Templates
					</Text>
					<Text color="muted">Manage campaign and blast email templates</Text>
				</Stack>
				<Button
					variant="primary"
					leftIcon={<Plus size={16} />}
					onClick={handleCreateTemplate}
				>
					Create Email Template
				</Button>
			</Stack>

			<div className={styles.filterBar}>
				<ButtonGroup isAttached>
					<Button
						variant={filter === "all" ? "primary" : "secondary"}
						size="sm"
						onClick={() => setFilter("all")}
					>
						All
					</Button>
					<Button
						variant={filter === "campaign" ? "primary" : "secondary"}
						size="sm"
						onClick={() => setFilter("campaign")}
					>
						Campaign
					</Button>
					<Button
						variant={filter === "blast" ? "primary" : "secondary"}
						size="sm"
						onClick={() => setFilter("blast")}
					>
						Blast
					</Button>
				</ButtonGroup>
			</div>

			<div className={styles.pageContent}>
				{filteredTemplates.length === 0 ? (
					<EmptyState
						icon={<Mail />}
						title="No email templates yet"
						description={
							filter === "all"
								? "Create email templates within your campaigns or for email blasts."
								: filter === "campaign"
									? "No campaign email templates found. Create one within a campaign."
									: "No blast email templates found. Create one to send email blasts."
						}
						action={
							<Button variant="primary" onClick={handleCreateTemplate}>
								Create Email Template
							</Button>
						}
					/>
				) : (
					<div className={styles.templatesList}>
						{filteredTemplates.map(renderTemplate)}
					</div>
				)}
			</div>
		</Stack>
	);
}
