/**
 * SuccessScreenPreview Component
 * Live preview of the success screen with device frame
 */

import { Check, CheckCircle, Copy, Share2 } from "lucide-react";
import { type HTMLAttributes, memo, useCallback, useState } from "react";
import { Icon, Stack, Text } from "@/proto-design-system";
import type { SharingChannel } from "@/types/campaign";
import type { FormBehavior, FormDesign } from "@/types/common.types";
import { useFormStyles } from "../../hooks/useFormStyles";
import { DevicePreview, type DeviceType } from "../DevicePreview/component";
import styles from "./component.module.scss";

export interface SuccessScreenPreviewProps
	extends HTMLAttributes<HTMLDivElement> {
	/** Form design settings */
	design: FormDesign;
	/** Form behavior settings (contains success messages) */
	behavior: FormBehavior;
	/** Device type for responsive preview */
	device?: DeviceType;
	/** Whether to show referral links */
	showReferralLinks?: boolean;
	/** Enabled sharing channels */
	enabledChannels?: SharingChannel[];
	/** Referral links per channel (from API response) */
	referralLinks?: Partial<Record<SharingChannel, string>>;
	/** Additional CSS class name */
	className?: string;
}

/** Channel display configuration */
const channelConfigs: Record<SharingChannel, { label: string; icon: string }> =
	{
		twitter: { label: "Twitter", icon: "ri-twitter-x-fill" },
		facebook: { label: "Facebook", icon: "ri-facebook-fill" },
		linkedin: { label: "LinkedIn", icon: "ri-linkedin-fill" },
		whatsapp: { label: "WhatsApp", icon: "ri-whatsapp-fill" },
		email: { label: "Email", icon: "ri-mail-fill" },
	};

/**
 * SuccessScreenPreview renders a live preview of the success screen
 */
export const SuccessScreenPreview = memo<SuccessScreenPreviewProps>(
	function SuccessScreenPreview({
		design,
		behavior,
		device = "desktop",
		showReferralLinks = false,
		enabledChannels = [],
		referralLinks,
		className: customClassName,
		...props
	}) {
		const formStyles = useFormStyles(design);
		const [copiedChannel, setCopiedChannel] = useState<SharingChannel | null>(
			null,
		);

		// Use provided links or fall back to mock links for preview
		const links = referralLinks;

		const handleCopyLink = useCallback(
			async (channel: SharingChannel) => {
				const link = links![channel]!;
				try {
					await navigator.clipboard.writeText(link);
					setCopiedChannel(channel);
					setTimeout(() => setCopiedChannel(null), 2000);
				} catch (err) {
					console.error("Failed to copy:", err);
				}
			},
			[links],
		);

		const handleNativeShare = useCallback(async () => {
			// Use email channel link for native share
			const shareLink = links?.email;
			if (navigator.share && shareLink) {
				try {
					await navigator.share({
						title: "Join me!",
						text: "Sign up using my referral link",
						url: shareLink,
					});
				} catch (err) {
					// User cancelled or share failed
					console.log("Share cancelled or failed:", err);
				}
			}
		}, [links]);

		const successTitle = behavior.successTitle || "Thank you for signing up!";
		const successMessage = behavior.successMessage || "We'll be in touch soon.";

		const channelsToShow = showReferralLinks ? enabledChannels : [];

		return (
			<DevicePreview device={device} className={customClassName} {...props}>
				<Stack gap="md" align="center" className={styles.successScreen} style={formStyles}>
					<div className={styles.successIcon}>
						<Icon icon={CheckCircle} size="2xl" color="success" />
					</div>
					<Text as="h2" size="xl" weight="semibold" className={styles.successTitle}>{successTitle}</Text>
					<Text color="muted" className={styles.successMessage}>{successMessage}</Text>

					{/* Referral Links Section */}
					{channelsToShow.length > 0 && (
						<Stack gap="md" className={styles.referralSection}>
							<Text size="sm" color="secondary" className={styles.referralText}>
								Share your unique link & move up!
							</Text>

							{/* Native Share Button */}
							<button
								type="button"
								className={styles.nativeShareButton}
								onClick={handleNativeShare}
							>
								<Icon icon={Share2} size="sm" />
								<span>Share</span>
							</button>

							<div className={styles.dividerWithText}>
								<Text size="xs" color="muted">or copy link for</Text>
							</div>

							<Stack gap="xs" className={styles.channelList}>
								{channelsToShow.map((channel) => {
									const config = channelConfigs[channel];
									const isCopied = copiedChannel === channel;
									return (
										<button
											key={channel}
											type="button"
											className={`${styles.channelRow} ${isCopied ? styles.channelRowCopied : ""}`}
											onClick={() => handleCopyLink(channel)}
										>
											<div className={styles.channelIcon}>
												<i className={config.icon} aria-hidden="true" />
											</div>
											<Text size="sm" className={styles.channelName}>{config.label}</Text>
											<Stack direction="row" gap="xs" align="center" className={styles.copyLabel}>
												{isCopied ? (
													<>
														<Icon icon={Check} size="sm" />
														<Text size="xs">Copied!</Text>
													</>
												) : (
													<>
														<Icon icon={Copy} size="sm" />
														<Text size="xs">Copy link</Text>
													</>
												)}
											</Stack>
										</button>
									);
								})}
							</Stack>
						</Stack>
					)}
				</Stack>
			</DevicePreview>
		);
	},
);

SuccessScreenPreview.displayName = "SuccessScreenPreview";
