/**
 * ChannelReferralLinks Component
 * Displays channel-specific referral links with copy and share functionality
 */

import { HTMLAttributes, memo, useCallback, useState } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import type { SharingChannel } from "@/types/campaign";
import styles from "./component.module.scss";
import "remixicon/fonts/remixicon.css";

/**
 * Props for the ChannelReferralLinks component
 */
export interface ChannelReferralLinksProps
	extends HTMLAttributes<HTMLDivElement> {
	/** Referral codes per channel */
	referralCodes: Partial<Record<SharingChannel, string>>;
	/** List of enabled channels to display */
	enabledChannels: SharingChannel[];
	/** Base URL for the referral links (without query params) */
	baseUrl: string;
	/** Custom share message */
	shareMessage?: string;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Platform configuration with display info and share URLs
 */
interface ChannelConfig {
	label: string;
	icon: string;
	color: string;
	getShareUrl: (url: string, message: string) => string;
}

const channelConfigs: Record<SharingChannel, ChannelConfig> = {
	twitter: {
		label: "Twitter",
		icon: "ri-twitter-x-fill",
		color: "twitter",
		getShareUrl: (url, message) =>
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
	},
	facebook: {
		label: "Facebook",
		icon: "ri-facebook-fill",
		color: "facebook",
		getShareUrl: (url) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
	},
	linkedin: {
		label: "LinkedIn",
		icon: "ri-linkedin-fill",
		color: "linkedin",
		getShareUrl: (url) =>
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
	},
	whatsapp: {
		label: "WhatsApp",
		icon: "ri-whatsapp-fill",
		color: "whatsapp",
		getShareUrl: (url, message) =>
			`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`,
	},
	email: {
		label: "Email",
		icon: "ri-mail-fill",
		color: "email",
		getShareUrl: (url, message) =>
			`mailto:?subject=${encodeURIComponent("Check this out!")}&body=${encodeURIComponent(`${message}\n\n${url}`)}`,
	},
};

/**
 * ChannelReferralLinks displays unique referral links per sharing channel
 *
 * Features:
 * - Display each enabled channel with its unique referral link
 * - Copy button per link with feedback
 * - Share button that opens platform-specific share dialog
 */
export const ChannelReferralLinks = memo<ChannelReferralLinksProps>(
	function ChannelReferralLinks({
		referralCodes,
		enabledChannels,
		baseUrl,
		shareMessage = "Join me on this waitlist!",
		className: customClassName,
		...props
	}) {
		const [copiedChannel, setCopiedChannel] = useState<SharingChannel | null>(
			null,
		);

		// Build the full URL for a channel
		const getChannelUrl = useCallback(
			(channel: SharingChannel): string => {
				const code = referralCodes[channel];
				if (!code) return baseUrl;

				// Append ref param to base URL
				const separator = baseUrl.includes("?") ? "&" : "?";
				return `${baseUrl}${separator}ref=${code}`;
			},
			[referralCodes, baseUrl],
		);

		// Handle copy to clipboard
		const handleCopy = useCallback(
			async (channel: SharingChannel) => {
				const url = getChannelUrl(channel);
				try {
					await navigator.clipboard.writeText(url);
					setCopiedChannel(channel);

					// Reset after 2 seconds
					setTimeout(() => {
						setCopiedChannel((current) =>
							current === channel ? null : current,
						);
					}, 2000);
				} catch (error) {
					console.error("Failed to copy to clipboard:", error);
				}
			},
			[getChannelUrl],
		);

		// Handle share button click
		const handleShare = useCallback(
			(channel: SharingChannel) => {
				const url = getChannelUrl(channel);
				const config = channelConfigs[channel];
				const shareUrl = config.getShareUrl(url, shareMessage);

				// Open share dialog in new window
				window.open(shareUrl, "_blank", "width=600,height=400");
			},
			[getChannelUrl, shareMessage],
		);

		// Filter to only enabled channels that have codes
		const channelsToDisplay = enabledChannels.filter(
			(channel) => referralCodes[channel],
		);

		if (channelsToDisplay.length === 0) {
			return null;
		}

		const classNames = [styles.root, customClassName]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={classNames} {...props}>
				<div className={styles.header}>
					<i className="ri-share-forward-fill" aria-hidden="true" />
					<h3 className={styles.title}>Share with friends & move up!</h3>
				</div>

				<div className={styles.channelList}>
					{channelsToDisplay.map((channel) => {
						const config = channelConfigs[channel];
						const url = getChannelUrl(channel);
						const isCopied = copiedChannel === channel;

						return (
							<div key={channel} className={styles.channelCard}>
								<div className={styles.channelHeader}>
									<div
										className={`${styles.channelIcon} ${styles[`channelIcon_${config.color}`]}`}
									>
										<i className={config.icon} aria-hidden="true" />
									</div>
									<span className={styles.channelLabel}>{config.label}</span>
								</div>

								<div className={styles.linkContainer}>
									<div className={styles.linkDisplay}>
										<span className={styles.linkText}>{url}</span>
									</div>

									<div className={styles.actions}>
										<Button
											variant="secondary"
											size="small"
											leftIcon={
												isCopied ? "checkbox-circle-fill" : "file-copy-line"
											}
											onClick={() => handleCopy(channel)}
											aria-label={`Copy ${config.label} link`}
										>
											{isCopied ? "Copied!" : "Copy"}
										</Button>

										<IconOnlyButton
											variant="secondary"
											iconClass="share-line"
											onClick={() => handleShare(channel)}
											ariaLabel={`Share on ${config.label}`}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	},
);

ChannelReferralLinks.displayName = "ChannelReferralLinks";
