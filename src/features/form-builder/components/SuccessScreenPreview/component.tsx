/**
 * SuccessScreenPreview Component
 * Live preview of the success screen with device frame (matches FormPreview style)
 */

import { type HTMLAttributes, memo, useCallback, useState } from "react";
import type { SharingChannel } from "@/types/campaign";
import type { FormBehavior, FormDesign } from "@/types/common.types";
import { useFormStyles } from "../../hooks/useFormStyles";
import styles from "./component.module.scss";

export interface SuccessScreenPreviewProps
	extends HTMLAttributes<HTMLDivElement> {
	/** Form design settings */
	design: FormDesign;
	/** Form behavior settings (contains success messages) */
	behavior: FormBehavior;
	/** Device type for responsive preview */
	device?: "mobile" | "tablet" | "desktop";
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

		const classNames = [
			styles.root,
			styles[`device_${device}`],
			customClassName,
		]
			.filter(Boolean)
			.join(" ");

		const successTitle = behavior.successTitle || "Thank you for signing up!";
		const successMessage = behavior.successMessage || "We'll be in touch soon.";

		const channelsToShow = showReferralLinks ? enabledChannels : [];

		return (
			<div className={classNames} {...props}>
				<div className={styles.deviceFrame}>
					<div className={styles.deviceHeader}>
						<div className={styles.deviceControls}>
							<span className={styles.deviceDot} />
							<span className={styles.deviceDot} />
							<span className={styles.deviceDot} />
						</div>
						<span className={styles.deviceTitle}>{device} Preview</span>
					</div>

					<div className={styles.previewContent}>
						<div className={styles.successScreen} style={formStyles}>
							<div className={styles.successIcon}>
								<i className="ri-check-circle-line" aria-hidden="true" />
							</div>
							<h2 className={styles.successTitle}>{successTitle}</h2>
							<p className={styles.successMessage}>{successMessage}</p>

							{/* Referral Links Section */}
							{channelsToShow.length > 0 && (
								<div className={styles.referralSection}>
									<p className={styles.referralText}>
										Share your unique link & move up!
									</p>

									{/* Native Share Button */}
									<button
										type="button"
										className={styles.nativeShareButton}
										onClick={handleNativeShare}
									>
										<i className="ri-share-line" aria-hidden="true" />
										<span>Share</span>
									</button>

									<div className={styles.dividerWithText}>
										<span>or copy link for</span>
									</div>

									<div className={styles.channelList}>
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
													<span className={styles.channelName}>
														{config.label}
													</span>
													<span className={styles.copyLabel}>
														{isCopied ? (
															<>
																<i
																	className="ri-check-line"
																	aria-hidden="true"
																/>
																<span>Copied!</span>
															</>
														) : (
															<>
																<i
																	className="ri-file-copy-line"
																	aria-hidden="true"
																/>
																<span>Copy link</span>
															</>
														)}
													</span>
												</button>
											);
										})}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	},
);

SuccessScreenPreview.displayName = "SuccessScreenPreview";
