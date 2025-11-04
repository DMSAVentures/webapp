import { Meta, StoryObj } from "@storybook/react";
import ProgressBarLine from "@/components/simpleui/progressbar/progressbar";

const meta: Meta = {
	title: "SimpleUI/ProgressBar",
	component: ProgressBarLine,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		progress: { control: "number" },
		variant: {
			control: "select",
			options: ["info", "success", "warning", "error"],
		},
		showPercentage: { control: "boolean" },
		size: { control: "select", options: ["small", "medium", "large"] },
	},
} satisfies Meta<typeof ProgressBarLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		progress: 50,
		size: "medium",
		variant: "info",
		showPercentage: true,
	},
};

export const Secondary: Story = {
	args: {
		progress: 75,
		size: "large",
		variant: "error",
	},
};
