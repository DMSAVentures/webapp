import { Meta, type StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Checkbox from "@/components/simpleui/checkbox/checkbox";

const meta: Meta = {
	title: "SimpleUI/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		disabled: { control: "boolean" },
		checked: {
			control: "select",
			options: ["checked", "unchecked", "indeterminate"],
		},
	},
	args: { onClick: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
	args: {
		disabled: false,
		checked: "checked",
	},
};

export const CheckedDisabled: Story = {
	args: {
		disabled: true,
		checked: "checked",
	},
};

export const UncheckedDisabled: Story = {
	args: {
		disabled: true,
		checked: "unchecked",
	},
};
