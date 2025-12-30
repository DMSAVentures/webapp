/**
 * EmailBuilder Component
 * Block-based email template editor with live preview
 */

import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Monitor, Save, Send, Smartphone, Tablet, X } from "lucide-react";
import {
	renderTemplate,
	SAMPLE_TEMPLATE_DATA,
} from "@/features/campaigns/constants/defaultEmailTemplates";
import {
	useCreateEmailTemplate,
	useGetEmailTemplates,
	useSendTestEmail,
	useUpdateEmailTemplate,
} from "@/hooks/useEmailTemplates";
import {
	Badge,
	Button,
	Input,
} from "@/proto-design-system";
import type { EmailBlock, EmailDesign } from "../../types/emailBlocks";
import {
	createBlock,
	DEFAULT_EMAIL_DESIGN,
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
type EmailType = "verification" | "welcome";
type PreviewDevice = "mobile" | "tablet" | "desktop";

export interface EmailBuilderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSave"> {
	/** Campaign ID this email belongs to */
	campaignId: string;
	/** Initial email type to edit */
	initialType?: EmailType;
	/** Additional CSS class name */
	className?: string;
}

// ============================================================================
// Pure Functions
// ============================================================================

/** Gets the default subject line for an email type */
function getDefaultSubject(emailType: EmailType): string {
	return emailType === "verification"
		? "Verify your email - You're #{{.position}} on the {{.campaign_name}} waitlist"
		: "Welcome to the {{.campaign_name}} waitlist!";
}

