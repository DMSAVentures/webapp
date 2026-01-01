/**
 * EditBlastEmailTemplatePage Component
 * Page for editing an existing blast email template (account-level)
 */

import { useNavigate } from "@tanstack/react-router";
import { Eye, Loader2, Monitor, Save, Smartphone, Tablet, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import {
	renderTemplate,
	SAMPLE_TEMPLATE_DATA,
} from "@/features/campaigns/constants/defaultEmailTemplates";
import {
	useGetBlastEmailTemplate,
	useUpdateBlastEmailTemplate,
} from "@/hooks/useBlastEmailTemplates";
import { useBannerCenter } from "@/proto-design-system/components/feedback/BannerCenter";
import { FormField } from "@/proto-design-system/components/forms/FormField";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import {
	Button,
	ButtonGroup,
} from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Spinner } from "@/proto-design-system/components/primitives/Spinner";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { EmailBlock, EmailDesign } from "../../types/emailBlocks";
import { createBlock, DEFAULT_EMAIL_DESIGN } from "../../types/emailBlocks";
import { blocksToHtml } from "../../utils/blocksToHtml";
import { BlockEditor } from "../BlockEditor/component";
import { BlockItem } from "../BlockItem/component";
import { BlockPalette } from "../BlockPalette/component";
import { EmailStyleEditor } from "../EmailStyleEditor/component";
import styles from "../NewCampaignEmailTemplatePage/component.module.scss";
import { VariableTextInput } from "../VariableTextInput/component";

type RightPanelMode = "block" | "appearance";
type PreviewDevice = "mobile" | "tablet" | "desktop";

interface EditBlastEmailTemplatePageProps {
	templateId: string;
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing email block operations */
function useEmailBlocks(initialBlocks: EmailBlock[] = []) {
	const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks);
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

	// Update blocks when initial blocks change
	useEffect(() => {
		if (initialBlocks.length > 0) {
			setBlocks(initialBlocks);
		}
	}, [initialBlocks]);

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
	};
}

/** Hook for managing email design state */
function useEmailDesign(initialDesign: EmailDesign = DEFAULT_EMAIL_DESIGN) {
	const [design, setDesign] = useState<EmailDesign>(initialDesign);

	useEffect(() => {
		setDesign(initialDesign);
	}, [initialDesign]);

	const updateDesign = useCallback((newDesign: EmailDesign) => {
		setDesign(newDesign);
	}, []);

	return { design, updateDesign };
}

// ============================================================================
// Component
// ============================================================================

/**
 * EditBlastEmailTemplatePage allows editing an existing blast email template
 * Blast templates are account-level (no campaign association)
 */
