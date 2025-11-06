import { memo, useState, useCallback, HTMLAttributes } from 'react';
import { Button } from '@/proto-design-system/Button/button';
import Modal from '@/proto-design-system/modal/modal';
import styles from './component.module.scss';
import 'remixicon/fonts/remixicon.css';

/**
 * Props for the ReferralLink component
 */
export interface ReferralLinkProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onCopy'> {
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
    const referralUrl = `${baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')}?ref=${referralCode}`;

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
            console.error('Failed to copy to clipboard:', error);
        }
    }, [referralUrl, onCopy]);

    // Handle QR modal
    const handleOpenQRModal = useCallback(() => {
        setShowQRModal(true);
    }, []);

    const handleCloseQRModal = useCallback(() => {
        setShowQRModal(false);
    }, []);

    const classNames = [
        styles.root,
        customClassName
    ].filter(Boolean).join(' ');

    return (
        <>
            <div className={classNames} {...props}>
                <div className={styles.container}>
                    <div className={styles.labelContainer}>
                        <label className={styles.label}>Your Referral Link</label>
                        {showCopiedFeedback && (
                            <span className={styles.copiedFeedback}>
                                <i className="ri-checkbox-circle-fill" aria-hidden="true" />
                                Copied!
                            </span>
                        )}
                    </div>

                    <div className={styles.linkContainer}>
                        <div className={styles.linkDisplay}>
                            <span className={styles.linkText}>{referralUrl}</span>
                        </div>

                        <div className={styles.buttonGroup}>
                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={handleCopy}
                                aria-label="Copy referral link"
                                className={styles.copyButton}
                            >
                                <i className="ri-file-copy-line" aria-hidden="true" />
                                Copy
                            </Button>

                            <Button
                                variant="secondary"
                                size="medium"
                                onClick={handleOpenQRModal}
                                aria-label="Show QR code"
                                className={styles.qrButton}
                            >
                                <i className="ri-qr-code-line" aria-hidden="true" />
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
                proceedText="Close"
                onProceed={handleCloseQRModal}
                dismissibleByCloseIcon={true}
                centeredHeader={true}
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

ReferralLink.displayName = 'ReferralLink';
