import { Check, Gift, Lightbulb, Share2, UserPlus } from "lucide-react";
import {
	type HTMLAttributes,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Icon, Progress, Stack, Text } from "@/proto-design-system";
import { PositionTracker } from "../PositionTracker/component";
import { ReferralLink } from "../ReferralLink/component";
import { ShareButtons } from "../ShareButtons/component";
import styles from "./component.module.scss";

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
				<Stack gap="xs" className={styles.header}>
					<Stack direction="row" gap="sm" align="center">
						<Icon icon={Share2} size="lg" color="primary" />
						<Text as="h2" size="xl" weight="semibold" className={styles.title}>Your Referral Dashboard</Text>
					</Stack>
					<Text size="sm" color="muted" className={styles.subtitle}>
						Share your referral link and climb the leaderboard!
					</Text>
				</Stack>

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
						<Stack direction="row" gap="sm" align="center" className={styles.statCardHeader}>
							<Icon icon={UserPlus} size="md" color="secondary" />
							<Text size="sm" weight="medium" className={styles.statLabel}>Your Referrals</Text>
						</Stack>
						<Text as="div" size="2xl" weight="semibold" className={styles.statValue}>{referralData.referralCount}</Text>
						<Text size="sm" color="muted" className={styles.statDescription}>
							{getReferralDescription(referralData.referralCount)}
						</Text>
					</div>
				</div>

				{/* Reward Progress Section */}
				{referralData.nextRewardTier && (
					<div className={styles.rewardSection}>
						<Stack direction="row" justify="between" align="start" className={styles.rewardHeader}>
							<Stack gap="xs" className={styles.rewardInfo}>
								<Stack direction="row" gap="sm" align="center">
									<Icon icon={Gift} size="md" color="primary" />
									<Text as="h3" size="md" weight="semibold" className={styles.rewardTitle}>
										Next Reward: {referralData.nextRewardTier.name}
									</Text>
								</Stack>
								<Text size="sm" color="muted" className={styles.rewardDescription}>
									{referralData.nextRewardTier.reward}
								</Text>
							</Stack>
							<div className={styles.rewardProgress}>
								<Text size="sm" weight="medium" className={styles.progressText}>
									{referralData.referralCount} /{" "}
									{referralData.nextRewardTier.requiredReferrals}
								</Text>
							</div>
						</Stack>
						<Progress
							value={progress}
							size="md"
							variant="default"
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
					<Stack direction="row" gap="sm" align="center" className={styles.sectionTitle}>
						<Icon icon={Share2} size="md" color="secondary" />
						<Text as="h3" size="md" weight="semibold">Share Your Link</Text>
					</Stack>
					<ShareButtons
						referralUrl={referralUrl}
						message="Join me on this amazing platform! 🚀"
						onShare={(platform) => console.log(`Shared on ${platform}`)}
					/>
				</div>

				{/* Tips Section */}
				<div className={styles.tipsSection}>
					<Stack direction="row" gap="sm" align="center" className={styles.sectionTitle}>
						<Icon icon={Lightbulb} size="md" color="warning" />
						<Text as="h3" size="md" weight="semibold">Tips to Get More Referrals</Text>
					</Stack>
					<ul className={styles.tipsList}>
						<li className={styles.tipItem}>
							<Icon icon={Check} size="sm" color="success" />
							<Text size="sm">Share your link on social media to reach more people</Text>
						</li>
						<li className={styles.tipItem}>
							<Icon icon={Check} size="sm" color="success" />
							<Text size="sm">Personalize your message to make it more appealing</Text>
						</li>
						<li className={styles.tipItem}>
							<Icon icon={Check} size="sm" color="success" />
							<Text size="sm">Follow up with friends who haven't signed up yet</Text>
						</li>
						<li className={styles.tipItem}>
							<Icon icon={Check} size="sm" color="success" />
							<Text size="sm">Use the QR code for in-person sharing</Text>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
});

ReferralDashboard.displayName = "ReferralDashboard";
