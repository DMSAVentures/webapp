import { Meta, type StoryObj } from "@storybook/react";
import BreadcrumbItem from "@/proto-design-system/breadcrumb/breadcrumbitem";

const meta: Meta = {
	title: "SimpleUI/Breadcrumb Item",
	component: BreadcrumbItem,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		state: { control: "select", options: ["default", "active", "disabled"] },
		// text: { control: 'text' },
		children: { control: "text" },
		icon: { control: "text" },
	},
} satisfies Meta<typeof BreadcrumbItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: React.ComponentProps<typeof BreadcrumbItem>) => (
	<BreadcrumbItem {...args} />
);

export const Primary: Story = {
	render: Template,
	args: {
		state: "default",
		children: "Text",
	},
};

export const WithTextAndIcon: Story = {
	render: Template,

	args: {
		state: "default",
		children: "Text",
		icon: "ri-home-line",
	},
};

export const Disabled: Story = {
	render: Template,
	args: {
		state: "disabled",
		children: "Text",
		icon: "ri-home-line",
	},
};
