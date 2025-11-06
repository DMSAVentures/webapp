import type { Meta, StoryObj } from "@storybook/react";
import { Caption } from "./caption";

const meta = {
	title: "ProtoDesignSystem/Typography/Caption",
	component: Caption,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		disabled: {
			control: "boolean",
			description: "Whether the caption is disabled",
		},
	},
} satisfies Meta<typeof Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Maximum 100 characters",
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled caption",
		disabled: true,
	},
};

export const HintText: Story = {
	args: {
		children: "This field is required",
	},
};

export const CharacterCount: Story = {
	args: {
		children: "45 / 100 characters",
	},
};
