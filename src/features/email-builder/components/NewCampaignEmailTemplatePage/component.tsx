/**
 * NewCampaignEmailTemplatePage Component
 * Page for creating a new email template with campaign selection and naming
 */

import { useNavigate } from "@tanstack/react-router";
import { Eye, Loader2, Monitor, Save, Smartphone, Tablet } from "lucide-react";
import { memo, useCallback, useState } from "react";
import {
	renderTemplate,
	SAMPLE_TEMPLATE_DATA,
} from "@/features/campaigns/constants/defaultEmailTemplates";
import { useCreateCampaignEmailTemplate } from "@/hooks/useCampaignEmailTemplates";
import { useGetCampaigns } from "@/hooks/useGetCampaigns";
import { useBannerCenter } from "@/proto-design-system/components/feedback/BannerCenter";
import { FormField } from "@/proto-design-system/components/forms/FormField";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Dropdown } from "@/proto-design-system/components/overlays/Dropdown";
import {
	Button,
	ButtonGroup,
} from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { Campaign } from "@/types/campaign";
import type { EmailBlock, EmailDesign } from "../../types/emailBlocks";
import {
	createBlock,
	DEFAULT_EMAIL_DESIGN,
	type EmailTemplateType,
	getDefaultBlocks,
} from "../../types/emailBlocks";
import { blocksToHtml } from "../../utils/blocksToHtml";
import { BlockEditor } from "../BlockEditor/component";
import { BlockItem } from "../BlockItem/component";
import { BlockPalette } from "../BlockPalette/component";
import { EmailStyleEditor } from "../EmailStyleEditor/component";
import { VariableTextInput } from "../VariableTextInput/component";
import styles from "./component.module.scss";

type RightPanelMode = "block" | "appearance";
type PreviewDevice = "mobile" | "tablet" | "desktop";

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing email block operations */
function useEmailBlocks() {
	const [blocks, setBlocks] = useState<EmailBlock[]>(() =>
		getDefaultBlocks("verification"),
	);
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

	const addBlock = useCallback((type: EmailBlock["type"]) => {
		const newBlock = createBlock(type);
		setBlocks((prev) => [...prev, newBlock]);
		setSelectedBlockId(newBlock.id);
		return newBlock.id;
	}, []);

	const updateBlock = useCallback((updatedBlock: EmailBlock) => {
		setBlocks((prev) =>
			prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
		);
	}, []);

	const deleteBlock = useCallback(
		(blockId: string) => {
			setBlocks((prev) => prev.filter((b) => b.id !== blockId));
			if (selectedBlockId === blockId) {
				setSelectedBlockId(null);
			}
		},
		[selectedBlockId],
	);

	const moveBlock = useCallback((blockId: string, direction: "up" | "down") => {
		setBlocks((prev) => {
			const index = prev.findIndex((b) => b.id === blockId);
			if (index === -1) return prev;

			const newIndex = direction === "up" ? index - 1 : index + 1;
			if (newIndex < 0 || newIndex >= prev.length) return prev;

			const newBlocks = [...prev];
			[newBlocks[index], newBlocks[newIndex]] = [
				newBlocks[newIndex],
				newBlocks[index],
			];
			return newBlocks;
		});
	}, []);

	const resetToDefaults = useCallback((emailType: EmailTemplateType) => {
		setBlocks(getDefaultBlocks(emailType));
		setSelectedBlockId(null);
	}, []);

	const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

	return {
		blocks,
		selectedBlockId,
		selectedBlock,
		setSelectedBlockId,
		addBlock,
		updateBlock,
		deleteBlock,
		moveBlock,
		resetToDefaults,
	};
}

/** Hook for managing email design state */
function useEmailDesign() {
	const [design, setDesign] = useState<EmailDesign>(() => ({
		...DEFAULT_EMAIL_DESIGN,
	}));

	const updateDesign = useCallback((newDesign: EmailDesign) => {
		setDesign(newDesign);
	}, []);

	return { design, updateDesign };
}

