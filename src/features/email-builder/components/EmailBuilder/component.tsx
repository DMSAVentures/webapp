/**
 * EmailBuilder Component
 * Three-pane email template editor with live preview
 */

import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import { Badge } from "@/proto-design-system/badge/badge";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import { TabMenuHorizontal } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontal";
import { TabMenuHorizontalItem } from "@/proto-design-system/TabMenu/Horizontal/tabMenuHorizontalItem";
import {
	DEFAULT_EMAIL_TEMPLATES,
	TEMPLATE_VARIABLES,
	SAMPLE_TEMPLATE_DATA,
	renderTemplate,
} from "@/features/campaigns/constants/defaultEmailTemplates";
import {
	useGetEmailTemplates,
	useCreateEmailTemplate,
	useUpdateEmailTemplate,
	useSendTestEmail,
} from "@/hooks/useEmailTemplates";
import styles from "./component.module.scss";

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
 * EmailBuilder provides a three-pane interface for editing email templates
 */
export const EmailBuilder = memo<EmailBuilderProps>(function EmailBuilder({
	campaignId,
	initialType = "verification",
	className: customClassName,
	...props
}) {
	// Current email type being edited
	const [emailType, setEmailType] = useState<"verification" | "welcome">(initialType);

	// Form state
	const defaultTemplate = DEFAULT_EMAIL_TEMPLATES[emailType];
	const [subject, setSubject] = useState(defaultTemplate.subject);
	const [htmlBody, setHtmlBody] = useState(defaultTemplate.htmlBody);
	const [textBody, setTextBody] = useState(defaultTemplate.textBody);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Preview state
	const [previewDevice, setPreviewDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");

	// Test email state
	const [testEmailRecipient, setTestEmailRecipient] = useState("");
	const [showTestEmailInput, setShowTestEmailInput] = useState(false);

	// Fetch existing templates
	const { templates, refetch } = useGetEmailTemplates(campaignId);
	const existingTemplate = templates.find((t) => t.type === emailType) || null;

	// API hooks
	const { createTemplate, loading: creating } = useCreateEmailTemplate();
	const { updateTemplate, loading: updating } = useUpdateEmailTemplate();
	const { sendTestEmail, loading: sendingTest, success: testSuccess, reset: resetTestState } = useSendTestEmail();

	const saving = creating || updating;

	// Handle tab change
	const handleTabChange = useCallback((index: number) => {
		const newType = index === 0 ? "verification" : "welcome";
		setEmailType(newType);

		// Load existing template or default
		const existing = templates.find((t) => t.type === newType);
		const defaultTpl = DEFAULT_EMAIL_TEMPLATES[newType];

		setSubject(existing?.subject || defaultTpl.subject);
		setHtmlBody(existing?.html_body || defaultTpl.htmlBody);
		setTextBody(existing?.text_body || defaultTpl.textBody);
		setHasUnsavedChanges(false);
	}, [templates]);

	// Handle save
	const handleSave = useCallback(async () => {
		const templateName = emailType === "verification" ? "Verification Email" : "Welcome Email";

		if (existingTemplate) {
			await updateTemplate(campaignId, existingTemplate.id, {
				subject,
				html_body: htmlBody,
				text_body: textBody,
			});
		} else {
			await createTemplate(campaignId, {
				name: templateName,
				type: emailType,
				subject,
				html_body: htmlBody,
				text_body: textBody,
				enabled: true,
				send_automatically: true,
			});
		}

		await refetch();
		setHasUnsavedChanges(false);
	}, [campaignId, emailType, existingTemplate, subject, htmlBody, textBody, createTemplate, updateTemplate, refetch]);

	// Handle test email
	const handleSendTestEmail = useCallback(async () => {
		if (!testEmailRecipient || !existingTemplate) return;
		resetTestState();
		await sendTestEmail(campaignId, existingTemplate.id, testEmailRecipient);
	}, [campaignId, existingTemplate, testEmailRecipient, sendTestEmail, resetTestState]);

	// Insert variable
	const insertVariable = useCallback((variable: string) => {
		setHtmlBody((prev) => prev + `{{${variable}}}`);
		setHasUnsavedChanges(true);
	}, []);

	// Rendered preview
	const renderedSubject = renderTemplate(subject, SAMPLE_TEMPLATE_DATA);
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
				{/* Left panel - Variables */}
				<aside className={styles.leftPanel}>
					<div className={styles.variablesPanel}>
						<div className={styles.variablesPanelHeader}>
							<i className="ri-braces-line" aria-hidden="true" />
							<h3>Template Variables</h3>
						</div>
						<div className={styles.variablesPanelContent}>
							<p>Click a variable to insert it into your email template.</p>
							<div className={styles.variablesList}>
								{TEMPLATE_VARIABLES.filter(
									(v) => emailType === "verification" || v.name !== "verification_link",
								).map((variable) => (
									<button
										key={variable.name}
										type="button"
										className={styles.variableButton}
										onClick={() => insertVariable(variable.name)}
									>
										<span className={styles.variableName}>{`{{${variable.name}}}`}</span>
										<span className={styles.variableDesc}>{variable.description}</span>
									</button>
								))}
							</div>
						</div>
					</div>
				</aside>

				{/* Center panel - Live Preview */}
				<main className={styles.centerPanel}>
					<div className={styles.previewWrapper}>
						<div className={`${styles.emailPreview} ${styles[`device_${previewDevice}`]}`}>
							{/* Email header */}
							<div className={styles.emailHeader}>
								<div className={styles.emailHeaderRow}>
									<span className={styles.emailLabel}>Subject:</span>
									<span className={styles.emailValue}>{renderedSubject}</span>
								</div>
								<div className={styles.emailHeaderRow}>
									<span className={styles.emailLabel}>To:</span>
									<span className={styles.emailValue}>{SAMPLE_TEMPLATE_DATA.email}</span>
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
				</main>

				{/* Right panel - Editor */}
				<aside className={styles.rightPanel}>
					<div className={styles.editorPanel}>
						<div className={styles.editorPanelHeader}>
							<i className="ri-edit-line" aria-hidden="true" />
							<h3>Edit Email</h3>
						</div>
						<div className={styles.editorPanelContent}>
							<TextInput
								id="email-subject"
								label="Subject Line"
								type="text"
								value={subject}
								onChange={(e) => {
									setSubject(e.target.value);
									setHasUnsavedChanges(true);
								}}
								placeholder="Enter subject..."
								hint="Use {{variable}} for dynamic content"
							/>

							<TextArea
								id="email-html-body"
								label="Email Body (HTML)"
								value={htmlBody}
								onChange={(e) => {
									setHtmlBody(e.target.value);
									setHasUnsavedChanges(true);
								}}
								placeholder="Enter HTML content..."
								rows={20}
							/>

							<TextArea
								id="email-text-body"
								label="Plain Text (optional)"
								value={textBody}
								onChange={(e) => {
									setTextBody(e.target.value);
									setHasUnsavedChanges(true);
								}}
								placeholder="Plain text for non-HTML clients..."
								rows={6}
							/>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
});

EmailBuilder.displayName = "EmailBuilder";
