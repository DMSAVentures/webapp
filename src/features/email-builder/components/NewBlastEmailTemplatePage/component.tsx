/**
 * NewBlastEmailTemplatePage Component
 * Page for creating a new blast email template (account-level, not campaign-specific)
 */

import { useNavigate } from "@tanstack/react-router";
import { Eye, Loader2, Monitor, Save, Smartphone, Tablet } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { renderTemplate } from "@/features/campaigns/constants/defaultEmailTemplates";
import { useCreateBlastEmailTemplate } from "@/hooks/useBlastEmailTemplates";
import { useBannerCenter } from "@/proto-design-system/components/feedback/BannerCenter";
import { FormField } from "@/proto-design-system/components/forms/FormField";
import { Input } from "@/proto-design-system/components/forms/Input";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import {
	Button,
	ButtonGroup,
} from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { EmailBlock, EmailDesign } from "../../types/emailBlocks";
import { createBlock, DEFAULT_EMAIL_DESIGN } from "../../types/emailBlocks";
import { blocksToHtml } from "../../utils/blocksToHtml";
import { BlockEditor } from "../BlockEditor/component";
import { BlockItem } from "../BlockItem/component";
import { BlockPalette } from "../BlockPalette/component";
import { EmailStyleEditor } from "../EmailStyleEditor/component";
import styles from "../NewEmailTemplatePage/component.module.scss";
import { VariableTextInput } from "../VariableTextInput/component";

type RightPanelMode = "block" | "appearance";
type PreviewDevice = "mobile" | "tablet" | "desktop";

// ============================================================================
// Blast Email Sample Data (simpler variables)
// ============================================================================

/** Sample data for blast email template preview */
const BLAST_SAMPLE_DATA: Record<string, string | number> = {
	first_name: "John",
	email: "john@example.com",
	unsubscribe_link: "https://example.com/unsubscribe?token=xyz123",
};

// ============================================================================
// Custom Hooks
// ============================================================================

/** Default blocks for blast email templates */
function getDefaultBlastBlocks(): EmailBlock[] {
	return [
		{
			id: "block-1",
			type: "heading",
			content: "Your Heading Here",
			level: 1,
			align: "left",
			color: "#1a1a1a",
		},
		{
			id: "block-2",
			type: "paragraph",
			content:
				"Hi {{.first_name}},\n\nAdd your message here. This is a blast email template that you can use for announcements, newsletters, and other communications.",
			align: "left",
			color: "#4a4a4a",
			fontSize: "medium",
		},
		{
			id: "block-3",
			type: "spacer",
			height: "medium",
		},
		{
			id: "block-4",
			type: "button",
			text: "Learn More",
			url: "https://example.com",
			align: "center",
			backgroundColor: "#2563EB",
			textColor: "#ffffff",
			fullWidth: false,
		},
	];
}

/** Hook for managing blast email block operations */
function useBlastEmailBlocks() {
	const [blocks, setBlocks] = useState<EmailBlock[]>(() =>
		getDefaultBlastBlocks(),
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
 * NewBlastEmailTemplatePage allows creating a new blast email template
 * These are account-level templates not tied to any specific campaign
 */
export const NewBlastEmailTemplatePage = memo(
	function NewBlastEmailTemplatePage() {
		const navigate = useNavigate();
		const { addBanner } = useBannerCenter();

		// Template metadata
		const [templateName, setTemplateName] = useState("");
		const [subject, setSubject] = useState(
			"{{.first_name}}, we have something for you",
		);

		// UI state
		const [previewDevice, setPreviewDevice] =
			useState<PreviewDevice>("desktop");
		const [rightPanelMode, setRightPanelMode] =
			useState<RightPanelMode>("block");

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
		} = useBlastEmailBlocks();

		const { design, updateDesign } = useEmailDesign();

		// API hooks
		const { createTemplate, loading: saving } = useCreateBlastEmailTemplate();

		// Handlers
		const handleSave = useCallback(async () => {
			if (!templateName.trim()) return;

			const htmlBody = blocksToHtml(blocks, design);
			const blocksJson = { blocks, design };

			try {
				const result = await createTemplate({
					name: templateName,
					subject,
					htmlBody,
					blocksJson,
				});

				if (result) {
					addBanner({
						type: "success",
						title: "Template created",
						description: `"${templateName}" has been saved successfully.`,
						dismissible: true,
					});
					navigate({ to: "/email-templates", search: { type: "blast" } });
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
			templateName,
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

		// Derived state - use blast-specific sample data
		const renderedSubject = renderTemplate(subject, BLAST_SAMPLE_DATA);
		const htmlBody = blocksToHtml(blocks, design);
		const renderedBody = renderTemplate(htmlBody, BLAST_SAMPLE_DATA);

		const canSave = templateName.trim() && blocks.length > 0;

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
							Create Blast Email Template
						</Text>
						<Text color="muted">
							Design a reusable template for email blasts and announcements
						</Text>
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

				{/* Template Configuration - simplified for blast templates */}
				<div className={styles.configBar}>
					<Stack direction="row" gap="md" align="end">
						<FormField label="Template Name" className={styles.configField}>
							<Input
								id="template-name"
								type="text"
								value={templateName}
								onChange={(e) => setTemplateName(e.target.value)}
								placeholder="e.g., Product Announcement, Newsletter"
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
											{BLAST_SAMPLE_DATA.email}
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

NewBlastEmailTemplatePage.displayName = "NewBlastEmailTemplatePage";
