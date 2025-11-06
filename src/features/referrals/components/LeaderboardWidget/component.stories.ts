import type { Meta, StoryObj } from "@storybook/react";
import { mockLeaderboardEntries } from "@/mocks/referrals.mock";
import type { LeaderboardEntry } from "@/types/common.types";
import { LeaderboardWidget } from "./component";

// Use the first 10 entries from mock data
const mockLeaderboardData: LeaderboardEntry[] = mockLeaderboardEntries.slice(
	0,
	10,
);

const meta = {
	title: "Features/Referrals/LeaderboardWidget",
	component: LeaderboardWidget,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		campaignId: {
			control: "text",
			description: "Campaign ID to fetch leaderboard for",
		},
		limit: {
			control: "number",
			description: "Number of top users to display",
		},
		period: {
			control: "select",
			options: ["all_time", "daily", "weekly", "monthly"],
			description: "Time period for leaderboard",
		},
		highlightUserId: {
			control: "text",
			description: "User ID to highlight in the leaderboard",
		},
		pollingInterval: {
			control: "number",
			description: "Polling interval in milliseconds",
		},
	},
} satisfies Meta<typeof LeaderboardWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default LeaderboardWidget with top 10 users
 */
export const Default: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "all_time",
		initialData: mockLeaderboardData,
	},
};

/**
 * LeaderboardWidget highlighting current user in 5th place
 */
export const WithHighlightedUser: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "all_time",
		highlightUserId: "user5",
		initialData: mockLeaderboardData,
	},
};

/**
 * LeaderboardWidget showing daily period
 */
export const DailyPeriod: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "daily",
		initialData: mockLeaderboardData.slice(0, 5),
	},
};

/**
 * LeaderboardWidget showing weekly period
 */
export const WeeklyPeriod: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "weekly",
		initialData: mockLeaderboardData,
	},
};

/**
 * LeaderboardWidget showing monthly period
 */
export const MonthlyPeriod: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "monthly",
		initialData: mockLeaderboardData,
	},
};

/**
 * LeaderboardWidget with top 5 users only
 */
export const Top5Only: Story = {
	args: {
		campaignId: "campaign123",
		limit: 5,
		period: "all_time",
		initialData: mockLeaderboardData.slice(0, 5),
	},
};

/**
 * LeaderboardWidget with fewer entries
 */
export const FewEntries: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "all_time",
		initialData: mockLeaderboardData.slice(0, 3),
	},
};

/**
 * Empty LeaderboardWidget with no data
 */
export const Empty: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "all_time",
		initialData: [],
	},
};

/**
 * LeaderboardWidget with user in 1st place highlighted
 */
export const HighlightedFirstPlace: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "all_time",
		highlightUserId: "user1",
		initialData: mockLeaderboardData,
	},
};

/**
 * LeaderboardWidget with high referral counts
 */
export const HighReferrals: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "all_time",
		initialData: [
			{
				userId: "power1",
				rank: 1,
				name: "Super Influencer",
				referralCount: 5432,
				points: 54320,
				badges: ["top_referrer", "influencer", "champion", "consistent"],
			},
			{
				userId: "power2",
				rank: 2,
				name: "Mega Promoter",
				referralCount: 4321,
				points: 43210,
				badges: ["influencer", "champion", "rising_star"],
			},
			{
				userId: "power3",
				rank: 3,
				name: "Top Advocate",
				referralCount: 3210,
				points: 32100,
				badges: ["top_referrer", "consistent"],
			},
		],
	},
};

/**
 * Mobile view of LeaderboardWidget
 */
export const MobileView: Story = {
	args: {
		campaignId: "campaign123",
		limit: 10,
		period: "all_time",
		highlightUserId: "user3",
		initialData: mockLeaderboardData,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
