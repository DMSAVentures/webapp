/**
 * CampaignCard Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { createElement } from "react";
import type { Campaign } from "@/types/campaign";
import { CampaignCard } from "./component";

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
	title: "Features/Campaigns/CampaignCard",
	component: CampaignCard,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		campaign: {
			description: "Campaign data to display",
			control: "object",
		},
		showStats: {
			description: "Show campaign statistics",
			control: "boolean",
		},
		onClick: {
			description: "Click handler for the card",
			action: "clicked",
		},
	},
} satisfies Meta<typeof CampaignCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default campaign card
 */
export const Default: Story = {
	args: {
		campaign: mockCampaigns[0],
		showStats: false,
	},
};

/**
 * Campaign card with statistics
 */
export const WithStats: Story = {
	args: {
		campaign: mockCampaigns[0],
		showStats: true,
	},
};

/**
 * Campaign card with click handler
 */
export const WithClickHandler: Story = {
	args: {
		campaign: mockCampaigns[0],
		showStats: true,
		onClick: () => console.log("Card clicked"),
	},
};

/**
 * Active campaign
 */
export const ActiveCampaign: Story = {
	args: {
		campaign: mockCampaignsByStatus.active[0],
		showStats: true,
	},
};

/**
 * Draft campaign
 */
export const DraftCampaign: Story = {
	args: {
		campaign: mockCampaignsByStatus.draft[0],
		showStats: true,
	},
};

/**
 * Paused campaign
 */
export const PausedCampaign: Story = {
	args: {
		campaign: mockCampaignsByStatus.paused[0],
		showStats: true,
	},
};

/**
 * Completed campaign
 */
export const CompletedCampaign: Story = {
	args: {
		campaign: mockCampaignsByStatus.completed[0],
		showStats: true,
	},
};

/**
 * High performance campaign (viral)
 */
export const HighPerformance: Story = {
	args: {
		campaign: mockCampaigns[3], // AI Writing Assistant - viral stats
		showStats: true,
	},
};

/**
 * Early stage campaign
 */
export const EarlyStage: Story = {
	args: {
		campaign: mockCampaigns[2], // E-commerce Platform - early stage
		showStats: true,
	},
};

/**
 * Campaign without description
 */
export const NoDescription: Story = {
	args: {
		campaign: createMockCampaign({ description: undefined }),
		showStats: true,
	},
};

/**
 * Multiple cards in a grid
 */
export const GridLayout: Story = {
	args: {
		campaign: mockCampaigns[0],
		showStats: true,
	},
	render: () =>
		createElement(
			"div",
			{
				style: {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
					gap: "16px",
					padding: "16px",
				},
			},
			mockCampaigns.slice(0, 4).map((campaign) =>
				createElement(CampaignCard, {
					key: campaign.id,
					campaign,
					showStats: true,
				}),
			),
		),
};
