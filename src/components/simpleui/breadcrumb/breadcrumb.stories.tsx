import { Meta, type StoryObj } from "@storybook/react";
import Breadcrumb from "@/components/simpleui/breadcrumb/breadcrumb";
import BreadcrumbItem from "@/components/simpleui/breadcrumb/breadcrumbitem";

const meta: Meta = {
	title: "SimpleUI/Breadcrumb",
	component: Breadcrumb,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		items: { control: "object" },
		divider: { control: "select", options: ["arrow", "dot", "slash"] },
	},
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
	args: {
		items: [
			<BreadcrumbItem key={"breadcrumb-1"} state={"active"}>
				Home
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-2"} state={"default"}>
				Library
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-3"} state={"default"}>
				Data
			</BreadcrumbItem>,
		],
		divider: "arrow",
	},
};

export const WithDotDivider: Story = {
	args: {
		items: [
			<BreadcrumbItem key={"breadcrumb-1"} state={"active"}>
				Home
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-2"} state={"default"}>
				Library
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-3"} state={"default"}>
				Data
			</BreadcrumbItem>,
		],
		divider: "dot",
	},
};

export const WithSlashDivider: Story = {
	args: {
		items: [
			<BreadcrumbItem key={"breadcrumb-1"} state={"active"}>
				Home
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-2"} state={"default"}>
				Library
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-3"} state={"default"}>
				Data
			</BreadcrumbItem>,
		],
		divider: "slash",
	},
};

export const TooManyItems: Story = {
	args: {
		items: [
			<BreadcrumbItem key={"breadcrumb-1"} state={"active"}>
				Home
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-2"} state={"default"}>
				Library
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-3"} state={"default"}>
				Data
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-1"} state={"active"}>
				Home
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-2"} state={"default"}>
				Library
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-3"} state={"default"}>
				Data
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-1"} state={"active"}>
				Home
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-2"} state={"default"}>
				Library
			</BreadcrumbItem>,
			<BreadcrumbItem key={"breadcrumb-3"} state={"default"}>
				Data
			</BreadcrumbItem>,
		],
		divider: "arrow",
	},
};
