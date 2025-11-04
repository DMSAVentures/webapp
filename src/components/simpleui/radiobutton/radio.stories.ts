import { Meta, type StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Radio from "@/components/simpleui/radiobutton/radio";

const meta: Meta = {
	title: "SimpleUI/Radio",
	component: Radio,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {},
	args: { onClick: fn() },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
	args: {
		disabled: false,
		checked: true,
	},
};
