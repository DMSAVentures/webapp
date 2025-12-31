import { CheckCircle, Copy, QrCode } from "lucide-react";
import { HTMLAttributes, memo, useCallback, useState } from "react";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Modal } from "@/proto-design-system/components/overlays/Modal";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import styles from "./component.module.scss";

/**
 * Props for the ReferralLink component
 */
export interface ReferralLinkProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onCopy"> {
	/** The referral code to generate the URL */
	referralCode: string;
	/** Callback fired when the link is copied */
	onCopy?: () => void;
	/** Base URL for the referral link (defaults to window.location.origin) */
	baseUrl?: string;
	/** Additional CSS class name */
	className?: string;
}

/**
 * ReferralLink component - Displays a copyable referral link with QR code functionality
 *
 * Features:
 * - Display full referral URL
 * - Copy button (uses Clipboard API)
 * - Shows "Copied!" feedback on click
 * - QR code button (opens modal with QR code)
 */
export const ReferralLink = memo(function ReferralLink({
	referralCode,
	onCopy,
	baseUrl,
	className: customClassName,
	...props
}: ReferralLinkProps) {
	const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
	const [showQRModal, setShowQRModal] = useState(false);

	// Generate the full referral URL
	const referralUrl = `${baseUrl || (typeof window !== "undefined" ? window.location.origin : "")}?ref=${referralCode}`;

	// Generate QR code URL using an API
	const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(referralUrl)}`;

	// Handle copy to clipboard
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(referralUrl);
			setShowCopiedFeedback(true);
			onCopy?.();

			// Hide feedback after 2 seconds
			setTimeout(() => {
				setShowCopiedFeedback(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
		}
	}, [referralUrl, onCopy]);

	// Handle QR modal
	const handleOpenQRModal = useCallback(() => {
		setShowQRModal(true);
	}, []);

	const handleCloseQRModal = useCallback(() => {
		setShowQRModal(false);
	}, []);

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	return (
		<>
			<div className={classNames} {...props}>
				<div className={styles.container}>
					<Stack
						direction="row"
						gap="sm"
						align="center"
						className={styles.labelContainer}
					>
						<Text as="label" size="sm" weight="medium" className={styles.label}>
							Your Referral Link
						</Text>
						{showCopiedFeedback && (
							<Stack
								direction="row"
								gap="xs"
								align="center"
								className={styles.copiedFeedback}
							>
								<Icon icon={CheckCircle} size="sm" color="success" />
								<Text size="sm" color="success">
									Copied!
								</Text>
							</Stack>
						)}
					</Stack>

					<div className={styles.linkContainer}>
						<div className={styles.linkDisplay}>
							<span className={styles.linkText}>{referralUrl}</span>
						</div>

						<div className={styles.buttonGroup}>
							<Button
								variant="secondary"
								size="md"
								leftIcon={<Copy size={16} />}
								onClick={handleCopy}
								aria-label="Copy referral link"
								className={styles.copyButton}
							>
								Copy
							</Button>

							<Button
								variant="secondary"
								size="md"
								leftIcon={<QrCode size={16} />}
								onClick={handleOpenQRModal}
								aria-label="Show QR code"
								className={styles.qrButton}
							>
								QR Code
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* QR Code Modal */}
			<Modal
				isOpen={showQRModal}
				onClose={handleCloseQRModal}
				title="Scan QR Code"
				description="Share your referral link by scanning this QR code"
				footer={
					<Button variant="primary" onClick={handleCloseQRModal}>
						Close
					</Button>
				}
			>
				<div className={styles.qrCodeContainer}>
					<img
						src={qrCodeUrl}
						alt="Referral QR Code"
						className={styles.qrCodeImage}
					/>
					<p className={styles.qrCodeUrl}>{referralUrl}</p>
				</div>
			</Modal>
		</>
	);
});

ReferralLink.displayName = "ReferralLink";
