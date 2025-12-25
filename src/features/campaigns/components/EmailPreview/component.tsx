/**
 * EmailPreview Component
 *
 * Renders an email template with sample data to show how it will look.
 * Uses an iframe for proper email isolation and rendering.
 */

import { memo, useMemo } from "react";
import {
	renderTemplate,
	SAMPLE_TEMPLATE_DATA,
} from "@/features/campaigns/constants/defaultEmailTemplates";
import styles from "./component.module.scss";

export interface EmailPreviewProps {
	/** Email subject line (supports template variables) */
	subject: string;
	/** HTML body of the email (supports template variables) */
	htmlBody: string;
	/** Custom sample data to use for variable replacement */
	sampleData?: Record<string, string | number>;
	/** Additional CSS class name */
	className?: string;
}

/**
 * EmailPreview renders an email template with variables replaced by sample data
 */
export const EmailPreview = memo<EmailPreviewProps>(function EmailPreview({
	subject,
	htmlBody,
	sampleData,
	className: customClassName,
}) {
	// Merge default sample data with any custom data
	const data = useMemo(
		() => ({
			...SAMPLE_TEMPLATE_DATA,
			...sampleData,
		}),
		[sampleData],
	);

	// Render subject and body with variable replacement
	const renderedSubject = useMemo(() => renderTemplate(subject, data), [subject, data]);
	const renderedBody = useMemo(() => renderTemplate(htmlBody, data), [htmlBody, data]);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<div className={classNames}>
			{/* Email Header */}
			<div className={styles.header}>
				<div className={styles.headerRow}>
					<span className={styles.headerLabel}>Subject:</span>
					<span className={styles.headerValue}>{renderedSubject}</span>
				</div>
				<div className={styles.headerRow}>
					<span className={styles.headerLabel}>To:</span>
					<span className={styles.headerValue}>{data.email}</span>
				</div>
			</div>

			{/* Email Body Preview */}
			<div className={styles.body}>
				<iframe
					srcDoc={renderedBody}
					title="Email Preview"
					sandbox="allow-same-origin"
					className={styles.iframe}
				/>
			</div>
		</div>
	);
});

EmailPreview.displayName = "EmailPreview";
