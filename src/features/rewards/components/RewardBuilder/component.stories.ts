/**
 * RewardBuilder Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { mockRewards } from "@/mocks/rewards.mock";
import { RewardBuilder } from "./component";

const meta = {
	title: "Features/Rewards/RewardBuilder",
	component: RewardBuilder,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		campaignId: {
			description: "Campaign ID this reward belongs to",
			control: "text",
		},
		initialData: {
			description: "Initial reward data for editing",
			control: "object",
		},
		onSubmit: {
			description: "Submit handler",
			action: "submitted",
		},
		onCancel: {
			description: "Cancel handler",
			action: "cancelled",
		},
		loading: {
			description: "Loading state",
			control: "boolean",
		},
		submitText: {
			description: "Submit button text",
			control: "text",
		},
	},
} satisfies Meta<typeof RewardBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Create new reward form
 */
export const Create: Story = {
	args: {
		campaignId: "campaign-1",
		submitText: "Create Reward",
		onSubmit: async (data) => {
			console.log("Creating reward:", data);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Edit existing reward - Early Access type
 */
export const EditEarlyAccess: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: mockRewards[2], // 3 Months Premium Free
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating reward:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Edit existing reward - Discount type
 */
export const EditDiscount: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: mockRewards[1], // 20% Launch Discount
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating reward:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Edit existing reward - Premium Feature type
 */
export const EditPremiumFeature: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: mockRewards[3], // Founder's Circle Access
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating reward:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Edit existing reward - Merchandise type
 */
export const EditMerchandise: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: mockRewards[5], // Exclusive Swag Pack
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating reward:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Edit existing reward - Custom type
 */
export const EditCustom: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: mockRewards[0], // Early Bird Badge
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating reward:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Reward with position trigger
 */
export const PositionTrigger: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Top 50 VIP Badge",
			description: "Exclusive badge for being in the top 50 on the waitlist",
			type: "custom",
			value: "VIP Badge + Special Perks",
			tier: 1,
			triggerType: "position",
			triggerValue: 50,
			deliveryMethod: "dashboard",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Reward with referral count trigger
 */
export const ReferralCountTrigger: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "5 Referrals Bonus",
			description: "Get a special bonus for referring 5 friends",
			type: "discount",
			value: "30% off",
			tier: 2,
			triggerType: "referral_count",
			triggerValue: 5,
			deliveryMethod: "email",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Reward with manual trigger
 */
export const ManualTrigger: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: mockRewards[14], // VIP Launch Event Invitation
		submitText: "Save Changes",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Reward with inventory limit
 */
export const WithInventory: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Limited Edition T-Shirt",
			description: "Only 50 available - exclusive branded t-shirt",
			type: "merchandise",
			value: "Premium t-shirt",
			tier: 3,
			triggerType: "referral_count",
			triggerValue: 10,
			inventory: 50,
			deliveryMethod: "email",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Reward with expiry date
 */
export const WithExpiry: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Holiday Special Discount",
			description: "Limited time offer - expires end of year",
			type: "discount",
			value: "40% off",
			tier: 2,
			triggerType: "referral_count",
			triggerValue: 3,
			expiryDate: new Date("2025-12-31"),
			deliveryMethod: "email",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * High tier reward (Tier 10)
 */
export const HighTierReward: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Ultimate Lifetime Access",
			description: "Lifetime access to all features and products",
			type: "premium_feature",
			value: "Lifetime Everything ($10,000 value)",
			tier: 10,
			triggerType: "referral_count",
			triggerValue: 100,
			inventory: 5,
			deliveryMethod: "api_webhook",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Form without cancel button
 */
export const NoCancel: Story = {
	args: {
		campaignId: "campaign-1",
		submitText: "Create Reward",
		onSubmit: async (data) => {
			console.log("Creating reward:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
	},
};

/**
 * Loading state
 */
export const Loading: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Sample Reward",
			description: "Loading...",
			type: "early_access",
			tier: 1,
			triggerType: "referral_count",
			triggerValue: 5,
			deliveryMethod: "email",
		},
		submitText: "Create Reward",
		loading: true,
		onSubmit: async () => {
			// Loading state - no action needed
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * All delivery methods showcase
 */
export const DeliveryMethodEmail: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Email Delivery Reward",
			description: "Reward code sent via email",
			type: "discount",
			value: "25% off",
			tier: 2,
			triggerType: "referral_count",
			triggerValue: 5,
			deliveryMethod: "email",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

export const DeliveryMethodDashboard: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Dashboard Delivery Reward",
			description: "Reward shown in user dashboard",
			type: "premium_feature",
			value: "Premium features unlocked",
			tier: 3,
			triggerType: "referral_count",
			triggerValue: 10,
			deliveryMethod: "dashboard",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

export const DeliveryMethodWebhook: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "API Webhook Delivery",
			description: "Automated delivery via webhook integration",
			type: "custom",
			value: "Custom integration reward",
			tier: 4,
			triggerType: "referral_count",
			triggerValue: 15,
			deliveryMethod: "api_webhook",
		},
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Complex reward with all options
 */
export const FullyConfigured: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: {
			name: "Ultimate VIP Package",
			description:
				"The ultimate reward package with lifetime access, exclusive events, and premium swag. Limited to only 10 lucky winners who refer 50 or more people.",
			type: "premium_feature",
			value: "Lifetime VIP + Events + Swag ($5,000 value)",
			tier: 8,
			triggerType: "referral_count",
			triggerValue: 50,
			inventory: 10,
			expiryDate: new Date("2025-12-31"),
			deliveryMethod: "email",
		},
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating reward:", data);
			await new Promise((resolve) => setTimeout(resolve, 1500));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Mobile responsive preview
 */
export const MobileView: Story = {
	args: {
		campaignId: "campaign-1",
		initialData: mockRewards[2],
		submitText: "Create Reward",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
