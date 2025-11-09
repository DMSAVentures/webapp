/**
 * CampaignForm Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { mockCampaigns } from "@/mocks/campaigns.mock";
import { CampaignForm } from "./component";

const meta = {
	title: "Features/Campaigns/CampaignForm",
	component: CampaignForm,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		initialData: {
			description: "Initial form data for editing",
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
} satisfies Meta<typeof CampaignForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Create new campaign form
 */
export const Create: Story = {
	args: {
		submitText: "Create Campaign",
		onSubmit: async (data) => {
			console.log("Creating campaign:", data);
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Edit existing campaign form
 */
export const Edit: Story = {
	args: {
		initialData: {
			name: mockCampaigns[0].name,
			description: mockCampaigns[0].description,
			settings: mockCampaigns[0].settings,
		},
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating campaign:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Form with minimal settings
 */
export const MinimalSettings: Story = {
	args: {
		initialData: {
			settings: {
				emailVerificationRequired: false,
				duplicateHandling: "allow",
				enableReferrals: false,
				enableRewards: false,
			},
		},
		submitText: "Create Campaign",
		onSubmit: async (data) => {
			console.log("Creating campaign:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Form without cancel button
 */
export const NoCancel: Story = {
	args: {
		submitText: "Create Campaign",
		onSubmit: async (data) => {
			console.log("Creating campaign:", data);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		},
	},
};

/**
 * Loading state
 */
export const Loading: Story = {
	args: {
		initialData: {
			name: "My Campaign",
			description: "Loading...",
		},
		submitText: "Create Campaign",
		loading: true,
		onSubmit: async () => {
			// Loading state - no action needed
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Form with validation errors (pre-filled)
 */
export const WithErrors: Story = {
	args: {
		initialData: {
			name: "Ab", // Too short (min 3 chars)
			description: "",
		},
		submitText: "Create Campaign",
		onSubmit: async (data) => {
			console.log("Submitting:", data);
			// This will trigger validation
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Fully configured form
 */
export const FullyConfigured: Story = {
	args: {
		initialData: {
			name: "AI Product Launch 2025",
			description:
				"Building anticipation for our revolutionary AI-powered product. Join our exclusive waitlist to be among the first to experience the future of automation.",
			settings: {
				emailVerificationRequired: true,
				duplicateHandling: "block",
				enableReferrals: true,
				enableRewards: true,
			},
		},
		submitText: "Save Changes",
		onSubmit: async (data) => {
			console.log("Updating campaign:", data);
			await new Promise((resolve) => setTimeout(resolve, 1500));
		},
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Different duplicate handling options
 */
export const DuplicateHandlingBlock: Story = {
	args: {
		initialData: {
			name: "Campaign with Block Duplicates",
			settings: {
				emailVerificationRequired: true,
				duplicateHandling: "block",
				enableReferrals: true,
				enableRewards: true,
			},
		},
		submitText: "Create Campaign",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

export const DuplicateHandlingUpdate: Story = {
	args: {
		initialData: {
			name: "Campaign with Update Duplicates",
			settings: {
				emailVerificationRequired: true,
				duplicateHandling: "update",
				enableReferrals: true,
				enableRewards: true,
			},
		},
		submitText: "Create Campaign",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

export const DuplicateHandlingAllow: Story = {
	args: {
		initialData: {
			name: "Campaign with Allow Duplicates",
			settings: {
				emailVerificationRequired: true,
				duplicateHandling: "allow",
				enableReferrals: true,
				enableRewards: true,
			},
		},
		submitText: "Create Campaign",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
};

/**
 * Mobile responsive preview
 */
export const MobileView: Story = {
	args: {
		initialData: {
			name: "Mobile Campaign",
			description: "Testing mobile layout",
			settings: {
				emailVerificationRequired: true,
				duplicateHandling: "block",
				enableReferrals: true,
				enableRewards: true,
			},
		},
		submitText: "Create Campaign",
		onSubmit: async (data) => console.log("Submit:", data),
		onCancel: () => console.log("Cancelled"),
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