export const EditBlastEmailTemplatePage = memo(
	function EditBlastEmailTemplatePage({
		templateId,
	}: EditBlastEmailTemplatePageProps) {
		const navigate = useNavigate();
		const { addBanner } = useBannerCenter();

		// Fetch template data
		const {
			template,
			loading: loadingTemplate,
			error: templateError,
		} = useGetBlastEmailTemplate(templateId);

		// Template metadata
		const [templateName, setTemplateName] = useState("");
		const [subject, setSubject] = useState("");
		const [isInitialized, setIsInitialized] = useState(false);

		// UI state
		const [previewDevice, setPreviewDevice] =
			useState<PreviewDevice>("desktop");
		const [rightPanelMode, setRightPanelMode] =
			useState<RightPanelMode>("block");

		// Parse initial blocks from template
		const initialBlocks = (template?.blocksJson?.blocks as EmailBlock[]) || [];
		const initialDesign =
			(template?.blocksJson?.design as EmailDesign) || DEFAULT_EMAIL_DESIGN;

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
		} = useEmailBlocks(initialBlocks);

		const { design, updateDesign } = useEmailDesign(initialDesign);

		// API hooks
		const { updateTemplate, loading: saving } = useUpdateBlastEmailTemplate();

		// Initialize form when template loads
		useEffect(() => {
			if (template && !isInitialized) {
				setTemplateName(template.name);
				setSubject(template.subject);
				setIsInitialized(true);
			}
		}, [template, isInitialized]);

		// Handlers
		const handleSave = useCallback(async () => {
			if (!template || !templateName.trim()) return;

			const htmlBody = blocksToHtml(blocks, design);
			const blocksJson = { blocks, design };

			try {
				const result = await updateTemplate(templateId, {
					name: templateName,
					subject,
					htmlBody,
					blocksJson,
				});

				if (result) {
					addBanner({
						type: "success",
						title: "Template saved",
						description: `"${templateName}" has been updated successfully.`,
						dismissible: true,
					});
					navigate({ to: "/email-templates", search: { type: "blast" } });
				} else {
					addBanner({
						type: "error",
						title: "Failed to save template",
						description: "Please try again.",
						dismissible: true,
					});
				}
			} catch {
				addBanner({
					type: "error",
					title: "Failed to save template",
					description: "An unexpected error occurred. Please try again.",
					dismissible: true,
				});
			}
		}, [
			template,
			templateId,
			templateName,
			subject,
			blocks,
			design,
			updateTemplate,
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

		// Derived state
		const renderedSubject = renderTemplate(subject, SAMPLE_TEMPLATE_DATA);
		const htmlBody = blocksToHtml(blocks, design);
		const renderedBody = renderTemplate(htmlBody, SAMPLE_TEMPLATE_DATA);

		const canSave = templateName.trim() && blocks.length > 0;

		// Loading state
		if (loadingTemplate) {
			return (
				<Stack
					gap="md"
					align="center"
					justify="center"
					className={styles.loading}
				>
					<Spinner size="lg" />
					<Text color="muted">Loading template...</Text>
				</Stack>
			);
		}

		// Error state
		if (templateError) {
			return (
				<Stack
					gap="md"
					align="center"
					justify="center"
					className={styles.loading}
				>
					<Text color="muted">
						Failed to load template: {templateError.error}
					</Text>
					<Button
						variant="secondary"
						onClick={() =>
							navigate({ to: "/email-templates", search: { type: "blast" } })
						}
					>
						Back to Templates
					</Button>
				</Stack>
			);
		}

		if (!template) {
			return (
				<Stack
					gap="md"
					align="center"
					justify="center"
					className={styles.loading}
				>
					<Text color="muted">Template not found</Text>
					<Button
						variant="secondary"
						onClick={() =>
							navigate({ to: "/email-templates", search: { type: "blast" } })
						}
					>
						Back to Templates
					</Button>
				</Stack>
			);
		}

		return (
			<Stack gap="lg" className={styles.page} animate>
				{/* Page Header */}
				<Stack
					direction="row"
					justify="between"
					align="start"
					wrap
					className={styles.pageHeader}
				>
					<Stack gap="xs">
						<Text as="h1" size="2xl" weight="bold">
							Edit Blast Email Template
						</Text>
						<Text color="muted">Account-level template for email blasts</Text>
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
							variant="ghost"
							size="md"
							leftIcon={<X size={16} />}
							onClick={() => navigate({ to: "/email-templates" })}
							disabled={saving}
						>
							Cancel
						</Button>

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
							{saving ? "Saving..." : "Save Changes"}
						</Button>
					</Stack>
				</Stack>

				{/* Template Configuration */}
				<div className={styles.configBar}>
					<Stack direction="row" gap="md" align="end">
						<FormField label="Template Name" className={styles.configField}>
							<Input
								id="template-name"
								type="text"
								value={templateName}
								onChange={(e) => setTemplateName(e.target.value)}
								placeholder="e.g., Product Update Announcement"
							/>
						</FormField>
					</Stack>
				</div>

				{/* Builder Content */}
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
								emailType="custom"
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
									emailType="custom"
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
			</Stack>
		);
	},
);

EditBlastEmailTemplatePage.displayName = "EditBlastEmailTemplatePage";
