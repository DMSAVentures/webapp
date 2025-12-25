/**
 * EmailSettingsSection Component
 *
 * Displays email settings for a campaign including:
 * - Toggle to send welcome email (when verification is disabled)
 * - Email template cards for verification and welcome emails
 */

import { useNavigate } from "@tanstack/react-router";
import { memo } from "react";
import { DEFAULT_EMAIL_TEMPLATES } from "@/features/campaigns/constants/defaultEmailTemplates";
import {
	type EmailTemplate,
	useGetEmailTemplates,
} from "@/hooks/useEmailTemplates";
import { Button } from "@/proto-design-system/Button/button";
import CheckboxWithLabel from "@/proto-design-system/checkbox/checkboxWithLabel";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import styles from "./component.module.scss";

export interface EmailSettingsSectionProps {
	/** Campaign ID (required for editing existing campaigns) */
	campaignId?: string;
	/** Whether email verification is required */
	verificationRequired: boolean;
	/** Whether to send welcome email (when verification is disabled) */
	sendWelcomeEmail: boolean;
	/** Handler when sendWelcomeEmail changes */
	onSendWelcomeEmailChange: (value: boolean) => void;
	/** Whether the form is disabled */
	disabled?: boolean;
}

interface TemplateCardProps {
	type: "verification" | "welcome";
	template: EmailTemplate | null;
	campaignId?: string;
	onEdit: () => void;
	disabled?: boolean;
}

const TemplateCard = memo<TemplateCardProps>(function TemplateCard({
	type,
	template,
	onEdit,
	disabled,
}) {
	const typeLabels = {
		verification: "Verification Email",
		welcome: "Welcome Email",
	};

	const typeDescriptions = {
		verification: "Sent when users sign up to verify their email address",
		welcome:
			"Sent after verification or immediately if verification is disabled",
	};

	const defaultTemplate = DEFAULT_EMAIL_TEMPLATES[type];
	const subject = template?.subject || defaultTemplate.subject;
	const isCustom = !!template;

	return (
		<div className={styles.templateCard}>
			<div className={styles.templateCardHeader}>
				<div className={styles.templateCardInfo}>
					<i className="ri-mail-line" aria-hidden="true" />
					<div className={styles.templateCardTitle}>
						<span className={styles.templateCardName}>{typeLabels[type]}</span>
						<StatusBadge
							text={isCustom ? "Custom" : "Default"}
							variant={isCustom ? "completed" : "pending"}
						/>
					</div>
				</div>
			</div>

			<div className={styles.templateCardContent}>
				<p className={styles.templateCardDescription}>
					{typeDescriptions[type]}
				</p>
				<div className={styles.templateCardSubject}>
					<span className={styles.subjectLabel}>Subject:</span>
					<span className={styles.subjectValue}>{subject}</span>
				</div>
			</div>

			<div className={styles.templateCardActions}>
				<Button
					variant="secondary"
					leftIcon="ri-edit-line"
					onClick={onEdit}
					disabled={disabled}
				>
					Customize
				</Button>
			</div>
		</div>
	);
});

/**
 * EmailSettingsSection - Email configuration for campaigns
 */
export const EmailSettingsSection = memo<EmailSettingsSectionProps>(
	function EmailSettingsSection({
		campaignId,
		verificationRequired,
		sendWelcomeEmail,
		onSendWelcomeEmailChange,
		disabled = false,
	}) {
		const navigate = useNavigate();

		// Fetch templates for this campaign
		const { templates } = useGetEmailTemplates(campaignId || "");

		// Find templates by type
		const verificationTemplate =
			templates.find((t) => t.type === "verification") || null;
		const welcomeTemplate = templates.find((t) => t.type === "welcome") || null;

		// Navigate to email builder
		const handleCustomize = () => {
			if (campaignId) {
				navigate({
					to: `/campaigns/$campaignId/email-builder`,
					params: { campaignId },
				});
			}
		};

		// Determine which templates to show based on settings
		const showVerificationTemplate = verificationRequired;
		const showWelcomeTemplate = verificationRequired || sendWelcomeEmail;

		return (
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>Email Settings</h3>
				<p className={styles.sectionDescription}>
					Configure the emails sent to users when they join your waitlist
				</p>

				{/* Send Welcome Email Toggle - only show when verification is disabled */}
				{!verificationRequired && (
					<div className={styles.toggleSection}>
						<CheckboxWithLabel
							checked={sendWelcomeEmail ? "checked" : "unchecked"}
							onChange={(e) => onSendWelcomeEmailChange(e.target.checked)}
							disabled={disabled}
							flipCheckboxToRight={false}
							text="Send welcome email on signup"
							description="Send a welcome email immediately when users sign up (no verification required)"
						/>
					</div>
				)}

				{/* Template Cards */}
				<div className={styles.templateCards}>
					{showVerificationTemplate && (
						<TemplateCard
							type="verification"
							template={verificationTemplate}
							campaignId={campaignId}
							onEdit={handleCustomize}
							disabled={disabled || !campaignId}
						/>
					)}

					{showWelcomeTemplate && (
						<TemplateCard
							type="welcome"
							template={welcomeTemplate}
							campaignId={campaignId}
							onEdit={handleCustomize}
							disabled={disabled || !campaignId}
						/>
					)}

					{!showVerificationTemplate && !showWelcomeTemplate && (
						<div className={styles.noEmailsMessage}>
							<i className="ri-mail-close-line" aria-hidden="true" />
							<p>No automatic emails are configured.</p>
							<p className={styles.noEmailsHint}>
								Enable email verification above or toggle "Send welcome email"
								to configure automatic emails.
							</p>
						</div>
					)}
				</div>

				{/* Note for new campaigns */}
				{!campaignId && (showVerificationTemplate || showWelcomeTemplate) && (
					<p className={styles.saveNote}>
						<i className="ri-information-line" aria-hidden="true" />
						Save the campaign first to customize email templates.
					</p>
				)}
			</div>
		);
	},
);

EmailSettingsSection.displayName = "EmailSettingsSection";
