/**
 * EmailTemplateEditor Component
 *
 * A modal for editing email templates with live preview and test email functionality.
 */

import { Mail, Send, X } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { EmailPreview } from "@/features/campaigns/components/EmailPreview/component";
import {
	DEFAULT_EMAIL_TEMPLATES,
	TEMPLATE_VARIABLES,
} from "@/features/campaigns/constants/defaultEmailTemplates";
import {
	type CampaignEmailTemplate,
	useCreateCampaignEmailTemplate,
	useSendCampaignTestEmail,
	useUpdateCampaignEmailTemplate,
} from "@/hooks/useCampaignEmailTemplates";
import { Input } from "@/proto-design-system/components/forms/Input";
import { TextArea } from "@/proto-design-system/components/forms/TextArea";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import styles from "./component.module.scss";

export interface EmailTemplateEditorProps {
	/** Campaign ID */
	campaignId: string;
	/** Template type being edited */
	type: "verification" | "welcome";
	/** Existing template (null for new) */
	template: CampaignEmailTemplate | null;
	/** Handler when editor closes */
	onClose: () => void;
	/** Handler when template is saved */
	onSave: (template: CampaignEmailTemplate) => void;
}

/**
 * EmailTemplateEditor - Full-screen modal for editing email templates
 */
export const EmailTemplateEditor = memo<EmailTemplateEditorProps>(
	function EmailTemplateEditor({
		campaignId,
		type,
		template,
		onClose,
		onSave,
	}) {
		const dialogRef = useRef<HTMLDialogElement>(null);

		// Get default template based on type
		const defaultTemplate = DEFAULT_EMAIL_TEMPLATES[type];

		// Form state
		const [subject, setSubject] = useState(
			template?.subject || defaultTemplate.subject,
		);
		const [htmlBody, setHtmlBody] = useState(
			template?.htmlBody || defaultTemplate.htmlBody,
		);

		// Test email state
		const [testEmailRecipient, setTestEmailRecipient] = useState("");
		const [showTestEmailInput, setShowTestEmailInput] = useState(false);

		// Hooks
		const {
			createTemplate,
			loading: creating,
			error: createError,
		} = useCreateCampaignEmailTemplate();
		const {
			updateTemplate,
			loading: updating,
			error: updateError,
		} = useUpdateCampaignEmailTemplate();
		const {
			sendTestEmail,
			loading: sendingTest,
			error: testError,
			success: testSuccess,
			reset: resetTestState,
		} = useSendCampaignTestEmail();

		const loading = creating || updating;
		const error = createError || updateError;

		// Open dialog on mount
		useEffect(() => {
			if (dialogRef.current) {
				dialogRef.current.showModal();
			}
		}, []);

		// Handle close
		const handleClose = useCallback(() => {
			if (dialogRef.current) {
				dialogRef.current.close();
			}
			onClose();
		}, [onClose]);

		// Handle save
		const handleSave = useCallback(async () => {
			const templateName =
				type === "verification" ? "Verification Email" : "Welcome Email";

			if (template) {
				// Update existing
				const updated = await updateTemplate(campaignId, template.id, {
					subject,
					htmlBody: htmlBody,
				});
				if (updated) {
					onSave(updated);
					handleClose();
				}
			} else {
				// Create new
				const created = await createTemplate(campaignId, {
					name: templateName,
					type,
					subject,
					htmlBody: htmlBody,
					enabled: true,
					sendAutomatically: true,
				});
				if (created) {
					onSave(created);
					handleClose();
				}
			}
		}, [
			template,
			campaignId,
			type,
			subject,
			htmlBody,
			createTemplate,
			updateTemplate,
			onSave,
			handleClose,
		]);

		// Handle test email
		const handleSendTestEmail = useCallback(async () => {
			if (!testEmailRecipient || !template) return;

			resetTestState();
			await sendTestEmail(campaignId, template.id, testEmailRecipient);
		}, [
			campaignId,
			template,
			testEmailRecipient,
			sendTestEmail,
			resetTestState,
		]);

		// Insert variable at cursor
		const insertVariable = useCallback(
			(variable: string) => {
				const textarea = document.getElementById(
					"email-html-body",
				) as HTMLTextAreaElement;
				if (textarea) {
					const start = textarea.selectionStart;
					const end = textarea.selectionEnd;
					const text = htmlBody;
					const newText =
						text.substring(0, start) + `{{${variable}}}` + text.substring(end);
					setHtmlBody(newText);
				} else {
					setHtmlBody((prev: string) => prev + `{{${variable}}}`);
				}
			},
			[htmlBody],
		);

		const typeLabels = {
			verification: "Verification Email",
			welcome: "Welcome Email",
		};

		return (
			<dialog ref={dialogRef} className={styles.dialog} onClose={handleClose}>
				<div className={styles.container}>
					{/* Header */}
					<div className={styles.header}>
						<div className={styles.headerTitle}>
							<Icon icon={Mail} size="md" />
							<span>Customize {typeLabels[type]}</span>
						</div>
						<Button
							aria-label="Close editor"
							variant="secondary"
							leftIcon={<X size={16} />}
							onClick={handleClose}
						/>
					</div>

					{/* Content */}
					<div className={styles.content}>
						{/* Editor Pane */}
						<div className={styles.editorPane}>
							<div className={styles.editorContent}>
								{/* Subject */}
								<Input
									id="email-subject"
									type="text"
									value={subject}
									onChange={(e) => setSubject(e.target.value)}
									placeholder="Enter email subject..."
								/>

								{/* Variables */}
								<div className={styles.variablesSection}>
									<label className={styles.variablesLabel}>
										Insert Variable
									</label>
									<div className={styles.variablesList}>
										{TEMPLATE_VARIABLES.filter(
											(v) =>
												type === "verification" ||
												v.name !== "verification_link",
										).map((variable) => (
											<button
												key={variable.name}
												type="button"
												className={styles.variableButton}
												onClick={() => insertVariable(variable.name)}
												title={variable.description}
											>
												{`{{${variable.name}}}`}
											</button>
										))}
									</div>
								</div>

								{/* HTML Body */}
								<TextArea
									id="email-html-body"
									label="Email Body (HTML)"
									value={htmlBody}
									onChange={(e) => setHtmlBody(e.target.value)}
									placeholder="Enter HTML email content..."
									rows={15}
								/>
							</div>
						</div>

						{/* Preview Pane */}
						<div className={styles.previewPane}>
							<div className={styles.previewHeader}>
								<span className={styles.previewTitle}>Live Preview</span>
							</div>
							<div className={styles.previewContent}>
								<EmailPreview subject={subject} htmlBody={htmlBody} />
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className={styles.footer}>
						<div className={styles.footerLeft}>
							{/* Test Email */}
							{template && (
								<div className={styles.testEmailSection}>
									{showTestEmailInput ? (
										<div className={styles.testEmailForm}>
											<Input
												id="test-email-recipient"
												type="email"
												value={testEmailRecipient}
												onChange={(e) => setTestEmailRecipient(e.target.value)}
												placeholder="Enter email address..."
												className={styles.testEmailInput}
											/>
											<Button
												variant="secondary"
												onClick={handleSendTestEmail}
												disabled={sendingTest || !testEmailRecipient}
											>
												{sendingTest ? "Sending..." : "Send"}
											</Button>
											<Button
												aria-label="Cancel test email"
												variant="secondary"
												leftIcon={<X size={16} />}
												onClick={() => {
													setShowTestEmailInput(false);
													setTestEmailRecipient("");
													resetTestState();
												}}
											/>
										</div>
									) : (
										<Button
											variant="secondary"
											leftIcon={<Send size={16} />}
											onClick={() => setShowTestEmailInput(true)}
										>
											Send Test Email
										</Button>
									)}
									{testSuccess && (
										<span className={styles.testSuccess}>Test email sent!</span>
									)}
									{testError && (
										<span className={styles.testError}>{testError.error}</span>
									)}
								</div>
							)}
						</div>

						<div className={styles.footerRight}>
							{error && (
								<span className={styles.errorMessage}>{error.error}</span>
							)}
							<Button
								variant="secondary"
								onClick={handleClose}
								disabled={loading}
							>
								Cancel
							</Button>
							<Button variant="primary" onClick={handleSave} disabled={loading}>
								{loading ? "Saving..." : "Save Template"}
							</Button>
						</div>
					</div>
				</div>
			</dialog>
		);
	},
);

EmailTemplateEditor.displayName = "EmailTemplateEditor";
