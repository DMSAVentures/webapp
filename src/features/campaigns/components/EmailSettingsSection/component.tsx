/**
 * EmailSettingsSection Component
 *
 * Displays email settings for a campaign including:
 * - Toggle to send welcome email (when verification is disabled)
 * - Email template cards for verification and welcome emails
 */

import { useNavigate } from "@tanstack/react-router";
import { Info, Mail, MailX, Pencil } from "lucide-react";
import { memo } from "react";
import { DEFAULT_EMAIL_TEMPLATES } from "@/features/campaigns/constants/defaultEmailTemplates";
import {
	type EmailTemplate,
	useGetEmailTemplates,
} from "@/hooks/useEmailTemplates";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Checkbox } from "@/proto-design-system/components/forms/Checkbox";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
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
	/** Whether this feature is locked (Pro feature) */
	locked?: boolean;
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
		<Card variant="outlined" padding="md">
			<Stack gap="sm">
				<Stack direction="row" align="center" gap="sm">
					<div className={styles.iconWrapper}>
						<Icon icon={Mail} size="md" />
					</div>
					<Text size="md" weight="medium">{typeLabels[type]}</Text>
					<Badge variant={isCustom ? "success" : "secondary"} size="sm">
						{isCustom ? "Custom" : "Default"}
					</Badge>
				</Stack>

				<Stack gap="xs" className={styles.templateCardContent}>
					<Text size="sm" color="muted">
						{typeDescriptions[type]}
					</Text>
					<div className={styles.templateCardSubject}>
						<Text as="span" size="xs" weight="medium" color="muted">Subject:</Text>
						<Text as="span" size="sm">{subject}</Text>
					</div>
				</Stack>

				<Stack direction="row" justify="end">
					<Button
						variant="secondary"
						size="sm"
						leftIcon={<Pencil size={16} />}
						onClick={onEdit}
						disabled={disabled}
					>
						Customize
					</Button>
				</Stack>
			</Stack>
		</Card>
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
		locked = false,
	}) {
		const navigate = useNavigate();
		const isDisabled = disabled || locked;

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
			<Stack gap="lg">
				<Stack gap="xs" className={styles.sectionHeader}>
					<Text as="h3" size="lg" weight="semibold">Email Settings</Text>
					<Text size="sm" color="muted">
						Configure the emails sent to users when they join your waitlist
					</Text>
				</Stack>

				{/* Send Welcome Email Toggle - only show when verification is disabled */}
				{!verificationRequired && (
					<Checkbox
						checked={sendWelcomeEmail}
						onChange={(e) => onSendWelcomeEmailChange(e.target.checked)}
						disabled={isDisabled}
						label="Send welcome email on signup"
						description="Send a welcome email immediately when users sign up (no verification required)"
					/>
				)}

				{/* Template Cards */}
				<Stack gap="sm">
					{showVerificationTemplate && (
						<TemplateCard
							type="verification"
							template={verificationTemplate}
							campaignId={campaignId}
							onEdit={handleCustomize}
							disabled={isDisabled || !campaignId}
						/>
					)}

					{showWelcomeTemplate && (
						<TemplateCard
							type="welcome"
							template={welcomeTemplate}
							campaignId={campaignId}
							onEdit={handleCustomize}
							disabled={isDisabled || !campaignId}
						/>
					)}

					{!showVerificationTemplate && !showWelcomeTemplate && (
						<Card variant="filled" padding="lg">
							<Stack gap="xs" align="center">
								<Icon icon={MailX} size="lg" />
								<Text size="sm" color="muted">No automatic emails are configured.</Text>
								<Text size="xs" color="muted">
									Enable email verification above or toggle "Send welcome email"
									to configure automatic emails.
								</Text>
							</Stack>
						</Card>
					)}
				</Stack>

				{/* Note for new campaigns */}
				{!campaignId && (showVerificationTemplate || showWelcomeTemplate) && (
					<div className={styles.saveNote}>
						<Icon icon={Info} size="sm" />
						<Text size="sm">Save the campaign first to customize email templates.</Text>
					</div>
				)}
			</Stack>
		);
	},
);

EmailSettingsSection.displayName = "EmailSettingsSection";
