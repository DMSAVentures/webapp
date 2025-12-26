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
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import { Badge } from "@/proto-design-system/badge/badge";
import { TabMenuHorizontal } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontal";
import { TabMenuHorizontalItem } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontalItem";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
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

export interface EmailBuilderProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSave"> {
	/** Campaign ID this email belongs to */
	campaignId: string;
	/** Initial email type to edit */
	initialType?: "verification" | "welcome";
	/** Additional CSS class name */
	className?: string;
}

/**
 * EmailBuilder provides a block-based interface for editing email templates
 */
export const EmailBuilder = memo<EmailBuilderProps>(function EmailBuilder({
	campaignId,
	initialType = "verification",
	className: customClassName,
	...props
}) {
	// Current email type being edited
	const [emailType, setEmailType] = useState<"verification" | "welcome">(
		initialType,
	);

	// Block-based content state
	const [blocks, setBlocks] = useState<EmailBlock[]>(() =>
		getDefaultBlocks(emailType),
	);
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

	// Design/appearance state
	const [design, setDesign] = useState<EmailDesign>(() => ({
		...DEFAULT_EMAIL_DESIGN,
	}));

	// Right panel mode (block editor vs appearance editor)
	const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>("block");

	// Subject line state
	const [subject, setSubject] = useState(
		emailType === "verification"
			? "Verify your email - You're #{{.position}} on the {{.campaign_name}} waitlist"
			: "Welcome to the {{.campaign_name}} waitlist!",
	);

	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Preview state
	const [previewDevice, setPreviewDevice] = useState<
		"mobile" | "tablet" | "desktop"
	>("desktop");

	// Test email state
	const [testEmailRecipient, setTestEmailRecipient] = useState("");
	const [showTestEmailInput, setShowTestEmailInput] = useState(false);

	// Fetch existing templates
	const {
		templates,
		loading: loadingTemplates,
		refetch,
	} = useGetEmailTemplates(campaignId);
	const existingTemplate = templates.find((t) => t.type === emailType) || null;

	// API hooks
	const { createTemplate, loading: creating } = useCreateEmailTemplate();
	const { updateTemplate, loading: updating } = useUpdateEmailTemplate();
	const {
		sendTestEmail,
		loading: sendingTest,
		success: testSuccess,
		reset: resetTestState,
	} = useSendTestEmail();

	const saving = creating || updating;

	// Get selected block
	const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

	// Handle tab change
	const handleTabChange = useCallback(
		(index: number) => {
			const newType = index === 0 ? "verification" : "welcome";
			setEmailType(newType);
			setSelectedBlockId(null);

			// Load existing template or default
			const existing = templates.find((t) => t.type === newType);

			if (existing) {
				setSubject(existing.subject);
				// Load blocks from stored blocks_json if available
				if (
					existing.blocks_json?.blocks &&
					Array.isArray(existing.blocks_json.blocks)
				) {
					setBlocks(existing.blocks_json.blocks as EmailBlock[]);
				} else {
					// Fall back to defaults if no blocks stored
					setBlocks(getDefaultBlocks(newType));
				}
				// Load design if available
				if (existing.blocks_json?.design) {
					setDesign(existing.blocks_json.design as EmailDesign);
				} else {
					setDesign({ ...DEFAULT_EMAIL_DESIGN });
				}
			} else {
				setSubject(
					newType === "verification"
						? "Verify your email - You're #{{.position}} on the {{.campaign_name}} waitlist"
						: "Welcome to the {{.campaign_name}} waitlist!",
				);
				setBlocks(getDefaultBlocks(newType));
				setDesign({ ...DEFAULT_EMAIL_DESIGN });
			}
			setHasUnsavedChanges(false);
		},
		[templates],
	);

	// Handle save
	const handleSave = useCallback(async () => {
		const templateName =
			emailType === "verification" ? "Verification Email" : "Welcome Email";

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

	// Handle test email
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

	// Block operations
	const handleAddBlock = useCallback((type: EmailBlock["type"]) => {
		const newBlock = createBlock(type);
		setBlocks((prev) => [...prev, newBlock]);
		setSelectedBlockId(newBlock.id);
		setRightPanelMode("block");
		setHasUnsavedChanges(true);
	}, []);

	const handleUpdateBlock = useCallback((updatedBlock: EmailBlock) => {
		setBlocks((prev) =>
			prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
		);
		setHasUnsavedChanges(true);
	}, []);

	const handleDeleteBlock = useCallback(
		(blockId: string) => {
			setBlocks((prev) => prev.filter((b) => b.id !== blockId));
			if (selectedBlockId === blockId) {
				setSelectedBlockId(null);
			}
			setHasUnsavedChanges(true);
		},
		[selectedBlockId],
	);

	const handleMoveBlock = useCallback(
		(blockId: string, direction: "up" | "down") => {
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
			setHasUnsavedChanges(true);
		},
		[],
	);

	// Mark as changed when subject changes
	const handleSubjectChange = useCallback((value: string) => {
		setSubject(value);
		setHasUnsavedChanges(true);
	}, []);

	// Handle design changes
	const handleDesignChange = useCallback((newDesign: EmailDesign) => {
		setDesign(newDesign);
		setHasUnsavedChanges(true);
	}, []);

	// Load existing template on mount
	useEffect(() => {
		if (existingTemplate && !hasUnsavedChanges) {
			setSubject(existingTemplate.subject);
			// Load blocks from stored blocks_json if available
			if (
				existingTemplate.blocks_json?.blocks &&
				Array.isArray(existingTemplate.blocks_json.blocks)
			) {
				setBlocks(existingTemplate.blocks_json.blocks as EmailBlock[]);
			}
			// Load design if available
			if (existingTemplate.blocks_json?.design) {
				setDesign(existingTemplate.blocks_json.design as EmailDesign);
			}
		}
	}, [existingTemplate, hasUnsavedChanges]);

	// Rendered preview
	// Use existing template HTML when no unsaved changes, otherwise use blocks-generated HTML
	const renderedSubject = renderTemplate(subject, SAMPLE_TEMPLATE_DATA);
	const htmlBody =
		existingTemplate && !hasUnsavedChanges
			? existingTemplate.html_body
			: blocksToHtml(blocks, design);
	const renderedBody = renderTemplate(htmlBody, SAMPLE_TEMPLATE_DATA);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<div className={classNames} {...props}>
			{/* Header */}
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h2 className={styles.title}>Email Builder</h2>
					{hasUnsavedChanges && (
						<Badge
							text="Unsaved changes"
							variant="yellow"
							styleType="light"
							size="small"
							iconClass="save-line"
							iconPosition="left"
						/>
					)}
				</div>

				<div className={styles.headerActions}>
					<div className={styles.deviceSelector}>
						<IconOnlyButton
							iconClass="smartphone-line"
							variant={previewDevice === "mobile" ? "primary" : "secondary"}
							ariaLabel="Mobile preview"
							onClick={() => setPreviewDevice("mobile")}
						/>
						<IconOnlyButton
							iconClass="tablet-line"
							variant={previewDevice === "tablet" ? "primary" : "secondary"}
							ariaLabel="Tablet preview"
							onClick={() => setPreviewDevice("tablet")}
						/>
						<IconOnlyButton
							iconClass="computer-line"
							variant={previewDevice === "desktop" ? "primary" : "secondary"}
							ariaLabel="Desktop preview"
							onClick={() => setPreviewDevice("desktop")}
						/>
					</div>

					{/* Test Email */}
					{existingTemplate && (
						<>
							{showTestEmailInput ? (
								<div className={styles.testEmailForm}>
									<TextInput
										id="test-email"
										label=""
										type="email"
										value={testEmailRecipient}
										onChange={(e) => setTestEmailRecipient(e.target.value)}
										placeholder="your@email.com"
										className={styles.testEmailInput}
									/>
									<Button
										variant="secondary"
										size="medium"
										onClick={handleSendTestEmail}
										disabled={sendingTest || !testEmailRecipient}
									>
										{sendingTest ? "Sending..." : "Send"}
									</Button>
									<IconOnlyButton
										iconClass="close-line"
										variant="secondary"
										ariaLabel="Cancel"
										onClick={() => {
											setShowTestEmailInput(false);
											setTestEmailRecipient("");
										}}
									/>
								</div>
							) : (
								<Button
									variant="secondary"
									size="medium"
									leftIcon="send-plane-line"
									onClick={() => setShowTestEmailInput(true)}
								>
									Send Test
								</Button>
							)}
						</>
					)}

					<Button
						variant="primary"
						size="medium"
						leftIcon={saving ? "loader-4-line" : "save-line"}
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
				<TabMenuHorizontal
					items={[
						<TabMenuHorizontalItem
							key="verification"
							active={emailType === "verification"}
							leftIcon="ri-shield-check-line"
							text="Verification Email"
						/>,
						<TabMenuHorizontalItem
							key="welcome"
							active={emailType === "welcome"}
							leftIcon="ri-hand-heart-line"
							text="Welcome Email"
						/>,
					]}
					activeTab={emailType === "verification" ? 0 : 1}
					onTabClick={handleTabChange}
				/>
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
												onSelect={() => {
													setSelectedBlockId(block.id);
													setRightPanelMode("block");
												}}
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
