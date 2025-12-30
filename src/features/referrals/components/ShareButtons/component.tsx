import { CheckCircle2, Link, Mail } from "lucide-react";
import { HTMLAttributes, memo, useCallback, useState } from "react";
import { Button } from "@/proto-design-system/components/primitives/Button";
import styles from "./component.module.scss";
import "remixicon/fonts/remixicon.css"; // Keep for brand icons (Twitter, Facebook, LinkedIn, etc.)

/**
 * Supported social sharing platforms
 */
export type SharePlatform =
	| "twitter"
	| "facebook"
	| "linkedin"
	| "whatsapp"
	| "telegram"
	| "email"
	| "copy";

/**
 * Props for the ShareButtons component
 */
export interface ShareButtonsProps extends HTMLAttributes<HTMLDivElement> {
	/** The referral URL to share */
	referralUrl: string;
	/** Custom message to share (will be optimized per platform) */
	message?: string;
	/** Callback fired when a share button is clicked */
	onShare?: (platform: SharePlatform) => void;
	/** Layout variant */
	layout?: "horizontal" | "vertical" | "grid";
	/** Additional CSS class name */
	className?: string;
}

/**
 * Platform configuration with share URLs and icons
 */
interface PlatformConfig {
	label: string;
	icon: string;
	color: string;
	getUrl: (url: string, message: string) => string;
}

const platformConfigs: Record<
	Exclude<SharePlatform, "copy">,
	PlatformConfig
> = {
	twitter: {
		label: "Twitter",
		icon: "ri-twitter-x-fill",
		color: "twitter",
		getUrl: (url, message) =>
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
	},
	facebook: {
		label: "Facebook",
		icon: "ri-facebook-fill",
		color: "facebook",
		getUrl: (url) =>
			`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
	},
	linkedin: {
		label: "LinkedIn",
		icon: "ri-linkedin-fill",
		color: "linkedin",
		getUrl: (url) =>
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
	},
	whatsapp: {
		label: "WhatsApp",
		icon: "ri-whatsapp-fill",
		color: "whatsapp",
		getUrl: (url, message) =>
			`https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`,
	},
	telegram: {
		label: "Telegram",
		icon: "ri-telegram-fill",
		color: "telegram",
		getUrl: (url, message) =>
			`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`,
	},
	email: {
		label: "Email",
		icon: "mail", // Will use Lucide Mail icon
		color: "email",
		getUrl: (url, message) =>
			`mailto:?subject=${encodeURIComponent("Check this out!")}&body=${encodeURIComponent(`${message}\n\n${url}`)}`,
	},
};

/**
 * ShareButtons component - Social sharing buttons for multiple platforms
 *
 * Features:
 * - Buttons for Twitter, Facebook, LinkedIn, WhatsApp, Telegram, Email, Copy Link
 * - Each button opens share dialog/URL
 * - Track clicks via onShare callback
 * - Optimized message per platform
 * - Icon + label layout
 * - Multiple layout options
 */
export const ShareButtons = memo(function ShareButtons({
	referralUrl,
	message = "Join me on this amazing platform!",
	onShare,
	layout = "grid",
	className: customClassName,
	...props
}: ShareButtonsProps) {
	const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

	// Handle platform share
	const handleShare = useCallback(
		(platform: Exclude<SharePlatform, "copy">) => {
			const config = platformConfigs[platform];
			const shareUrl = config.getUrl(referralUrl, message);

			// Open share URL in new window
			window.open(shareUrl, "_blank", "width=600,height=400");

			// Call callback
			onShare?.(platform);
		},
		[referralUrl, message, onShare],
	);

	// Handle copy link
	const handleCopyLink = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(referralUrl);
			setShowCopiedFeedback(true);
			onShare?.("copy");

			// Hide feedback after 2 seconds
			setTimeout(() => {
				setShowCopiedFeedback(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
		}
	}, [referralUrl, onShare]);

	const classNames = [
		styles.root,
		layout !== "grid" && styles[`layout_${layout}`],
		customClassName,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classNames} {...props}>
			<div className={styles.container}>
				{/* Social Platform Buttons */}
				{(
					Object.keys(platformConfigs) as Array<keyof typeof platformConfigs>
				).map((platform) => {
					const config = platformConfigs[platform];
					// Email uses Lucide icon, others use RemixIcon brand icons
					const leftIcon = platform === "email"
						? <Mail size={16} />
						: config.icon.replace("ri-", "");
					return (
						<Button
							key={platform}
							variant="secondary"
							size="md"
							leftIcon={leftIcon}
							onClick={() => handleShare(platform)}
							aria-label={`Share on ${config.label}`}
						>
							{config.label}
						</Button>
					);
				})}

				{/* Copy Link Button */}
				<Button
					variant="secondary"
					size="md"
					leftIcon={showCopiedFeedback ? <CheckCircle2 size={16} /> : <Link size={16} />}
					onClick={handleCopyLink}
					aria-label="Copy link"
				>
					{showCopiedFeedback ? "Copied!" : "Copy Link"}
				</Button>
			</div>
		</div>
	);
});

ShareButtons.displayName = "ShareButtons";
