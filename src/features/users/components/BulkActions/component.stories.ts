/**
 * BulkActions Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { BulkActions } from "./component";

const meta = {
	title: "Features/Users/BulkActions",
	component: BulkActions,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		selectedUserIds: {
			description: "Array of selected user IDs",
			control: "object",
		},
		onAction: {
			description: "Action handler",
			action: "action triggered",
		},
		onClearSelection: {
			description: "Clear selection handler",
			action: "selection cleared",
		},
	},
} satisfies Meta<typeof BulkActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Single user selected
 */
export const SingleUser: Story = {
	args: {
		selectedUserIds: ["wuser-1"],
	},
};

/**
 * Few users selected (3)
 */
export const FewUsers: Story = {
	args: {
		selectedUserIds: ["wuser-1", "wuser-2", "wuser-3"],
	},
};

/**
 * Many users selected (12)
 */
export const ManyUsers: Story = {
	args: {
		selectedUserIds: [
			"wuser-1",
			"wuser-2",
			"wuser-3",
			"wuser-4",
			"wuser-5",
			"wuser-6",
			"wuser-7",
			"wuser-8",
			"wuser-9",
			"wuser-10",
			"wuser-11",
			"wuser-12",
		],
	},
};

/**
 * Large selection (50)
 */
export const LargeSelection: Story = {
	args: {
		selectedUserIds: Array.from({ length: 50 }, (_, i) => `wuser-${i + 1}`),
	},
};

/**
 * Bulk selection (100+)
 */
export const BulkSelection: Story = {
	args: {
		selectedUserIds: Array.from({ length: 150 }, (_, i) => `wuser-${i + 1}`),
	},
};

/**
 * No selection (hidden state)
 */
export const NoSelection: Story = {
	args: {
		selectedUserIds: [],
	},
};

/**
 * With loading state simulation
 */
export const WithLoadingState: Story = {
	args: {
		selectedUserIds: ["wuser-1", "wuser-2", "wuser-3"],
		onAction: async (action) => {
			console.log(`Action: ${action}`);
			return new Promise((resolve) => setTimeout(resolve, 2000));
		},
	},
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
	args: {
		selectedUserIds: ["wuser-1", "wuser-2", "wuser-3", "wuser-4"],
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
};

/**
 * Tablet responsive view
 */
export const TabletView: Story = {
	args: {
		selectedUserIds: ["wuser-1", "wuser-2", "wuser-3", "wuser-4", "wuser-5"],
	},
	parameters: {
		viewport: {
			defaultViewport: "tablet",
		},
	},
};