// ============================================================================
// Component
// ============================================================================

/**
 * NewCampaignEmailTemplatePage allows creating a new email template
 */
export const NewCampaignEmailTemplatePage = memo(function NewCampaignEmailTemplatePage() {
	const navigate = useNavigate();
	const { addBanner } = useBannerCenter();

	// Campaign selection state
	const { data: campaignsData, loading: loadingCampaigns } = useGetCampaigns();
	const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

	// Template metadata
	const [templateName, setTemplateName] = useState("");
	const [templateType, setTemplateType] =
		useState<EmailTemplateType>("verification");
	const [subject, setSubject] = useState(
		"Verify your email - You're #{{.position}} on the {{.campaign_name}} waitlist",
	);

	// UI state
	const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
	const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("block");

	// Custom hooks for email content
	const {
		blocks,
		selectedBlockId,
		selectedBlock,
		setSelectedBlockId,
		addBlock,
		updateBlock,
		deleteBlock,
		moveBlock,
		resetToDefaults,
	} = useEmailBlocks();

	const { design, updateDesign } = useEmailDesign();

	// API hooks
	const { createTemplate, loading: saving } = useCreateCampaignEmailTemplate();

	// Campaign dropdown items
	const campaignItems =
		campaignsData?.campaigns?.map((campaign: Campaign) => ({
			id: campaign.id,
			label: campaign.name,
		})) || [];

	// Email type dropdown items
	const emailTypeItems = [
		{ id: "verification", label: "Verification Email" },
		{ id: "welcome", label: "Welcome Email" },
		{ id: "position_update", label: "Position Update" },
		{ id: "reward_earned", label: "Reward Earned" },
		{ id: "milestone", label: "Milestone" },
		{ id: "custom", label: "Custom" },
	];

	// Handlers
	const handleSave = useCallback(async () => {
		if (!selectedCampaignId || !templateName.trim()) return;

		const htmlBody = blocksToHtml(blocks, design);
		const blocksJson = { blocks, design };

		try {
			const result = await createTemplate(selectedCampaignId, {
				name: templateName,
				type: templateType,
				subject,
				htmlBody: htmlBody,
				blocksJson: blocksJson,
				enabled: true,
				sendAutomatically: true,
			});

			if (result) {
				addBanner({
					type: "success",
					title: "Template created",
					description: `"${templateName}" has been saved successfully.`,
					dismissible: true,
				});
				navigate({ to: "/email-templates" });
			} else {
				addBanner({
					type: "error",
					title: "Failed to create template",
					description: "Please try again.",
					dismissible: true,
				});
			}
		} catch {
			addBanner({
				type: "error",
				title: "Failed to create template",
				description: "An unexpected error occurred. Please try again.",
				dismissible: true,
			});
		}
	}, [
		selectedCampaignId,
		templateName,
		templateType,
		subject,
		blocks,
		design,
		createTemplate,
		navigate,
		addBanner,
	]);

	const handleAddBlock = useCallback(
		(type: EmailBlock["type"]) => {
			addBlock(type);
			setRightPanelMode("block");
		},
		[addBlock],
	);

	const handleBlockSelect = useCallback(
		(blockId: string) => {
			setSelectedBlockId(blockId);
			setRightPanelMode("block");
		},
		[setSelectedBlockId],
	);

	const handleTypeChange = useCallback(
		(typeId: string) => {
			const newType = typeId as EmailTemplateType;
			setTemplateType(newType);
			resetToDefaults(newType);

			// Update subject based on type
			const subjectMap: Record<EmailTemplateType, string> = {
				verification:
					"Verify your email - You're #{{.position}} on the {{.campaign_name}} waitlist",
				welcome: "Welcome to the {{.campaign_name}} waitlist!",
				position_update:
					"Your position update - You're now #{{.position}} on {{.campaign_name}}",
				reward_earned:
					"Congratulations! You've earned a reward on {{.campaign_name}}",
				milestone:
					"Milestone reached! {{.campaign_name}} has hit a new milestone",
				custom: "{{.campaign_name}} - Important Update",
			};
			setSubject(subjectMap[newType]);
		},
		[resetToDefaults],
	);

	// Derived state
	const renderedSubject = renderTemplate(subject, SAMPLE_TEMPLATE_DATA);
	const htmlBody = blocksToHtml(blocks, design);
	const renderedBody = renderTemplate(htmlBody, SAMPLE_TEMPLATE_DATA);

	const canSave =
		selectedCampaignId && templateName.trim() && blocks.length > 0;

	// Loading state
	if (loadingCampaigns) {
		return (
			<Stack
				gap="md"
				align="center"
				justify="center"
				className={styles.loading}
			>
				<Spinner size="lg" />
				<Text color="muted">Loading campaigns...</Text>
			</Stack>
		);
	}

	return (
		<Stack gap="lg" className={styles.page} animate>
			{/* Page Header - matches campaign page pattern */}
			<Stack
				direction="row"
				justify="between"
				align="start"
				wrap
				className={styles.pageHeader}
			>
				<Stack gap="xs">
					<Text as="h1" size="2xl" weight="bold">
						Create Email Template
					</Text>
					<Text color="muted">Design and customize your email template</Text>
				</Stack>

				<Stack direction="row" gap="sm" align="center">
					<ButtonGroup isAttached>
						<Button
							isIconOnly
							leftIcon={<Smartphone size={16} />}
							variant={previewDevice === "mobile" ? "primary" : "secondary"}
							aria-label="Mobile preview"
							onClick={() => setPreviewDevice("mobile")}
						/>
						<Button
							isIconOnly
							leftIcon={<Tablet size={16} />}
							variant={previewDevice === "tablet" ? "primary" : "secondary"}
							aria-label="Tablet preview"
							onClick={() => setPreviewDevice("tablet")}
						/>
						<Button
							isIconOnly
							leftIcon={<Monitor size={16} />}
							variant={previewDevice === "desktop" ? "primary" : "secondary"}
							aria-label="Desktop preview"
							onClick={() => setPreviewDevice("desktop")}
						/>
					</ButtonGroup>

					<Button
						variant="primary"
						size="md"
						leftIcon={
							saving ? (
								<Loader2 size={16} className={styles.spin} />
							) : (
								<Save size={16} />
							)
						}
						onClick={handleSave}
						disabled={saving || !canSave}
					>
						{saving ? "Saving..." : "Save Template"}
					</Button>
				</Stack>
			</Stack>

			{/* Template Configuration */}
			<div className={styles.configBar}>
				<Stack direction="row" gap="md" align="end">
					<FormField label="Campaign" className={styles.configField}>
						<Dropdown
							items={campaignItems}
							value={selectedCampaignId}
							placeholder="Select a campaign"
							size="md"
							onChange={setSelectedCampaignId}
						/>
					</FormField>

					<FormField label="Template Name" className={styles.configField}>
						<Input
							id="template-name"
							type="text"
							value={templateName}
							onChange={(e) => setTemplateName(e.target.value)}
							placeholder="e.g., Welcome Series - Day 1"
						/>
					</FormField>

					<FormField label="Email Type" className={styles.configField}>
						<Dropdown
							items={emailTypeItems}
							value={templateType}
							placeholder="Select type"
							size="md"
							onChange={handleTypeChange}
						/>
					</FormField>
				</Stack>
			</div>

			{/* Builder Content */}
			{selectedCampaignId ? (
				<div className={styles.builder}>
					{/* Left panel - Block Palette */}
					<aside className={styles.leftPanel}>
						<BlockPalette onBlockSelect={handleAddBlock} />
					</aside>

					{/* Center panel - Canvas + Preview */}
					<main className={styles.centerPanel}>
						{/* Subject line editor */}
						<div className={styles.subjectEditor}>
							<VariableTextInput
								value={subject}
								onChange={setSubject}
								label="Subject Line"
								placeholder="Enter email subject..."
								emailType={templateType}
							/>
						</div>

						{/* Block canvas */}
						<div className={styles.canvasWrapper}>
							<Stack
								direction="row"
								gap="sm"
								align="center"
								className={styles.canvasHeader}
							>
								<Text size="sm" weight="medium">
									Email Content
								</Text>
								<Text size="xs" color="muted" className={styles.blockCount}>
									{blocks.length} blocks
								</Text>
							</Stack>
							<div className={styles.canvas}>
								{blocks.length === 0 ? (
									<Stack
										gap="md"
										align="center"
										justify="center"
										className={styles.emptyCanvas}
									>
										<Text color="muted">
											Add content blocks from the left panel
										</Text>
									</Stack>
								) : (
									blocks.map((block, index) => (
										<BlockItem
											key={block.id}
											block={block}
											isSelected={block.id === selectedBlockId}
											onSelect={() => handleBlockSelect(block.id)}
											onDelete={() => deleteBlock(block.id)}
											onMoveUp={() => moveBlock(block.id, "up")}
											onMoveDown={() => moveBlock(block.id, "down")}
											canMoveUp={index > 0}
											canMoveDown={index < blocks.length - 1}
										/>
									))
								)}
							</div>
						</div>

						{/* Live Preview */}
						<div className={styles.previewWrapper}>
							<Stack
								direction="row"
								gap="sm"
								align="center"
								className={styles.previewHeader}
							>
								<Icon icon={Eye} size="sm" color="secondary" />
								<Text size="sm" weight="medium">
									Live Preview
								</Text>
							</Stack>
							<div
								className={`${styles.emailPreview} ${styles[`device_${previewDevice}`]}`}
							>
								<div className={styles.emailHeader}>
									<div className={styles.emailHeaderRow}>
										<span className={styles.emailLabel}>Subject:</span>
										<span className={styles.emailValue}>{renderedSubject}</span>
									</div>
									<div className={styles.emailHeaderRow}>
										<span className={styles.emailLabel}>To:</span>
										<span className={styles.emailValue}>
											{SAMPLE_TEMPLATE_DATA.email}
										</span>
									</div>
								</div>
								<div className={styles.emailBody}>
									<iframe
										srcDoc={renderedBody}
										title="Email Preview"
										sandbox="allow-same-origin"
										className={styles.emailIframe}
									/>
								</div>
							</div>
						</div>
					</main>

					{/* Right panel - Block Editor or Appearance Editor */}
					<aside className={styles.rightPanel}>
						<div className={styles.panelModeToggle}>
							<ButtonGroup isAttached isFullWidth>
								<Button
									variant={rightPanelMode === "block" ? "primary" : "secondary"}
									size="sm"
									onClick={() => setRightPanelMode("block")}
								>
									Content
								</Button>
								<Button
									variant={
										rightPanelMode === "appearance" ? "primary" : "secondary"
									}
									size="sm"
									onClick={() => setRightPanelMode("appearance")}
								>
									Appearance
								</Button>
							</ButtonGroup>
						</div>

						{rightPanelMode === "block" ? (
							selectedBlock ? (
								<BlockEditor
									block={selectedBlock}
									onUpdate={updateBlock}
									emailType={templateType}
								/>
							) : (
								<Stack
									gap="md"
									align="center"
									justify="center"
									className={styles.noSelection}
								>
									<Text as="h3" size="md" weight="semibold">
										No Block Selected
									</Text>
									<Text size="sm" color="muted">
										Select a content block from the canvas to edit its
										properties.
									</Text>
								</Stack>
							)
						) : (
							<EmailStyleEditor design={design} onChange={updateDesign} />
						)}
					</aside>
				</div>
			) : (
				<Stack
					gap="lg"
					align="center"
					justify="center"
					className={styles.selectCampaignPrompt}
				>
					<Text size="lg" weight="medium">
						Select a Campaign
					</Text>
					<Text color="muted">
						Choose a campaign above to start building your email template.
					</Text>
				</Stack>
			)}
		</Stack>
	);
});

NewCampaignEmailTemplatePage.displayName = "NewCampaignEmailTemplatePage";