/** Gets the template name for an email type */
function getTemplateName(emailType: EmailType): string {
	return emailType === "verification" ? "Verification Email" : "Welcome Email";
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for managing email block operations */
function useEmailBlocks(initialType: EmailType) {
	const [blocks, setBlocks] = useState<EmailBlock[]>(() =>
		getDefaultBlocks(initialType),
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

	const setBlocksFromTemplate = useCallback((newBlocks: EmailBlock[]) => {
		setBlocks(newBlocks);
		setSelectedBlockId(null);
	}, []);

	const resetToDefaults = useCallback((emailType: EmailType) => {
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
		setBlocksFromTemplate,
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

	const resetDesign = useCallback(() => {
		setDesign({ ...DEFAULT_EMAIL_DESIGN });
	}, []);

	const setDesignFromTemplate = useCallback((newDesign: EmailDesign) => {
		setDesign(newDesign);
	}, []);

	return {
		design,
		updateDesign,
		resetDesign,
		setDesignFromTemplate,
	};
}

/** Hook for managing test email functionality */
function useTestEmail() {
	const [testEmailRecipient, setTestEmailRecipient] = useState("");
	const [showTestEmailInput, setShowTestEmailInput] = useState(false);

	const openTestEmailInput = useCallback(() => {
		setShowTestEmailInput(true);
	}, []);

	const closeTestEmailInput = useCallback(() => {
		setShowTestEmailInput(false);
		setTestEmailRecipient("");
	}, []);

	return {
		testEmailRecipient,
		setTestEmailRecipient,
		showTestEmailInput,
		openTestEmailInput,
		closeTestEmailInput,
	};
}

// ============================================================================
// Component
// ============================================================================

/**
 * EmailBuilder provides a block-based interface for editing email templates
 */
export const EmailBuilder = memo<EmailBuilderProps>(function EmailBuilder({
	campaignId,
	initialType = "verification",
	className: customClassName,
	...props
}) {
	// State
	const [emailType, setEmailType] = useState<EmailType>(initialType);
	const [subject, setSubject] = useState(() => getDefaultSubject(initialType));
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
	const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("block");

	// Custom hooks
	const {
		blocks,
		selectedBlockId,
		selectedBlock,
		setSelectedBlockId,
		addBlock,
		updateBlock,
		deleteBlock,
		moveBlock,
		setBlocksFromTemplate,
		resetToDefaults,
	} = useEmailBlocks(initialType);

	const { design, updateDesign, resetDesign, setDesignFromTemplate } =
		useEmailDesign();

	const {
		testEmailRecipient,
		setTestEmailRecipient,
		showTestEmailInput,
		openTestEmailInput,
		closeTestEmailInput,
	} = useTestEmail();

	// API hooks
	const {
		templates,
		loading: loadingTemplates,
		refetch,
	} = useGetEmailTemplates(campaignId);
	const existingTemplate = templates.find((t) => t.type === emailType) || null;

	const { createTemplate, loading: creating } = useCreateEmailTemplate();
	const { updateTemplate, loading: updating } = useUpdateEmailTemplate();
	const {
		sendTestEmail,
		loading: sendingTest,
		success: testSuccess,
		reset: resetTestState,
	} = useSendTestEmail();

	const saving = creating || updating;

	// Handlers
	const handleTabChange = useCallback(
		(index: number) => {
			const newType: EmailType = index === 0 ? "verification" : "welcome";
			setEmailType(newType);
			setSelectedBlockId(null);

			const existing = templates.find((t) => t.type === newType);

			if (existing) {
				setSubject(existing.subject);
				if (
					existing.blocks_json?.blocks &&
					Array.isArray(existing.blocks_json.blocks)
				) {
					setBlocksFromTemplate(existing.blocks_json.blocks as EmailBlock[]);
				} else {
					resetToDefaults(newType);
				}
				if (existing.blocks_json?.design) {
					setDesignFromTemplate(existing.blocks_json.design as EmailDesign);
				} else {
					resetDesign();
				}
			} else {
				setSubject(getDefaultSubject(newType));
				resetToDefaults(newType);
				resetDesign();
			}
			setHasUnsavedChanges(false);
		},
		[
			templates,
			setBlocksFromTemplate,
			resetToDefaults,
			setDesignFromTemplate,
			resetDesign,
			setSelectedBlockId,
		],
	);

	const handleSave = useCallback(async () => {
		const templateName = getTemplateName(emailType);
		const htmlBody = blocksToHtml(blocks, design);
		const blocksJson = { blocks, design };

		if (existingTemplate) {
			await updateTemplate(campaignId, existingTemplate.id, {
				subject,
				html_body: htmlBody,
				blocks_json: blocksJson,
			});
		} else {
			await createTemplate(campaignId, {
				name: templateName,
				type: emailType,
				subject,
				html_body: htmlBody,
				blocks_json: blocksJson,
				enabled: true,
				send_automatically: true,
			});
		}

		await refetch();
		setHasUnsavedChanges(false);
	}, [
		campaignId,
		emailType,
		existingTemplate,
		subject,
		blocks,
		design,
		createTemplate,
		updateTemplate,
		refetch,
	]);

	const handleSendTestEmail = useCallback(async () => {
		if (!testEmailRecipient || !existingTemplate) return;
		resetTestState();
		await sendTestEmail(campaignId, existingTemplate.id, testEmailRecipient);
	}, [
		campaignId,
		existingTemplate,
		testEmailRecipient,
		sendTestEmail,
		resetTestState,
	]);

	const handleAddBlock = useCallback(
		(type: EmailBlock["type"]) => {
			addBlock(type);
			setRightPanelMode("block");
			setHasUnsavedChanges(true);
		},
		[addBlock],
	);

	const handleUpdateBlock = useCallback(
		(updatedBlock: EmailBlock) => {
			updateBlock(updatedBlock);
			setHasUnsavedChanges(true);
		},
		[updateBlock],
	);

	const handleDeleteBlock = useCallback(
		(blockId: string) => {
			deleteBlock(blockId);
			setHasUnsavedChanges(true);
		},
		[deleteBlock],
	);

	const handleMoveBlock = useCallback(
		(blockId: string, direction: "up" | "down") => {
			moveBlock(blockId, direction);
			setHasUnsavedChanges(true);
		},
		[moveBlock],
	);

	const handleSubjectChange = useCallback((value: string) => {
		setSubject(value);
		setHasUnsavedChanges(true);
	}, []);

	const handleDesignChange = useCallback(
		(newDesign: EmailDesign) => {
			updateDesign(newDesign);
			setHasUnsavedChanges(true);
		},
		[updateDesign],
	);

	const handleBlockSelect = useCallback(
		(blockId: string) => {
			setSelectedBlockId(blockId);
			setRightPanelMode("block");
		},
		[setSelectedBlockId],
	);

	// Load existing template on mount
	useEffect(() => {
		if (existingTemplate && !hasUnsavedChanges) {
			setSubject(existingTemplate.subject);
			if (
				existingTemplate.blocks_json?.blocks &&
				Array.isArray(existingTemplate.blocks_json.blocks)
			) {
				setBlocksFromTemplate(
					existingTemplate.blocks_json.blocks as EmailBlock[],
				);
			}
			if (existingTemplate.blocks_json?.design) {
				setDesignFromTemplate(
					existingTemplate.blocks_json.design as EmailDesign,
				);
			}
		}
	}, [
		existingTemplate,
		hasUnsavedChanges,
		setBlocksFromTemplate,
		setDesignFromTemplate,
	]);

	// Derived state
	const renderedSubject = renderTemplate(subject, SAMPLE_TEMPLATE_DATA);
	const htmlBody =
		existingTemplate && !hasUnsavedChanges
			? existingTemplate.html_body
			: blocksToHtml(blocks, design);
	const renderedBody = renderTemplate(htmlBody, SAMPLE_TEMPLATE_DATA);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	// Render
	return (
		<div className={classNames} {...props}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h2 className={styles.title}>Email Builder</h2>
					{hasUnsavedChanges && (
						<Badge
							variant="warning"
							size="sm"
						>
							Unsaved changes
						</Badge>
					)}
				</div>

				<div className={styles.headerActions}>
					<div className={styles.deviceSelector}>
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
					</div>

					{/* Test Email */}
					{existingTemplate && (
						<>
							{showTestEmailInput ? (
								<div className={styles.testEmailForm}>
									<Input
										id="test-email"
										type="email"
										value={testEmailRecipient}
										onChange={(e) => setTestEmailRecipient(e.target.value)}
										placeholder="your@email.com"
										className={styles.testEmailInput}
									/>
									<Button
										variant="secondary"
										size="md"
										onClick={handleSendTestEmail}
										disabled={sendingTest || !testEmailRecipient}
									>
										{sendingTest ? "Sending..." : "Send"}
									</Button>
									<Button
										isIconOnly
										leftIcon={<X size={16} />}
										variant="secondary"
										aria-label="Cancel"
										onClick={closeTestEmailInput}
									/>
								</div>
							) : (
								<Button
									variant="secondary"
									size="md"
									leftIcon={<Send size={16} />}
									onClick={openTestEmailInput}
								>
									Send Test
								</Button>
							)}
						</>
					)}

					<Button
						variant="primary"
						size="md"
						leftIcon={<Save size={16} />}
						onClick={handleSave}
						disabled={saving || !hasUnsavedChanges}
					>
						{saving ? "Saving..." : "Save Email"}
					</Button>
				</div>
			</div>

			{/* Success message */}
			{testSuccess && (
				<div className={styles.successBanner}>
					<i className="ri-check-line" aria-hidden="true" />
					<span>Test email sent successfully!</span>
				</div>
			)}

			{/* Tabs */}
			<div className={styles.modeTabs}>
				<div className={styles.tabList} role="tablist">
					<button
						type="button"
						role="tab"
						className={`${styles.tab} ${emailType === "verification" ? styles.tabActive : ""}`}
						aria-selected={emailType === "verification"}
						onClick={() => handleTabChange(0)}
					>
						<i className="ri-shield-check-line" aria-hidden="true" />
						<span>Verification Email</span>
					</button>
					<button
						type="button"
						role="tab"
						className={`${styles.tab} ${emailType === "welcome" ? styles.tabActive : ""}`}
						aria-selected={emailType === "welcome"}
						onClick={() => handleTabChange(1)}
					>
						<i className="ri-hand-heart-line" aria-hidden="true" />
						<span>Welcome Email</span>
					</button>
				</div>
			</div>

			{/* Three-pane layout */}
			<div className={styles.builder}>
				{/* Left panel - Block Palette */}
				<aside className={styles.leftPanel}>
					<BlockPalette onBlockSelect={handleAddBlock} />
				</aside>

				{/* Center panel - Canvas + Preview */}
				<main className={styles.centerPanel}>
					{loadingTemplates ? (
						<div className={styles.loadingState}>
							<i className="ri-loader-4-line" aria-hidden="true" />
							<p>Loading templates...</p>
						</div>
					) : (
						<>
							{/* Subject line editor */}
							<div className={styles.subjectEditor}>
								<VariableTextInput
									value={subject}
									onChange={handleSubjectChange}
									label="Subject Line"
									placeholder="Enter email subject..."
									emailType={emailType}
								/>
							</div>

							{/* Block canvas */}
							<div className={styles.canvasWrapper}>
								<div className={styles.canvasHeader}>
									<i className="ri-layout-4-line" aria-hidden="true" />
									<span>Email Content</span>
									<span className={styles.blockCount}>
										{blocks.length} blocks
									</span>
								</div>
								<div className={styles.canvas}>
									{blocks.length === 0 ? (
										<div className={styles.emptyCanvas}>
											<i className="ri-add-box-line" aria-hidden="true" />
											<p>Add content blocks from the left panel</p>
										</div>
									) : (
										blocks.map((block, index) => (
											<BlockItem
												key={block.id}
												block={block}
												isSelected={block.id === selectedBlockId}
												onSelect={() => handleBlockSelect(block.id)}
												onDelete={() => handleDeleteBlock(block.id)}
												onMoveUp={() => handleMoveBlock(block.id, "up")}
												onMoveDown={() => handleMoveBlock(block.id, "down")}
												canMoveUp={index > 0}
												canMoveDown={index < blocks.length - 1}
											/>
										))
									)}
								</div>
							</div>

							{/* Live Preview */}
							<div className={styles.previewWrapper}>
								<div className={styles.previewHeader}>
									<i className="ri-eye-line" aria-hidden="true" />
									<span>Live Preview</span>
								</div>
								<div
									className={`${styles.emailPreview} ${styles[`device_${previewDevice}`]}`}
								>
									{/* Email header */}
									<div className={styles.emailHeader}>
										<div className={styles.emailHeaderRow}>
											<span className={styles.emailLabel}>Subject:</span>
											<span className={styles.emailValue}>
												{renderedSubject}
											</span>
										</div>
										<div className={styles.emailHeaderRow}>
											<span className={styles.emailLabel}>To:</span>
											<span className={styles.emailValue}>
												{SAMPLE_TEMPLATE_DATA.email}
											</span>
										</div>
									</div>
									{/* Email body */}
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
						</>
					)}
				</main>

				{/* Right panel - Block Editor or Appearance Editor */}
				<aside className={styles.rightPanel}>
					{/* Panel mode toggle */}
					<div className={styles.panelModeToggle}>
						<button
							type="button"
							className={`${styles.panelModeButton} ${rightPanelMode === "block" ? styles.active : ""}`}
							onClick={() => setRightPanelMode("block")}
							aria-pressed={rightPanelMode === "block"}
						>
							<i className="ri-layout-4-line" aria-hidden="true" />
							Content
						</button>
						<button
							type="button"
							className={`${styles.panelModeButton} ${rightPanelMode === "appearance" ? styles.active : ""}`}
							onClick={() => setRightPanelMode("appearance")}
							aria-pressed={rightPanelMode === "appearance"}
						>
							<i className="ri-palette-line" aria-hidden="true" />
							Appearance
						</button>
					</div>

					{/* Panel content */}
					{rightPanelMode === "block" ? (
						selectedBlock ? (
							<BlockEditor
								block={selectedBlock}
								onUpdate={handleUpdateBlock}
								emailType={emailType}
							/>
						) : (
							<div className={styles.noSelection}>
								<i className="ri-cursor-line" aria-hidden="true" />
								<h3>No Block Selected</h3>
								<p>
									Select a content block from the canvas to edit its properties.
								</p>
							</div>
						)
					) : (
						<EmailStyleEditor design={design} onChange={handleDesignChange} />
					)}
				</aside>
			</div>
		</div>
	);
});

EmailBuilder.displayName = "EmailBuilder";
