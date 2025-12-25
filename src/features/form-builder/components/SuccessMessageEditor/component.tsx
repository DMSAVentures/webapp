/**
 * SuccessMessageEditor Component
 * Edit success/thank you message settings (editor panel only)
 */

import { type HTMLAttributes, memo, useCallback } from "react";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";
import { TextArea } from "@/proto-design-system/TextArea/textArea";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
import type { SharingChannel } from "@/types/campaign";
import type { FormBehavior, FormDesign } from "@/types/common.types";
import styles from "./component.module.scss";

/** Channel icon configuration */
const channelIcons: Record<SharingChannel, string> = {
	twitter: "ri-twitter-x-fill",
	facebook: "ri-facebook-fill",
	linkedin: "ri-linkedin-fill",
	whatsapp: "ri-whatsapp-fill",
	email: "ri-mail-fill",
};

export interface SuccessMessageEditorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current behavior settings */
	behavior: FormBehavior;
	/** Current design settings (for reference) */
	design: FormDesign;
	/** Enabled referral channels */
	enabledChannels?: SharingChannel[];
	/** Callback when behavior changes */
	onChange: (behavior: FormBehavior) => void;
	/** Additional CSS class name */
	className?: string;
}

/**
 * SuccessMessageEditor allows editing form success messages
 */
export const SuccessMessageEditor = memo<SuccessMessageEditorProps>(
	function SuccessMessageEditor({
		behavior,
		enabledChannels = [],
		onChange,
		className: customClassName,
		...props
	}) {
		const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

		const handleTitleChange = useCallback(
			(value: string) => {
				onChange({
					...behavior,
					successTitle: value,
				});
			},
			[behavior, onChange],
		);

		const handleMessageChange = useCallback(
			(value: string) => {
				onChange({
					...behavior,
					successMessage: value,
				});
			},
			[behavior, onChange],
		);

		const successTitle = behavior.successTitle || "Thank you for signing up!";
		const successMessage = behavior.successMessage || "We'll be in touch soon.";

		return (
			<div className={classNames} {...props}>
				<div className={styles.header}>
					<h3 className={styles.title}>Success Message</h3>
					<p className={styles.subtitle}>
						Customize what users see after signing up
					</p>
				</div>

				<div className={styles.content}>
					{/* Message Content Section */}
					<section className={styles.section}>
						<h4 className={styles.sectionTitle}>Message Content</h4>
						<div className={styles.inputGroup}>
							<TextInput
								id="success-title"
								label="Title"
								type="text"
								value={successTitle}
								onChange={(e) => handleTitleChange(e.target.value)}
								placeholder="Thank you for signing up!"
							/>
							<TextArea
								id="success-message"
								label="Message"
								value={successMessage}
								onChange={(e) => handleMessageChange(e.target.value)}
								placeholder="We'll be in touch soon."
								rows={3}
							/>
						</div>
					</section>

					{/* Referral Links Section */}
					{enabledChannels.length > 0 && (
						<>
							<ContentDivider size="thin" />
							<section className={styles.section}>
								<h4 className={styles.sectionTitle}>Referral Links</h4>
								<p className={styles.sectionDescription}>
									Share links will appear after signup
								</p>
								<div className={styles.enabledChannels}>
									<span className={styles.enabledChannelsLabel}>
										Enabled channels:
									</span>
									<div className={styles.channelIcons}>
										{enabledChannels.map((channel) => (
											<span
												key={channel}
												className={styles.channelIcon}
												title={channel}
											>
												<i className={channelIcons[channel]} aria-hidden="true" />
											</span>
										))}
									</div>
								</div>
							</section>
						</>
					)}

					{enabledChannels.length === 0 && (
						<>
							<ContentDivider size="thin" />
							<section className={styles.section}>
								<div className={styles.hint}>
									<i className="ri-information-line" aria-hidden="true" />
									<span>
										Enable referrals in campaign settings to show share links
										after signup
									</span>
								</div>
							</section>
						</>
					)}
				</div>
			</div>
		);
	},
);

SuccessMessageEditor.displayName = "SuccessMessageEditor";
