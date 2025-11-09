import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta = {
	title: "ProtoDesignSystem/Feedback/EmptyState",
	component: EmptyState,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		icon: {
			control: "text",
			description: "RemixIcon name without ri- prefix",
		},
		title: {
			control: "text",
			description: "Title of the empty state",
		},
		description: {
			control: "text",
			description: "Description text",
		},
	},
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: "No items found",
		description: "There are no items to display at this time.",
	},
};

export const WithIcon: Story = {
	args: {
		icon: "inbox-line",
		title: "Your inbox is empty",
		description: "You have no new messages at this time.",
	},
};

export const WithAction: Story = {
	args: {
		icon: "folder-open-line",
		title: "No projects yet",
		description: "Get started by creating your first project.",
		action: {
			label: "Create Project",
			onClick: () => alert("Create project clicked"),
		},
	},
};

export const NoData: Story = {
	args: {
		icon: "database-2-line",
		title: "No data available",
		description:
			"We couldn't find any data matching your criteria. Try adjusting your filters.",
	},
};

export const NoResults: Story = {
	args: {
		icon: "search-line",
		title: "No results found",
		description: "Your search didn't match any items. Try different keywords.",
	},
};

export const NoConnection: Story = {
	args: {
		icon: "wifi-off-line",
		title: "No internet connection",
		description: "Please check your connection and try again.",
		action: {
			label: "Retry",
			onClick: () => alert("Retry clicked"),
		},
	},
};
