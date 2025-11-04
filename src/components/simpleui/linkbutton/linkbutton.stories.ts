import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Linkbutton from "@/components/simpleui/linkbutton/linkbutton";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "SimpleUI/Linkbutton",
	component: Linkbutton,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "gray", "neutral", "error"],
		},
		styleType: {
			control: "select",
			options: ["lighter"],
		},
		size: {
			control: "select",
			options: ["small", "medium"],
		},
		underline: { control: "boolean" },
		leftIcon: { control: "text" },
		rightIcon: { control: "text" },
		pickLeft: { control: "boolean" },
		pickRight: { control: "boolean" },
		children: { control: "text" },
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
} satisfies Meta<typeof Linkbutton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {
		variant: "primary",
		styleType: "lighter",
		size: "medium",
		children: "Button",
		href: "#",
	},
};

export const Neutral: Story = {
	args: {
		variant: "neutral",
		styleType: "lighter",
		href: "#",
		size: "medium",
		children: "Neutral Linkbutton",
	},
};

export const ErrorVariant: Story = {
	args: {
		variant: "error",
		styleType: "lighter",
		size: "medium",
		children: "Error Linkbutton",
		href: "#",
	},
};

export const Disabled: Story = {
	args: {
		variant: "primary",
		styleType: "lighter",
		disabled: true,
		size: "medium",
		children: "Disabled Linkbutton",
		href: "#",
	},
};

export const LeftIcon: Story = {
	args: {
		variant: "primary",
		styleType: "lighter",
		size: "medium",
		children: "Search",
		leftIcon: "send-plane-fill",
		href: "#",
	},
};

export const RightIcon: Story = {
	args: {
		variant: "primary",
		styleType: "lighter",
		size: "medium",
		children: "Send",
		rightIcon: "send-plane-fill",
		href: "#",
	},
};
