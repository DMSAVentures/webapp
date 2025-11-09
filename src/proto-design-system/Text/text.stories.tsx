import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./text";

const meta = {
	title: "ProtoDesignSystem/Text",
	component: Text,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["label", "sublabel", "description", "caption"],
			description: "Visual variant of the text",
		},
		disabled: {
			control: "boolean",
			description: "Whether the text is disabled",
		},
		as: {
			control: "select",
			options: ["span", "p", "small", "div", "label"],
			description: "HTML element to render as",
		},
	},
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Label: Story = {
	args: {
		variant: "label",
		children: "This is a label",
	},
};

export const Sublabel: Story = {
	args: {
		variant: "sublabel",
		children: "This is a sublabel",
	},
};

export const Description: Story = {
	args: {
		variant: "description",
		children: "This is a description that provides additional context",
	},
};

export const Caption: Story = {
	args: {
		variant: "caption",
		children: "This is a caption or hint text",
	},
};

export const Disabled: Story = {
	args: {
		variant: "label",
		disabled: true,
		children: "Disabled text",
	},
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<Text variant="label">Label (13px, primary color)</Text>
			<Text variant="sublabel">Sublabel (12px, secondary color)</Text>
			<Text variant="description">
				Description (12px, secondary color) - Used for longer explanatory text
			</Text>
			<Text variant="caption">
				Caption (11px, tertiary color) - For hints and helper text
			</Text>
			<Text variant="label" disabled>
				Disabled Label
			</Text>
			<Text variant="sublabel" disabled>
				Disabled Sublabel
			</Text>
		</div>
	),
};

export const WithDifferentElements: Story = {
	render: () => (
		<div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
			<Text variant="label" as="label">
				Label element (semantic HTML for forms)
			</Text>
			<Text variant="description" as="p">
				Paragraph element for descriptions
			</Text>
			<Text variant="sublabel" as="small">
				Small element for sublabels
			</Text>
			<Text variant="caption" as="span">
				Span element for inline captions
			</Text>
		</div>
	),
};
