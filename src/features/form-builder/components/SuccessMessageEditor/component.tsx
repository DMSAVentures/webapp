/**
 * SuccessMessageEditor Component
 * Edit success/thank you message settings (editor panel only)
 */

import { Info } from "lucide-react";
import { type HTMLAttributes, memo, useCallback } from "react";
import { Input } from "@/proto-design-system/components/forms/Input";
import { TextArea } from "@/proto-design-system/components/forms/TextArea";
import { Divider } from "@/proto-design-system/components/layout/Divider";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import type { SharingChannel } from "@/types/campaign";
import type { FormBehavior, FormDesign } from "@/types/common.types";
import styles from "./component.module.scss";

/** Channel icon configuration - using RemixIcon for brand icons */
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
				<Stack gap="xs" className={styles.header}>
					<Text as="h3" size="lg" weight="semibold">
						Success Message
					</Text>
					<Text size="sm" color="muted">
						Customize what users see after signing up
					</Text>
				</Stack>

				<div className={styles.content}>
					{/* Message Content Section */}
					<section className={styles.section}>
						<Text as="h4" size="md" weight="semibold">
							Message Content
						</Text>
						<Stack gap="sm" className={styles.inputGroup}>
							<label htmlFor="success-title">Title</label>
							<Input
								id="success-title"
								type="text"
								value={successTitle}
								onChange={(e) => handleTitleChange(e.target.value)}
								placeholder="Thank you for signing up!"
							/>
							<label htmlFor="success-message">Message</label>
							<TextArea
								id="success-message"
								value={successMessage}
								onChange={(e) => handleMessageChange(e.target.value)}
								placeholder="We'll be in touch soon."
								rows={3}
							/>
						</Stack>
					</section>

					{/* Referral Links Section */}
					{enabledChannels.length > 0 && (
						<>
							<Divider />
							<section className={styles.section}>
								<Text as="h4" size="md" weight="semibold">
									Referral Links
								</Text>
								<Text size="sm" color="muted">
									Share links will appear after signup
								</Text>
								<Stack
									direction="row"
									gap="sm"
									align="center"
									className={styles.enabledChannels}
								>
									<Text size="sm" color="secondary">
										Enabled channels:
									</Text>
									<Stack
										direction="row"
										gap="xs"
										className={styles.channelIcons}
									>
										{enabledChannels.map((channel) => (
											<span
												key={channel}
												className={styles.channelIcon}
												title={channel}
											>
												<i
													className={channelIcons[channel]}
													aria-hidden="true"
												/>
											</span>
										))}
									</Stack>
								</Stack>
							</section>
						</>
					)}

					{enabledChannels.length === 0 && (
						<>
							<Divider />
							<section className={styles.section}>
								<Stack
									direction="row"
									gap="sm"
									align="center"
									className={styles.hint}
								>
									<Icon icon={Info} size="md" color="secondary" />
									<Text size="sm" color="secondary">
										Enable referrals in campaign settings to show share links
										after signup
									</Text>
								</Stack>
							</section>
						</>
					)}
				</div>
			</div>
		);
	},
);

SuccessMessageEditor.displayName = "SuccessMessageEditor";
