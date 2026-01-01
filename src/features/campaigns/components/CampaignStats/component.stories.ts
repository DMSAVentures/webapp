/**
 * CampaignStats Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { createElement } from "react";
import { mockCampaignStats } from "@/mocks/campaigns.mock";
import { CampaignStats } from "./component";

const meta = {
	title: "Features/Campaigns/CampaignStats",
	component: CampaignStats,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		stats: {
			description: "Campaign statistics to display",
			control: "object",
		},
		loading: {
			description: "Show loading state",
			control: "boolean",
		},
	},
} satisfies Meta<typeof CampaignStats>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * High performance campaign stats (viral)
 */
export const HighPerformance: Story = {
	args: {
		stats: mockCampaignStats.highPerformance,
	},
};

/**
 * Medium performance campaign stats
 */
export const MediumPerformance: Story = {
	args: {
		stats: mockCampaignStats.mediumPerformance,
	},
};

/**
 * Early stage campaign stats
 */
export const EarlyStage: Story = {
	args: {
		stats: mockCampaignStats.earlyStage,
	},
};

/**
 * Struggling campaign stats (sub-viral)
 */
export const Struggling: Story = {
	args: {
		stats: mockCampaignStats.struggling,
	},
};

/**
 * Viral campaign with exceptional stats
 */
export const Viral: Story = {
	args: {
		stats: mockCampaignStats.viral,
	},
};

/**
 * Loading state
 */
export const Loading: Story = {
	args: {
		stats: mockCampaignStats.highPerformance,
		loading: true,
	},
};

/**
 * Stats with different K-Factor values
 */
export const KFactorComparison: Story = {
	args: {
		stats: mockCampaignStats.viral,
	},
	render: () =>
		createElement(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column" as const,
					gap: "24px",
				},
			},
			createElement(
				"div",
				{ key: "viral" },
				createElement(
					"h3",
					{
						style: {
							marginBottom: "8px",
							fontSize: "14px",
							color: "#666",
						},
					},
					"Viral (K > 1)",
				),
				createElement(CampaignStats, { stats: mockCampaignStats.viral }),
			),
			createElement(
				"div",
				{ key: "sub-viral" },
				createElement(
					"h3",
					{
						style: {
							marginBottom: "8px",
							fontSize: "14px",
							color: "#666",
						},
					},
					"Sub-viral (K < 1)",
				),
				createElement(CampaignStats, { stats: mockCampaignStats.struggling }),
			),
		),
};

/**
 * Stats progression from early stage to viral
 */
export const ProgressionStory: Story = {
	args: {
		stats: mockCampaignStats.earlyStage,
	},
	render: () =>
		createElement(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column" as const,
					gap: "32px",
				},
			},
			createElement(
				"div",
				{ key: "early" },
				createElement(
					"h3",
					{
						style: {
							marginBottom: "12px",
							fontSize: "16px",
							fontWeight: 600,
							color: "#111",
						},
					},
					"Early Stage",
				),
				createElement(CampaignStats, { stats: mockCampaignStats.earlyStage }),
			),
			createElement(
				"div",
				{ key: "medium" },
				createElement(
					"h3",
					{
						style: {
							marginBottom: "12px",
							fontSize: "16px",
							fontWeight: 600,
							color: "#111",
						},
					},
					"Medium Performance",
				),
				createElement(CampaignStats, {
					stats: mockCampaignStats.mediumPerformance,
				}),
			),
			createElement(
				"div",
				{ key: "high" },
				createElement(
					"h3",
					{
						style: {
							marginBottom: "12px",
							fontSize: "16px",
							fontWeight: 600,
							color: "#111",
						},
					},
					"High Performance",
				),
				createElement(CampaignStats, {
					stats: mockCampaignStats.highPerformance,
				}),
			),
			createElement(
				"div",
				{ key: "viral" },
				createElement(
					"h3",
					{
						style: {
							marginBottom: "12px",
							fontSize: "16px",
							fontWeight: 600,
							color: "#111",
						},
					},
					"Viral Campaign",
				),
				createElement(CampaignStats, { stats: mockCampaignStats.viral }),
			),
		),
};
