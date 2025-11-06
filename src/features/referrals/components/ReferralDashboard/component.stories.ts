import type { Meta, StoryObj } from "@storybook/react";
import { ReferralDashboard, ReferralData } from "./component";

const meta = {
	title: "Features/Referrals/ReferralDashboard",
	component: ReferralDashboard,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		userId: {
			control: "text",
			description: "User ID to display referral data for",
		},
		campaignId: {
			control: "text",
			description: "Campaign ID for the referral program",
		},
		pollingInterval: {
			control: "number",
			description: "Polling interval in milliseconds",
		},
	},
} satisfies Meta<typeof ReferralDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock referral data for different scenarios
const mockDataNewUser: ReferralData = {
	referralCode: "NEWUSER123",
	referralCount: 0,
	position: 1500,
	totalUsers: 2000,
	percentile: 75,
	nextRewardTier: {
		name: "Bronze Badge",
		requiredReferrals: 5,
		reward: "Exclusive early access",
	},
	currentPoints: 0,
};

const mockDataActiveUser: ReferralData = {
	referralCode: "ACTIVE456",
	referralCount: 12,
	position: 123,
	totalUsers: 5432,
	percentile: 2,
	nextRewardTier: {
		name: "Gold Badge",
		requiredReferrals: 25,
		reward: "50% discount on premium plan",
	},
	currentPoints: 120,
};

const mockDataPowerUser: ReferralData = {
	referralCode: "POWER789",
	referralCount: 87,
	position: 5,
	totalUsers: 10000,
	percentile: 1,
	nextRewardTier: {
		name: "Diamond Badge",
		requiredReferrals: 100,
		reward: "Lifetime premium access",
	},
	currentPoints: 870,
};

const mockDataAlmostReward: ReferralData = {
	referralCode: "ALMOST999",
	referralCount: 23,
	position: 250,
	totalUsers: 5000,
	percentile: 5,
	nextRewardTier: {
		name: "Gold Badge",
		requiredReferrals: 25,
		reward: "50% discount on premium plan",
	},
	currentPoints: 230,
};

const mockDataNoReward: ReferralData = {
	referralCode: "NOREWARD111",
	referralCount: 150,
	position: 1,
	totalUsers: 8000,
	percentile: 1,
	currentPoints: 1500,
};

/**
 * Default ReferralDashboard for a new user with no referrals yet
 */
export const NewUser: Story = {
	args: {
		userId: "user123",
		campaignId: "campaign123",
		initialData: mockDataNewUser,
	},
};

/**
 * ReferralDashboard for an active user with some referrals
 */
export const ActiveUser: Story = {
	args: {
		userId: "user456",
		campaignId: "campaign123",
		initialData: mockDataActiveUser,
	},
};

/**
 * ReferralDashboard for a power user with many referrals
 */
export const PowerUser: Story = {
	args: {
		userId: "user789",
		campaignId: "campaign123",
		initialData: mockDataPowerUser,
	},
};

/**
 * ReferralDashboard for a user almost reaching next reward
 */
export const AlmostAtReward: Story = {
	args: {
		userId: "user999",
		campaignId: "campaign123",
		initialData: mockDataAlmostReward,
	},
};

/**
 * ReferralDashboard for top user with no next reward tier
 */
export const NoNextReward: Story = {
	args: {
		userId: "user111",
		campaignId: "campaign123",
		initialData: mockDataNoReward,
	},
};

/**
 * ReferralDashboard with first referral
 */
export const FirstReferral: Story = {
	args: {
		userId: "userfirst",
		campaignId: "campaign123",
		initialData: {
			referralCode: "FIRST001",
			referralCount: 1,
			position: 800,
			totalUsers: 2000,
			percentile: 40,
			nextRewardTier: {
				name: "Bronze Badge",
				requiredReferrals: 5,
				reward: "Exclusive early access",
			},
			currentPoints: 10,
		},
	},
};

/**
 * ReferralDashboard in mobile view
 */
export const MobileView: Story = {
	args: {
		userId: "usermobile",
		campaignId: "campaign123",
		initialData: mockDataActiveUser,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};

/**
 * ReferralDashboard with high position
 */
export const HighPosition: Story = {
	args: {
		userId: "userhigh",
		campaignId: "campaign123",
		initialData: {
			referralCode: "HIGH555",
			referralCount: 156,
			position: 2,
			totalUsers: 15000,
			percentile: 1,
			nextRewardTier: {
				name: "Platinum Badge",
				requiredReferrals: 200,
				reward: "VIP status + exclusive merchandise",
			},
			currentPoints: 1560,
		},
	},
};
