import { Meta, type StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Banner from "@/proto-design-system/banner/banner";

const meta: Meta = {
	title: "SimpleUI/Banner",
	component: Banner,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		bannerType: {
			control: "select",
			options: ["success", "error", "warning", "info", "feature"],
		},
		variant: {
			control: "select",
			options: ["filled", "light", "lighter", "stroke"],
		},
		alertTitle: {
			control: "text",
		},
		linkTitle: {
			control: "text",
		},
		linkHref: {
			control: "text",
		},
		alertDescription: {
			control: "text",
		},
	},
	args: { onClick: fn() },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
	args: {
		bannerType: "success",
		variant: "filled",
		alertTitle: "Success",
		alertDescription: "This is a success message",
		linkTitle: "Learn more",
		linkHref: "https://www.google.com",
	},
};

export const Light: Story = {
	args: {
		bannerType: "error",
		variant: "light",
		alertTitle: "Error",
		alertDescription: "This is an error message",
		linkTitle: "Learn more",
		linkHref: "https://www.google.com",
	},
};

export const Lighter: Story = {
	args: {
		bannerType: "warning",
		variant: "lighter",
		alertTitle: "Warning",
		alertDescription: "This is a warning message",
		linkTitle: "Learn more",
		linkHref: "https://www.google.com",
	},
};

export const Stroke: Story = {
	args: {
		bannerType: "info",
		variant: "stroke",
		alertTitle: "Info",
		alertDescription: "This is an info message",
		linkTitle: "Learn more",
		linkHref: "https://www.google.com",
	},
};
