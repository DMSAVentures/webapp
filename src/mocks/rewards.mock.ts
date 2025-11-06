/**
 * Mock data for Reward components
 * Used for Storybook stories and testing
 */

import type { Reward, RewardEarned } from "../types/common.types";

// Mock Rewards
export const mockRewards: Reward[] = [
	{
		id: "reward-1",
		campaignId: "campaign-1",
		name: "Early Bird Badge",
		description: "Exclusive badge for being one of the first 100 signups",
		type: "custom",
		value: "Digital Badge + Profile Highlight",
		tier: 1,
		triggerType: "position",
		triggerValue: 100,
		status: "active",
		inventory: undefined,
		expiryDate: undefined,
		deliveryMethod: "dashboard",
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "reward-2",
		campaignId: "campaign-1",
		name: "20% Launch Discount",
		description: "Get 20% off your first year subscription",
		type: "discount",
		value: "20% off first year",
		tier: 2,
		triggerType: "referral_count",
		triggerValue: 3,
		status: "active",
		inventory: undefined,
		expiryDate: new Date("2026-12-31T23:59:59Z"),
		deliveryMethod: "email",
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "reward-3",
		campaignId: "campaign-1",
		name: "3 Months Premium Free",
		description: "Unlock all premium features free for 3 months",
		type: "early_access",
		value: "3 months premium access",
		tier: 3,
		triggerType: "referral_count",
		triggerValue: 5,
		status: "active",
		inventory: undefined,
		expiryDate: undefined,
		deliveryMethod: "email",
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "reward-4",
		campaignId: "campaign-1",
		name: "Founder's Circle Access",
		description:
			"Join our exclusive founder's circle with direct access to the team",
		type: "premium_feature",
		value: "Lifetime founder status",
		tier: 4,
		triggerType: "referral_count",
		triggerValue: 10,
		status: "active",
		inventory: 50,
		expiryDate: undefined,
		deliveryMethod: "dashboard",
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "reward-5",
		campaignId: "campaign-1",
		name: "Lifetime Pro Account",
		description: "Get lifetime access to our Pro plan completely free",
		type: "premium_feature",
		value: "Lifetime Pro ($2,400 value)",
		tier: 5,
		triggerType: "referral_count",
		triggerValue: 25,
		status: "active",
		inventory: 10,
		expiryDate: undefined,
		deliveryMethod: "email",
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "reward-6",
		campaignId: "campaign-1",
		name: "Exclusive Swag Pack",
		description: "Limited edition t-shirt, stickers, and branded merchandise",
		type: "merchandise",
		value: "Premium swag pack",
		tier: 6,
		triggerType: "referral_count",
		triggerValue: 50,
		status: "active",
		inventory: 25,
		expiryDate: new Date("2025-12-31T23:59:59Z"),
		deliveryMethod: "email",
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	// Campaign 2 Rewards (Fitness App)
	{
		id: "reward-7",
		campaignId: "campaign-2",
		name: "Beta Tester Badge",
		description: "Official beta tester status on your profile",
		type: "custom",
		value: "Beta Tester Badge",
		tier: 1,
		triggerType: "position",
		triggerValue: 50,
		status: "active",
		inventory: undefined,
		expiryDate: undefined,
		deliveryMethod: "dashboard",
		createdAt: new Date("2024-10-20T08:30:00Z"),
	},
	{
		id: "reward-8",
		campaignId: "campaign-2",
		name: "Premium Features Access",
		description: "Unlock all premium workout plans and nutrition tracking",
		type: "premium_feature",
		value: "6 months premium",
		tier: 2,
		triggerType: "referral_count",
		triggerValue: 5,
		status: "active",
		inventory: undefined,
		expiryDate: undefined,
		deliveryMethod: "dashboard",
		createdAt: new Date("2024-10-20T08:30:00Z"),
	},
	{
		id: "reward-9",
		campaignId: "campaign-2",
		name: "Personal Training Session",
		description: "Free 1-hour virtual personal training session",
		type: "custom",
		value: "1 PT session ($100 value)",
		tier: 3,
		triggerType: "referral_count",
		triggerValue: 10,
		status: "active",
		inventory: 100,
		expiryDate: new Date("2025-06-30T23:59:59Z"),
		deliveryMethod: "email",
		createdAt: new Date("2024-10-20T08:30:00Z"),
	},
	{
		id: "reward-10",
		campaignId: "campaign-2",
		name: "Fitness Tracker Device",
		description: "Get a free fitness tracker smart watch",
		type: "merchandise",
		value: "Smart fitness tracker ($200 value)",
		tier: 4,
		triggerType: "referral_count",
		triggerValue: 20,
		status: "active",
		inventory: 15,
		expiryDate: new Date("2025-12-31T23:59:59Z"),
		deliveryMethod: "email",
		createdAt: new Date("2024-10-20T08:30:00Z"),
	},
	// Campaign 4 Rewards (AI Writing)
	{
		id: "reward-11",
		campaignId: "campaign-4",
		name: "Priority Beta Access",
		description: "Be among the first to test our AI writing assistant",
		type: "early_access",
		value: "Priority beta access",
		tier: 1,
		triggerType: "position",
		triggerValue: 1000,
		status: "active",
		inventory: undefined,
		expiryDate: undefined,
		deliveryMethod: "email",
		createdAt: new Date("2024-08-10T09:00:00Z"),
	},
	{
		id: "reward-12",
		campaignId: "campaign-4",
		name: "Pro Plan - 50% Off",
		description: "Get 50% off our Pro plan for the first year",
		type: "discount",
		value: "50% off Pro plan",
		tier: 2,
		triggerType: "referral_count",
		triggerValue: 5,
		status: "active",
		inventory: undefined,
		expiryDate: new Date("2026-12-31T23:59:59Z"),
		deliveryMethod: "email",
		createdAt: new Date("2024-08-10T09:00:00Z"),
	},
	{
		id: "reward-13",
		campaignId: "campaign-4",
		name: "Unlimited AI Credits",
		description: "Get unlimited AI writing credits for 6 months",
		type: "premium_feature",
		value: "Unlimited credits ($600 value)",
		tier: 3,
		triggerType: "referral_count",
		triggerValue: 15,
		status: "active",
		inventory: undefined,
		expiryDate: undefined,
		deliveryMethod: "dashboard",
		createdAt: new Date("2024-08-10T09:00:00Z"),
	},
	{
		id: "reward-14",
		campaignId: "campaign-4",
		name: "Lifetime Enterprise Access",
		description: "Lifetime access to our Enterprise tier with priority support",
		type: "premium_feature",
		value: "Lifetime Enterprise ($5,000 value)",
		tier: 4,
		triggerType: "referral_count",
		triggerValue: 50,
		status: "active",
		inventory: 5,
		expiryDate: undefined,
		deliveryMethod: "api_webhook",
		createdAt: new Date("2024-08-10T09:00:00Z"),
	},
	// Manual reward example
	{
		id: "reward-15",
		campaignId: "campaign-1",
		name: "VIP Launch Event Invitation",
		description: "Exclusive invitation to our virtual launch event",
		type: "custom",
		value: "VIP event access",
		tier: 7,
		triggerType: "manual",
		triggerValue: undefined,
		status: "active",
		inventory: 30,
		expiryDate: new Date("2025-11-30T23:59:59Z"),
		deliveryMethod: "email",
		createdAt: new Date("2024-10-01T14:00:00Z"),
	},
	// Inactive reward example
	{
		id: "reward-16",
		campaignId: "campaign-1",
		name: "Limited Edition NFT",
		description: "Exclusive NFT collectible for top supporters",
		type: "custom",
		value: "Unique NFT",
		tier: 8,
		triggerType: "referral_count",
		triggerValue: 100,
		status: "inactive",
		inventory: 10,
		expiryDate: undefined,
		deliveryMethod: "api_webhook",
		createdAt: new Date("2024-09-20T10:00:00Z"),
	},
];

// Mock Rewards Earned
export const mockRewardsEarned: RewardEarned[] = [
	{
		id: "earned-1",
		userId: "wuser-1",
		rewardId: "reward-1",
		status: "delivered",
		earnedAt: new Date("2024-09-16T08:20:00Z"),
		deliveredAt: new Date("2024-09-16T08:25:00Z"),
		redeemedAt: undefined,
		expiresAt: undefined,
		deliveryDetails: {
			instructions: "Badge has been added to your profile",
		},
	},
	{
		id: "earned-2",
		userId: "wuser-1",
		rewardId: "reward-2",
		status: "delivered",
		earnedAt: new Date("2024-09-25T11:50:00Z"),
		deliveredAt: new Date("2024-09-25T12:00:00Z"),
		redeemedAt: undefined,
		expiresAt: new Date("2026-12-31T23:59:59Z"),
		deliveryDetails: {
			code: "EARLY20-EMMA-2025",
			instructions: "Use this code at checkout to get 20% off your first year",
		},
	},
	{
		id: "earned-3",
		userId: "wuser-1",
		rewardId: "reward-3",
		status: "delivered",
		earnedAt: new Date("2024-10-05T14:30:00Z"),
		deliveredAt: new Date("2024-10-05T14:35:00Z"),
		redeemedAt: new Date("2024-11-01T10:00:00Z"),
		expiresAt: undefined,
		deliveryDetails: {
			code: "PREMIUM3M-EMMA",
			instructions: "Your account has been upgraded to Premium for 3 months",
		},
	},
	{
		id: "earned-4",
		userId: "wuser-1",
		rewardId: "reward-4",
		status: "earned",
		earnedAt: new Date("2024-10-20T16:45:00Z"),
		deliveredAt: undefined,
		redeemedAt: undefined,
		expiresAt: undefined,
		deliveryDetails: undefined,
	},
	{
		id: "earned-5",
		userId: "wuser-2",
		rewardId: "reward-1",
		status: "delivered",
		earnedAt: new Date("2024-09-17T14:35:00Z"),
		deliveredAt: new Date("2024-09-17T14:40:00Z"),
		redeemedAt: undefined,
		expiresAt: undefined,
		deliveryDetails: {
			instructions: "Badge has been added to your profile",
		},
	},
	{
		id: "earned-6",
		userId: "wuser-2",
		rewardId: "reward-2",
		status: "delivered",
		earnedAt: new Date("2024-09-28T10:00:00Z"),
		deliveredAt: new Date("2024-09-28T10:05:00Z"),
		redeemedAt: new Date("2024-11-01T10:00:00Z"),
		expiresAt: new Date("2026-12-31T23:59:59Z"),
		deliveryDetails: {
			code: "EARLY20-JAMES-2025",
			instructions: "Use this code at checkout to get 20% off your first year",
		},
	},
	{
		id: "earned-7",
		userId: "wuser-2",
		rewardId: "reward-3",
		status: "redeemed",
		earnedAt: new Date("2024-10-10T12:20:00Z"),
		deliveredAt: new Date("2024-10-10T12:25:00Z"),
		redeemedAt: new Date("2024-11-01T10:00:00Z"),
		expiresAt: undefined,
		deliveryDetails: {
			code: "PREMIUM3M-JAMES",
			instructions: "Your account has been upgraded to Premium for 3 months",
		},
	},
	{
		id: "earned-8",
		userId: "wuser-13",
		rewardId: "reward-11",
		status: "redeemed",
		earnedAt: new Date("2024-08-11T10:05:00Z"),
		deliveredAt: new Date("2024-08-11T10:10:00Z"),
		redeemedAt: new Date("2024-09-01T08:00:00Z"),
		expiresAt: undefined,
		deliveryDetails: {
			instructions: "Beta access has been activated on your account",
		},
	},
	{
		id: "earned-9",
		userId: "wuser-13",
		rewardId: "reward-12",
		status: "delivered",
		earnedAt: new Date("2024-08-20T15:30:00Z"),
		deliveredAt: new Date("2024-08-20T15:35:00Z"),
		redeemedAt: undefined,
		expiresAt: new Date("2026-12-31T23:59:59Z"),
		deliveryDetails: {
			code: "PRO50-ALEX-AI",
			instructions: "Use this code to get 50% off Pro plan for one year",
		},
	},
	{
		id: "earned-10",
		userId: "wuser-13",
		rewardId: "reward-13",
		status: "delivered",
		earnedAt: new Date("2024-09-15T11:00:00Z"),
		deliveredAt: new Date("2024-09-15T11:05:00Z"),
		redeemedAt: undefined,
		expiresAt: undefined,
		deliveryDetails: {
			instructions:
				"Unlimited AI credits have been added to your account for 6 months",
		},
	},
	{
		id: "earned-11",
		userId: "wuser-12",
		rewardId: "reward-7",
		status: "delivered",
		earnedAt: new Date("2024-10-20T09:00:00Z"),
		deliveredAt: new Date("2024-10-20T09:05:00Z"),
		redeemedAt: undefined,
		expiresAt: undefined,
		deliveryDetails: {
			instructions: "Beta Tester badge added to your profile",
		},
	},
	{
		id: "earned-12",
		userId: "wuser-12",
		rewardId: "reward-8",
		status: "redeemed",
		earnedAt: new Date("2024-10-28T14:00:00Z"),
		deliveredAt: new Date("2024-10-28T14:05:00Z"),
		redeemedAt: new Date("2024-10-30T08:00:00Z"),
		expiresAt: undefined,
		deliveryDetails: {
			instructions: "Premium features unlocked for 6 months",
		},
	},
	{
		id: "earned-13",
		userId: "wuser-15",
		rewardId: "reward-2",
		status: "pending",
		earnedAt: new Date("2024-11-04T18:00:00Z"),
		deliveredAt: undefined,
		redeemedAt: undefined,
		expiresAt: new Date("2026-12-31T23:59:59Z"),
		deliveryDetails: undefined,
	},
	{
		id: "earned-14",
		userId: "wuser-4",
		rewardId: "reward-2",
		status: "expired",
		earnedAt: new Date("2024-09-22T09:20:00Z"),
		deliveredAt: new Date("2024-09-22T09:25:00Z"),
		redeemedAt: undefined,
		expiresAt: new Date("2024-10-22T23:59:59Z"),
		deliveryDetails: {
			code: "EARLY20-OLIVER-EXP",
			instructions: "This reward has expired",
		},
	},
	{
		id: "earned-15",
		userId: "wuser-1",
		rewardId: "reward-5",
		status: "revoked",
		earnedAt: new Date("2024-10-25T10:00:00Z"),
		deliveredAt: new Date("2024-10-25T10:05:00Z"),
		redeemedAt: undefined,
		expiresAt: undefined,
		deliveryDetails: {
			instructions: "This reward was revoked due to terms violation",
		},
	},
];

// Helper functions
export const getMockRewardById = (id: string): Reward | undefined => {
	return mockRewards.find((reward) => reward.id === id);
};

export const getMockRewardsByCampaign = (campaignId: string): Reward[] => {
	return mockRewards.filter((reward) => reward.campaignId === campaignId);
};

export const getMockRewardsByStatus = (status: Reward["status"]): Reward[] => {
	return mockRewards.filter((reward) => reward.status === status);
};

export const getMockRewardsByTier = (tier: number): Reward[] => {
	return mockRewards.filter((reward) => reward.tier === tier);
};

export const getMockRewardsByType = (type: Reward["type"]): Reward[] => {
	return mockRewards.filter((reward) => reward.type === type);
};

export const getMockRewardEarnedById = (
	id: string,
): RewardEarned | undefined => {
	return mockRewardsEarned.find((earned) => earned.id === id);
};

export const getMockRewardsEarnedByUser = (userId: string): RewardEarned[] => {
	return mockRewardsEarned.filter((earned) => earned.userId === userId);
};

export const getMockRewardsEarnedByReward = (
	rewardId: string,
): RewardEarned[] => {
	return mockRewardsEarned.filter((earned) => earned.rewardId === rewardId);
};

export const getMockRewardsEarnedByStatus = (
	status: RewardEarned["status"],
): RewardEarned[] => {
	return mockRewardsEarned.filter((earned) => earned.status === status);
};

// Mock rewards sorted by tier for display
export const mockRewardsSortedByTier = (campaignId: string): Reward[] => {
	return mockRewards
		.filter((reward) => reward.campaignId === campaignId)
		.sort((a, b) => a.tier - b.tier);
};

// Mock reward tiers overview
export const mockRewardTiersOverview = (campaignId: string) => {
	const rewards = getMockRewardsByCampaign(campaignId);
	return rewards.map((reward) => ({
		tier: reward.tier,
		name: reward.name,
		description: reward.description,
		triggerType: reward.triggerType,
		triggerValue: reward.triggerValue,
		isLocked: reward.status === "inactive",
		remaining: reward.inventory,
	}));
};

// Mock user progress towards rewards
export const mockUserRewardProgress = (
	userId: string,
	referralCount: number,
) => {
	const earnedRewards = getMockRewardsEarnedByUser(userId);
	const earnedRewardIds = earnedRewards.map((e) => e.rewardId);

	return mockRewards
		.filter((r) => r.status === "active")
		.map((reward) => ({
			reward,
			isEarned: earnedRewardIds.includes(reward.id),
			progress:
				reward.triggerType === "referral_count" && reward.triggerValue
					? Math.min((referralCount / reward.triggerValue) * 100, 100)
					: 100,
			remaining:
				reward.triggerType === "referral_count" && reward.triggerValue
					? Math.max(reward.triggerValue - referralCount, 0)
					: 0,
		}));
};
