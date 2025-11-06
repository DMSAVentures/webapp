/**
 * RewardTiers Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import {
	getMockRewardsByCampaign,
	mockRewards,
	mockRewardsSortedByTier,
} from "@/mocks/rewards.mock";
import { RewardTiers } from "./component";

const meta = {
	title: "Features/Rewards/RewardTiers",
	component: RewardTiers,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		campaignId: {
			description: "Campaign ID to fetch rewards for",
			control: "text",
		},
		currentUserProgress: {
			description: "Current user progress (referral count and next target)",
			control: "object",
		},
		rewards: {
			description: "Rewards data (if not provided, will be fetched)",
			control: "object",
		},
		loading: {
			description: "Loading state",
			control: "boolean",
		},
	},
} satisfies Meta<typeof RewardTiers>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default reward tiers display
 */
export const Default: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
	},
};

/**
 * With user progress - No referrals yet
 */
export const NoProgress: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 0,
			nextTierTarget: 3,
		},
	},
};

/**
 * With user progress - First tier unlocked
 */
export const FirstTierUnlocked: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 3,
			nextTierTarget: 5,
		},
	},
};

/**
 * With user progress - Multiple tiers unlocked
 */
export const MultipleTiersUnlocked: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 10,
			nextTierTarget: 25,
		},
	},
};

/**
 * With user progress - Almost at next tier
 */
export const AlmostAtNextTier: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 24,
			nextTierTarget: 25,
		},
	},
};

/**
 * With user progress - All tiers unlocked
 */
export const AllTiersUnlocked: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 100,
			nextTierTarget: 0,
		},
	},
};

/**
 * Campaign 2 - Fitness App rewards
 */
export const FitnessAppRewards: Story = {
	args: {
		campaignId: "campaign-2",
		rewards: mockRewardsSortedByTier("campaign-2"),
		currentUserProgress: {
			referralCount: 7,
			nextTierTarget: 10,
		},
	},
};

/**
 * Campaign 4 - AI Writing Assistant rewards
 */
export const AIWritingRewards: Story = {
	args: {
		campaignId: "campaign-4",
		rewards: mockRewardsSortedByTier("campaign-4"),
		currentUserProgress: {
			referralCount: 12,
			nextTierTarget: 15,
		},
	},
};

/**
 * Few rewards (2-3 tiers)
 */
export const FewRewards: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1").slice(0, 3),
		currentUserProgress: {
			referralCount: 1,
			nextTierTarget: 3,
		},
	},
};

/**
 * Single reward tier
 */
export const SingleReward: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [mockRewards[1]], // Just the discount reward
		currentUserProgress: {
			referralCount: 1,
			nextTierTarget: 3,
		},
	},
};

/**
 * Empty state - No rewards
 */
export const Empty: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [],
	},
};

/**
 * Loading state
 */
export const Loading: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [],
		loading: true,
	},
};

/**
 * Mix of active and inactive rewards
 */
export const MixedStatus: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [
			mockRewards[0], // Active
			mockRewards[1], // Active
			mockRewards[15], // Inactive
			mockRewards[2], // Active
		].sort((a, b) => a.tier - b.tier),
		currentUserProgress: {
			referralCount: 4,
			nextTierTarget: 5,
		},
	},
};

/**
 * Rewards with various trigger types
 */
export const VariousTriggers: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [
			mockRewards[0], // Position trigger
			mockRewards[1], // Referral count
			mockRewards[2], // Referral count
			mockRewards[14], // Manual trigger
		].sort((a, b) => a.tier - b.tier),
		currentUserProgress: {
			referralCount: 3,
			nextTierTarget: 5,
		},
	},
};

/**
 * Rewards with inventory limits
 */
export const WithInventory: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [
			mockRewards[3], // 50 inventory
			mockRewards[4], // 10 inventory
			mockRewards[5], // 25 inventory
		].sort((a, b) => a.tier - b.tier),
		currentUserProgress: {
			referralCount: 12,
			nextTierTarget: 25,
		},
	},
};

/**
 * Rewards with expiry dates
 */
export const WithExpiryDates: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [
			mockRewards[1], // Has expiry
			mockRewards[5], // Has expiry
			mockRewards[14], // Has expiry
		].sort((a, b) => a.tier - b.tier),
		currentUserProgress: {
			referralCount: 5,
			nextTierTarget: 25,
		},
	},
};

/**
 * High progress user (power referrer)
 */
export const PowerReferrer: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 45,
			nextTierTarget: 50,
		},
	},
};

/**
 * Low progress user (just started)
 */
export const JustStarted: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 1,
			nextTierTarget: 3,
		},
	},
};

/**
 * Without user progress (public view)
 */
export const PublicView: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
	},
};

/**
 * Different reward types showcase
 */
export const AllRewardTypes: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [
			mockRewards[0], // Custom
			mockRewards[1], // Discount
			mockRewards[2], // Early Access
			mockRewards[3], // Premium Feature
			mockRewards[5], // Merchandise
		].sort((a, b) => a.tier - b.tier),
		currentUserProgress: {
			referralCount: 8,
			nextTierTarget: 10,
		},
	},
};

/**
 * Delivery methods variety
 */
export const DeliveryMethods: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [
			mockRewards[0], // Dashboard
			mockRewards[1], // Email
			mockRewards[3], // Dashboard
			{
				...mockRewards[4],
				deliveryMethod: "api_webhook" as const,
			},
		].sort((a, b) => a.tier - b.tier),
		currentUserProgress: {
			referralCount: 15,
			nextTierTarget: 25,
		},
	},
};

/**
 * Long reward names and descriptions
 */
export const LongContent: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: [
			{
				...mockRewards[0],
				name: "Extremely Long Reward Name That Might Wrap To Multiple Lines In The Display",
				description:
					"This is an incredibly detailed description that explains every single aspect of this reward in great detail, including all the benefits, terms, conditions, and special features that come with it. It might be quite long and should wrap properly.",
			},
			mockRewards[1],
			{
				...mockRewards[2],
				value:
					"Really Long Value Description: 3 months of premium access plus bonus features and additional perks",
			},
		].sort((a, b) => a.tier - b.tier),
		currentUserProgress: {
			referralCount: 3,
			nextTierTarget: 5,
		},
	},
};

/**
 * Mobile responsive preview
 */
export const MobileView: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1").slice(0, 4),
		currentUserProgress: {
			referralCount: 5,
			nextTierTarget: 10,
		},
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};

/**
 * Tablet responsive preview
 */
export const TabletView: Story = {
	args: {
		campaignId: "campaign-1",
		rewards: mockRewardsSortedByTier("campaign-1"),
		currentUserProgress: {
			referralCount: 8,
			nextTierTarget: 10,
		},
	},
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
};
