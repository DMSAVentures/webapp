import type { Meta, StoryObj } from "@storybook/react";
import { Sublabel } from "./sublabel";

const meta = {
	title: "ProtoDesignSystem/Typography/Sublabel",
	component: Sublabel,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		disabled: {
			control: "boolean",
			description: "Whether the sublabel is disabled",
		},
	},
} satisfies Meta<typeof Sublabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Optional",
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled sublabel",
		disabled: true,
	},
};

export const LongText: Story = {
	args: {
		children:
			"This is a longer sublabel that provides additional context about the field",
	},
};
