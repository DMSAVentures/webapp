/**
 * CampaignList Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import type { Campaign } from "@/types/campaign";
import { CampaignList } from "./component";

// Create mock campaigns that match the @/types/campaign.Campaign interface
const createMockCampaign = (overrides: Partial<Campaign> = {}): Campaign => ({
	id: "campaign-1",
	accountId: "account-1",
	name: "SaaS Product Launch 2025",
	slug: "saas-product-launch-2025",
	description:
		"Waitlist for our revolutionary project management tool launching Q2 2025",
	status: "active",
	type: "waitlist",
	totalSignups: 12547,
	totalVerified: 10234,
	totalReferrals: 8932,
	createdAt: new Date("2024-09-15T10:00:00Z"),
	updatedAt: new Date("2025-11-04T14:22:00Z"),
	...overrides,
});

const mockCampaigns: Campaign[] = [
	createMockCampaign(),
	createMockCampaign({
		id: "campaign-2",
		name: "Mobile App Beta Launch",
		slug: "mobile-app-beta",
		description: "Early access to our fitness tracking app",
		status: "active",
		totalSignups: 3421,
		totalVerified: 2567,
		totalReferrals: 1843,
	}),
	createMockCampaign({
		id: "campaign-3",
		name: "E-commerce Platform Pre-Launch",
		slug: "ecommerce-prelaunch",
		description: "Be the first to sell on our new marketplace",
		status: "draft",
		totalSignups: 234,
		totalVerified: 189,
		totalReferrals: 145,
	}),
	createMockCampaign({
		id: "campaign-4",
		name: "AI Writing Assistant Waitlist",
		slug: "ai-writing-assistant",
		description: "Join thousands waiting for the smartest writing tool",
		status: "active",
		totalSignups: 45782,
		totalVerified: 42109,
		totalReferrals: 38654,
	}),
	createMockCampaign({
		id: "campaign-5",
		name: "Newsletter Signup - Tech Weekly",
		slug: "tech-weekly-newsletter",
		description: "Weekly newsletter on startup and tech news",
		status: "paused",
		totalSignups: 89,
		totalVerified: 45,
		totalReferrals: 12,
	}),
	createMockCampaign({
		id: "campaign-6",
		name: "Conference 2026 Early Bird",
		slug: "conference-2026",
		description: "Secure your spot at the biggest tech conference",
		status: "completed",
		endDate: new Date("2025-09-30T18:00:00Z"),
		totalSignups: 3421,
		totalVerified: 2567,
		totalReferrals: 1843,
	}),
];

const mockCampaignsByStatus = {
	active: mockCampaigns.filter((c) => c.status === "active"),
	draft: mockCampaigns.filter((c) => c.status === "draft"),
	paused: mockCampaigns.filter((c) => c.status === "paused"),
	completed: mockCampaigns.filter((c) => c.status === "completed"),
};

const meta = {
	title: "Features/Campaigns/CampaignList",
	component: CampaignList,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		campaigns: {
			description: "Array of campaigns to display",
			control: "object",
		},
		view: {
			description: "View mode: list or grid",
			control: "select",
			options: ["list", "grid"],
		},
		showFilters: {
			description: "Show filter controls",
			control: "boolean",
		},
		showViewToggle: {
			description: "Show view toggle buttons",
			control: "boolean",
		},
		showStats: {
			description: "Show stats on campaign cards",
			control: "boolean",
		},
		loading: {
			description: "Show loading state",
			control: "boolean",
		},
		onCampaignClick: {
			description: "Campaign card click handler",
			action: "campaign clicked",
		},
		onEdit: {
			description: "Edit campaign handler",
			action: "edit clicked",
		},
		onDuplicate: {
			description: "Duplicate campaign handler",
			action: "duplicate clicked",
		},
		onDelete: {
			description: "Delete campaign handler",
			action: "delete clicked",
		},
		onCreateCampaign: {
			description: "Create campaign handler",
			action: "create campaign clicked",
		},
	},
} satisfies Meta<typeof CampaignList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default grid view with all campaigns
 */
export const Default: Story = {
	args: {
		campaigns: mockCampaigns,
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
	},
};

/**
 * List view
 */
export const ListView: Story = {
	args: {
		campaigns: mockCampaigns,
		view: "list",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
	},
};

/**
 * Without filters
 */
export const NoFilters: Story = {
	args: {
		campaigns: mockCampaigns,
		view: "grid",
		showFilters: false,
		showViewToggle: false,
		showStats: true,
	},
};

/**
 * Without stats on cards
 */
export const NoStats: Story = {
	args: {
		campaigns: mockCampaigns,
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: false,
	},
};

/**
 * Loading state
 */
export const Loading: Story = {
	args: {
		campaigns: mockCampaigns,
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
		loading: true,
	},
};

/**
 * Empty state (no campaigns)
 */
export const Empty: Story = {
	args: {
		campaigns: [],
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
	},
};

/**
 * Only active campaigns
 */
export const ActiveOnly: Story = {
	args: {
		campaigns: mockCampaignsByStatus.active,
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
	},
};

/**
 * Only draft campaigns
 */
export const DraftOnly: Story = {
	args: {
		campaigns: mockCampaignsByStatus.draft,
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
	},
};

/**
 * Few campaigns (2)
 */
export const FewCampaigns: Story = {
	args: {
		campaigns: mockCampaigns.slice(0, 2),
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
	},
};

/**
 * Many campaigns (with actions)
 */
export const WithActions: Story = {
	args: {
		campaigns: mockCampaigns,
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
		onCampaignClick: (campaign) => console.log("Clicked:", campaign.name),
		onEdit: (campaign) => console.log("Edit:", campaign.name),
		onDuplicate: (campaign) => console.log("Duplicate:", campaign.name),
		onDelete: (campaign) => console.log("Delete:", campaign.name),
		onCreateCampaign: () => console.log("Create new campaign"),
	},
};

/**
 * Compact layout (list view without stats)
 */
export const Compact: Story = {
	args: {
		campaigns: mockCampaigns,
		view: "list",
		showFilters: true,
		showViewToggle: true,
		showStats: false,
	},
};

/**
 * Mobile responsive preview
 */
export const MobileView: Story = {
	args: {
		campaigns: mockCampaigns.slice(0, 3),
		view: "grid",
		showFilters: true,
		showViewToggle: true,
		showStats: true,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
