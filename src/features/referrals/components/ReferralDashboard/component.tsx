import { memo, useState, useEffect, useCallback, HTMLAttributes } from 'react';
import { ReferralLink } from '../ReferralLink/component';
import { ShareButtons } from '../ShareButtons/component';
import { PositionTracker } from '../PositionTracker/component';
import ProgressBar from '@/proto-design-system/progressbar/progressbar';
import styles from './component.module.scss';
import 'remixicon/fonts/remixicon.css';

/**
 * Props for the ReferralDashboard component
 */
export interface ReferralDashboardProps extends HTMLAttributes<HTMLDivElement> {
    /** User ID to display referral data for */
    userId: string;
    /** Campaign ID for the referral program */
    campaignId: string;
    /** Function to fetch referral data */
    fetchReferralData?: (userId: string, campaignId: string) => Promise<ReferralData>;
    /** Initial referral data (for testing/storybook) */
    initialData?: ReferralData;
    /** Polling interval in milliseconds (default: 10000) */
    pollingInterval?: number;
    /** Additional CSS class name */
    className?: string;
}

/**
 * Referral data structure
 */
export interface ReferralData {
    referralCode: string;
    referralCount: number;
    position: number;
    totalUsers: number;
    percentile: number;
    nextRewardTier?: RewardTier;
    currentPoints?: number;
}

/**
 * Reward tier structure
 */
export interface RewardTier {
    name: string;
    requiredReferrals: number;
    reward: string;
}

/**
 * ReferralDashboard component - Comprehensive user-facing referral progress display
 *
 * Features:
 * - Shows user's position (#123)
 * - Shows referral count (You referred 5 people)
 * - Referral link with copy button
 * - Social share buttons (7+ platforms)
 * - Progress bar to next reward tier
 * - Position tracker with animations
 * - Confetti animation when position improves
 */
export const ReferralDashboard = memo(function ReferralDashboard({
    userId,
    campaignId,
    fetchReferralData,
    initialData = {
        referralCode: 'LOADING',
        referralCount: 0,
        position: 0,
        totalUsers: 0,
        percentile: 0,
    },
    pollingInterval = 10000,
    className: customClassName,
    ...props
}: ReferralDashboardProps) {
    const [referralData, setReferralData] = useState<ReferralData>(initialData);
    const [loading, setLoading] = useState(false);

    // Fetch referral data
    const loadReferralData = useCallback(async () => {
        if (!fetchReferralData) return;

        try {
            setLoading(true);
            const data = await fetchReferralData(userId, campaignId);
            setReferralData(data);
        } catch (error) {
            console.error('Failed to fetch referral data:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, campaignId, fetchReferralData]);

    // Set up polling
    useEffect(() => {
        if (!fetchReferralData) return;

        // Initial load
        loadReferralData();

        // Set up polling interval
        const interval = setInterval(loadReferralData, pollingInterval);

        return () => clearInterval(interval);
    }, [loadReferralData, pollingInterval, fetchReferralData]);

    // Calculate progress to next reward tier
    const calculateProgress = (): number => {
        if (!referralData.nextRewardTier) return 100;
        return (referralData.referralCount / referralData.nextRewardTier.requiredReferrals) * 100;
    };

    const progress = calculateProgress();
    const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralData.referralCode}`;

    const classNames = [
        styles.root,
        customClassName
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} {...props}>
            <div className={styles.container}>
                {/* Header Section */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <i className="ri-share-forward-fill" aria-hidden="true" />
                        Your Referral Dashboard
                    </h2>
                    <p className={styles.subtitle}>
                        Share your referral link and climb the leaderboard!
                    </p>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    {/* Position Tracker */}
                    <div className={styles.statCard}>
                        <PositionTracker
                            userId={userId}
                            initialPosition={{
                                position: referralData.position,
                                totalUsers: referralData.totalUsers,
                                percentile: referralData.percentile,
                            }}
                        />
                    </div>

                    {/* Referral Count Card */}
                    <div className={`${styles.statCard} ${styles.referralCountCard}`}>
                        <div className={styles.statCardHeader}>
                            <i className="ri-user-add-fill" aria-hidden="true" />
                            <span className={styles.statLabel}>Your Referrals</span>
                        </div>
                        <div className={styles.statValue}>
                            {referralData.referralCount}
                        </div>
                        <div className={styles.statDescription}>
                            {referralData.referralCount === 0
                                ? 'Start sharing to earn rewards'
                                : referralData.referralCount === 1
                                ? 'You referred 1 person'
                                : `You referred ${referralData.referralCount} people`}
                        </div>
                    </div>
                </div>

                {/* Reward Progress Section */}
                {referralData.nextRewardTier && (
                    <div className={styles.rewardSection}>
                        <div className={styles.rewardHeader}>
                            <div className={styles.rewardInfo}>
                                <h3 className={styles.rewardTitle}>
                                    <i className="ri-gift-fill" aria-hidden="true" />
                                    Next Reward: {referralData.nextRewardTier.name}
                                </h3>
                                <p className={styles.rewardDescription}>
                                    {referralData.nextRewardTier.reward}
                                </p>
                            </div>
                            <div className={styles.rewardProgress}>
                                <span className={styles.progressText}>
                                    {referralData.referralCount} / {referralData.nextRewardTier.requiredReferrals}
                                </span>
                            </div>
                        </div>
                        <ProgressBar
                            percentage={progress}
                            size="medium"
                            variant="default"
                            showLabel={false}
                        />
                    </div>
                )}

                {/* Referral Link Section */}
                <div className={styles.linkSection}>
                    <ReferralLink
                        referralCode={referralData.referralCode}
                        onCopy={() => console.log('Referral link copied')}
                    />
                </div>

                {/* Share Buttons Section */}
                <div className={styles.shareSection}>
                    <h3 className={styles.sectionTitle}>
                        <i className="ri-share-fill" aria-hidden="true" />
                        Share Your Link
                    </h3>
                    <ShareButtons
                        referralUrl={referralUrl}
                        message="Join me on this amazing platform! 🚀"
                        onShare={(platform) => console.log(`Shared on ${platform}`)}
                    />
                </div>

                {/* Tips Section */}
                <div className={styles.tipsSection}>
                    <h3 className={styles.sectionTitle}>
                        <i className="ri-lightbulb-fill" aria-hidden="true" />
                        Tips to Get More Referrals
                    </h3>
                    <ul className={styles.tipsList}>
                        <li className={styles.tipItem}>
                            <i className="ri-check-line" aria-hidden="true" />
                            Share your link on social media to reach more people
                        </li>
                        <li className={styles.tipItem}>
                            <i className="ri-check-line" aria-hidden="true" />
                            Personalize your message to make it more appealing
                        </li>
                        <li className={styles.tipItem}>
                            <i className="ri-check-line" aria-hidden="true" />
                            Follow up with friends who haven't signed up yet
                        </li>
                        <li className={styles.tipItem}>
                            <i className="ri-check-line" aria-hidden="true" />
                            Use the QR code for in-person sharing
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
});

ReferralDashboard.displayName = 'ReferralDashboard';
