import { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";

const meta: Meta = {
	title: "SimpleUI/Status Badge",
	component: StatusBadge,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		text: { control: "text" },
		variant: {
			control: "select",
			options: ["completed", "pending", "failed", "disabled"],
		},
		styleType: {
			control: "select",
			options: ["light", "stroke"],
		},
		icon: { control: "text" },
	},
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completed: Story = {
	args: {
		text: "Done",
		variant: "completed",
		styleType: "light",
	},
};
