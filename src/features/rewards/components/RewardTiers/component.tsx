/**
 * RewardTiers Component
 * Displays reward tiers as a vertical timeline
 */

import { Archive, Calendar, CheckCircle2, Crown, Flag, Gift, Loader2, type LucideIcon, Shirt, Star, Tag } from "lucide-react";
import { type HTMLAttributes, memo } from "react";
import { Badge, Icon, Progress } from "@/proto-design-system";
import type { Reward } from "@/types/common.types";
import styles from "./component.module.scss";

export interface RewardTiersProps extends HTMLAttributes<HTMLDivElement> {
	/** Campaign ID to fetch rewards for */
	campaignId: string;
	/** Current user progress (optional) */
	currentUserProgress?: {
		referralCount: number;
		nextTierTarget: number;
	};
	/** Rewards data (if not provided, will be fetched) */
	rewards?: Reward[];
	/** Loading state */
	loading?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * Maps reward type to icon
 */
const getRewardIcon = (type: Reward["type"]): LucideIcon => {
	switch (type) {
		case "early_access":
			return Crown;
		case "discount":
			return Tag;
		case "premium_feature":
			return Star;
		case "merchandise":
			return Shirt;
		case "custom":
			return Gift;
		default:
			return Gift;
	}
};

/**
 * Gets requirement text for a reward
 */
const getRequirementText = (reward: Reward): string => {
	if (reward.triggerType === "manual") {
		return "Manually assigned";
	}
	if (reward.triggerType === "referral_count") {
		const count = reward.triggerValue || 0;
		return `Refer ${count} ${count === 1 ? "person" : "people"}`;
	}
	if (reward.triggerType === "position") {
		return `Top ${reward.triggerValue} on waitlist`;
	}
	return "No requirements";
};

/**
 * Checks if a tier is unlocked based on user progress
 */
const isTierUnlocked = (
	reward: Reward,
	userProgress?: RewardTiersProps["currentUserProgress"],
): boolean => {
	if (!userProgress) return false;
	if (reward.triggerType === "referral_count" && reward.triggerValue) {
		return userProgress.referralCount >= reward.triggerValue;
	}
	return false;
};

/**
 * Gets the current tier based on user progress
 */
const getCurrentTier = (
	rewards: Reward[],
	userProgress?: RewardTiersProps["currentUserProgress"],
): number | null => {
	if (!userProgress) return null;

	const unlockedRewards = rewards.filter((reward) =>
		isTierUnlocked(reward, userProgress),
	);
	if (unlockedRewards.length === 0) return null;

	// Return the highest tier that's unlocked
	return Math.max(...unlockedRewards.map((r) => r.tier));
};

/**
 * Gets the next tier target
 */
const getNextTierTarget = (
	rewards: Reward[],
	currentTier: number | null,
): Reward | null => {
	const sortedRewards = [...rewards].sort((a, b) => a.tier - b.tier);

	if (currentTier === null) {
		return sortedRewards[0] || null;
	}

	return sortedRewards.find((r) => r.tier > currentTier) || null;
};

/**
 * RewardTiers displays rewards in a vertical timeline
 */
export const RewardTiers = memo<RewardTiersProps>(function RewardTiers({
	campaignId,
	currentUserProgress,
	rewards: providedRewards,
	loading = false,
	className: customClassName,
	...props
}) {
	const rewards = providedRewards || [];

	// Sort rewards by tier
	const sortedRewards = [...rewards].sort((a, b) => a.tier - b.tier);

	// Determine current tier and next target
	const currentTier = getCurrentTier(sortedRewards, currentUserProgress);
	const nextTierReward = getNextTierTarget(sortedRewards, currentTier);

	// Calculate progress to next tier
	const progressPercent =
		currentUserProgress && nextTierReward && nextTierReward.triggerValue
			? Math.min(
					100,
					(currentUserProgress.referralCount / nextTierReward.triggerValue) *
						100,
				)
			: 0;

	const remainingToNextTier =
		nextTierReward && nextTierReward.triggerValue && currentUserProgress
			? Math.max(
					0,
					nextTierReward.triggerValue - currentUserProgress.referralCount,
				)
			: 0;

	const classNames = [styles.root, customClassName].filter(Boolean).join(" ");

	if (loading) {
		return (
			<div className={classNames} {...props}>
				<div className={styles.loading}>
					<Icon icon={Loader2} size="lg" className={styles.spin} />
					<span>Loading reward tiers...</span>
				</div>
			</div>
		);
	}

	if (sortedRewards.length === 0) {
		return (
			<div className={classNames} {...props}>
				<div className={styles.empty}>
					<Icon icon={Gift} size="2xl" />
					<h3>No reward tiers yet</h3>
					<p>Create reward tiers to incentivize referrals</p>
				</div>
			</div>
		);
	}

	return (
		<div className={classNames} {...props}>
			{/* Progress Section (if user progress provided) */}
			{currentUserProgress && (
				<div className={styles.progressSection}>
					<div className={styles.progressHeader}>
						<div className={styles.progressStats}>
							<span className={styles.progressLabel}>Your Progress</span>
							<span className={styles.progressValue}>
								{currentUserProgress.referralCount}{" "}
								{currentUserProgress.referralCount === 1
									? "referral"
									: "referrals"}
							</span>
						</div>
						{nextTierReward && remainingToNextTier > 0 && (
							<span className={styles.progressRemaining}>
								{remainingToNextTier} more to unlock {nextTierReward.name}
							</span>
						)}
					</div>
					{nextTierReward && (
						<Progress
							value={progressPercent}
							variant="default"
							size="md"
						/>
					)}
				</div>
			)}

			{/* Timeline */}
			<div className={styles.timeline}>
				{sortedRewards.map((reward, index) => {
					const isUnlocked = isTierUnlocked(reward, currentUserProgress);
					const isCurrent = reward.tier === currentTier;
					const isNext = nextTierReward?.id === reward.id;

					return (
						<div
							key={reward.id}
							className={[
								styles.timelineItem,
								isUnlocked && styles.unlocked,
								isCurrent && styles.current,
								isNext && styles.next,
							]
								.filter(Boolean)
								.join(" ")}
						>
							{/* Timeline connector */}
							{index < sortedRewards.length - 1 && (
								<div className={styles.connector} />
							)}

							{/* Icon */}
							<div className={styles.iconWrapper}>
								{isUnlocked ? (
									<Icon icon={CheckCircle2} size="md" />
								) : (
									<Icon icon={getRewardIcon(reward.type)} size="md" />
								)}
							</div>

							{/* Content */}
							<div className={styles.content}>
								<div className={styles.header}>
									<Badge
										variant="primary"
										size="sm"
									>
										Tier {reward.tier}
									</Badge>
									{reward.status === "inactive" && (
										<Badge
											variant="secondary"
											size="sm"
										>
											Inactive
										</Badge>
									)}
									{isUnlocked && (
										<Badge
											variant="success"
											size="sm"
										>
											Unlocked
										</Badge>
									)}
								</div>

								<h4 className={styles.name}>{reward.name}</h4>
								<p className={styles.description}>{reward.description}</p>

								{/* Value */}
								{reward.value && (
									<div className={styles.value}>
										<Icon icon={Gift} size="sm" />
										{reward.value}
									</div>
								)}

								{/* Requirement */}
								<div className={styles.requirement}>
									<Icon icon={Flag} size="sm" />
									{getRequirementText(reward)}
								</div>

								{/* Additional info */}
								<div className={styles.meta}>
									{reward.inventory && (
										<span className={styles.metaItem}>
											<Icon icon={Archive} size="sm" />
											{reward.inventory} available
										</span>
									)}
									{reward.expiryDate && (
										<span className={styles.metaItem}>
											<Icon icon={Calendar} size="sm" />
											Expires{" "}
											{new Date(reward.expiryDate).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</span>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
});

RewardTiers.displayName = "RewardTiers";
