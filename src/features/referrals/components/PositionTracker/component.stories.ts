import type { Meta, StoryObj } from "@storybook/react";
import { PositionTracker } from "./component";

const meta = {
	title: "Features/Referrals/PositionTracker",
	component: PositionTracker,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		userId: {
			control: "text",
			description: "User ID to track position for",
		},
		pollingInterval: {
			control: "number",
			description: "Polling interval in milliseconds",
		},
		fetchPosition: {
			description: "Function to fetch position data",
		},
	},
} satisfies Meta<typeof PositionTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default PositionTracker showing a mid-range position
 */
export const Default: Story = {
	args: {
		userId: "user123",
		initialPosition: {
			position: 123,
			totalUsers: 5432,
			percentile: 2,
		},
	},
};

/**
 * PositionTracker showing top position
 */
export const TopPosition: Story = {
	args: {
		userId: "user1",
		initialPosition: {
			position: 1,
			totalUsers: 10000,
			percentile: 1,
		},
	},
};

/**
 * PositionTracker showing a very high position (top 1%)
 */
export const HighPosition: Story = {
	args: {
		userId: "user5",
		initialPosition: {
			position: 5,
			totalUsers: 8543,
			percentile: 1,
		},
	},
};

/**
 * PositionTracker showing middle position (top 50%)
 */
export const MiddlePosition: Story = {
	args: {
		userId: "user2500",
		initialPosition: {
			position: 2500,
			totalUsers: 5000,
			percentile: 50,
		},
	},
};

/**
 * PositionTracker showing lower position (top 90%)
 */
export const LowerPosition: Story = {
	args: {
		userId: "user4500",
		initialPosition: {
			position: 4500,
			totalUsers: 5000,
			percentile: 90,
		},
	},
};

/**
 * PositionTracker with small waitlist
 */
export const SmallWaitlist: Story = {
	args: {
		userId: "user42",
		initialPosition: {
			position: 42,
			totalUsers: 150,
			percentile: 28,
		},
	},
};

/**
 * PositionTracker with large waitlist
 */
export const LargeWaitlist: Story = {
	args: {
		userId: "user12345",
		initialPosition: {
			position: 12345,
			totalUsers: 98765,
			percentile: 12,
		},
	},
};

/**
 * PositionTracker showing improvement animation
 * (This would trigger in real usage when position improves via polling)
 */
export const WithImprovement: Story = {
	args: {
		userId: "user100",
		initialPosition: {
			position: 100,
			totalUsers: 5000,
			percentile: 2,
		},
	},
};

/**
 * Mobile view of PositionTracker
 */
export const MobileView: Story = {
	args: {
		userId: "user250",
		initialPosition: {
			position: 250,
			totalUsers: 3210,
			percentile: 8,
		},
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};
