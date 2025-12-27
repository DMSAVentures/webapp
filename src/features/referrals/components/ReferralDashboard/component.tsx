import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import ProgressBar from "@/proto-design-system/progressbar/progressbar";
import { PositionTracker } from "../PositionTracker/component";
import { ReferralLink } from "../ReferralLink/component";
import { ShareButtons } from "../ShareButtons/component";
import styles from "./component.module.scss";
import "remixicon/fonts/remixicon.css";

/**
 * Props for the ReferralDashboard component
 */
export interface ReferralDashboardProps extends HTMLAttributes<HTMLDivElement> {
	/** User ID to display referral data for */
	userId: string;
	/** Campaign ID for the referral program */
	campaignId: string;
	/** Function to fetch referral data */
	fetchReferralData?: (
		userId: string,
		campaignId: string,
	) => Promise<ReferralData>;
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

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_REFERRAL_DATA: ReferralData = {
	referralCode: "LOADING",
	referralCount: 0,
	position: 0,
	totalUsers: 0,
	percentile: 0,
};

// ============================================================================
// Pure Functions
// ============================================================================

/** Calculate progress percentage to next reward tier */
function calculateProgress(data: ReferralData): number {
	if (!data.nextRewardTier) return 100;
	return (data.referralCount / data.nextRewardTier.requiredReferrals) * 100;
}

/** Generate referral URL from code */
function generateReferralUrl(referralCode: string): string {
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	return `${origin}?ref=${referralCode}`;
}

/** Get description text based on referral count */
function getReferralDescription(referralCount: number): string {
	if (referralCount === 0) return "Start sharing to earn rewards";
	if (referralCount === 1) return "You referred 1 person";
	return `You referred ${referralCount} people`;
}

// ============================================================================
// Custom Hooks
// ============================================================================

/** Hook for polling referral data at regular intervals */
function useReferralPolling(
	userId: string,
	campaignId: string,
	fetchReferralData:
		| ((userId: string, campaignId: string) => Promise<ReferralData>)
		| undefined,
	pollingInterval: number,
	initialData: ReferralData,
) {
	const [referralData, setReferralData] = useState<ReferralData>(initialData);

	const loadReferralData = useCallback(async () => {
		if (!fetchReferralData) return;

		try {
			const data = await fetchReferralData(userId, campaignId);
			setReferralData(data);
		} catch (error) {
			console.error("Failed to fetch referral data:", error);
		}
	}, [userId, campaignId, fetchReferralData]);

	useEffect(() => {
		if (!fetchReferralData) return;

		// Initial load
		loadReferralData();

		// Set up polling interval
		const interval = setInterval(loadReferralData, pollingInterval);

		return () => clearInterval(interval);
	}, [loadReferralData, pollingInterval, fetchReferralData]);

	return referralData;
}

// ============================================================================
// Component
// ============================================================================

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
	initialData = DEFAULT_REFERRAL_DATA,
	pollingInterval = 10000,
	className: customClassName,
	...props
}: ReferralDashboardProps) {
	// Hooks
	const referralData = useReferralPolling(
		userId,
		campaignId,
		fetchReferralData,
		pollingInterval,
		initialData,
	);

	// Derived state
	const progress = calculateProgress(referralData);
	const referralUrl = generateReferralUrl(referralData.referralCode);
	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

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
						<div className={styles.statValue}>{referralData.referralCount}</div>
						<div className={styles.statDescription}>
							{getReferralDescription(referralData.referralCount)}
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
									{referralData.referralCount} /{" "}
									{referralData.nextRewardTier.requiredReferrals}
								</span>
							</div>
						</div>
						<ProgressBar
							progress={progress}
							size="medium"
							variant="info"
							showPercentage={false}
						/>
					</div>
				)}

				{/* Referral Link Section */}
				<div className={styles.linkSection}>
					<ReferralLink
						referralCode={referralData.referralCode}
						onCopy={() => console.log("Referral link copied")}
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

ReferralDashboard.displayName = "ReferralDashboard";
