import type { Meta, StoryObj } from "@storybook/react";
import { TemplateSelector } from "./component";

const meta = {
	title: "FormBuilder/TemplateSelector",
	component: TemplateSelector,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		selectedTemplateId: {
			control: "select",
			options: [
				undefined,
				"clean-minimal",
				"dark-elegance",
				"bold-vibrant",
				"soft-rounded",
				"corporate-professional",
				"ocean-breeze",
				"midnight-pro",
			],
			description: "Currently selected template ID",
		},
		onTemplateSelect: {
			action: "onTemplateSelect",
			description: "Callback when a template is selected",
		},
	},
} satisfies Meta<typeof TemplateSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		selectedTemplateId: undefined,
	},
};

export const WithSelection: Story = {
	args: {
		selectedTemplateId: "clean-minimal",
	},
};

export const DarkSelected: Story = {
	args: {
		selectedTemplateId: "dark-elegance",
	},
};

export const BoldSelected: Story = {
	args: {
		selectedTemplateId: "bold-vibrant",
	},
};
