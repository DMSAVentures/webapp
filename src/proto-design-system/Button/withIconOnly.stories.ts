import type { Meta, StoryObj } from "@storybook/react";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";

// Storybook metadata and configuration
const meta: Meta<typeof IconOnlyButton> = {
	title: "SimpleUI/IconOnlyButton",
	component: IconOnlyButton,
	parameters: {
		layout: "centered",
	},
	argTypes: {
		iconClass: {
			control: "select",
			options: [
				"search-line",
				"send-plane-fill",
				"heart-fill",
				"star-line",
				"settings-2-line",
			], // Add more options as needed from Remix Icon
		},
		variant: {
			control: "select",
			options: ["primary", "secondary"],
		},
		disabled: { control: "boolean" },
	},
	args: {
		variant: "primary",
		disabled: false,
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		iconClass: "search-line",
	},
};

export const Secondary: Story = {
	args: {
		iconClass: "send-plane-fill",
		variant: "secondary",
	},
};

export const Disabled: Story = {
	args: {
		iconClass: "settings-2-line",
		disabled: true,
	},
};
