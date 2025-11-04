import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import CheckboxCard from "@/components/simpleui/checkbox/checkboxcard";

const meta: Meta = {
	title: "SimpleUI/CheckboxCard",
	component: CheckboxCard,
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
		badgeString: { control: "text" },
		badgeColour: {
			control: "select",
			options: ["blue", "green", "red", "yellow"],
		},
		text: { control: "text" },
		subText: { control: "text" },
		description: { control: "text" },
		flipCheckboxToRight: { control: "boolean" },
		required: { control: "boolean" },
		imageSrc: { control: "text" },
		centeredImage: { control: "boolean" },
	},
	args: { onClick: fn() },
} satisfies Meta<typeof CheckboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallCheckedWithLabel: Story = {
	args: {
		disabled: false,
		text: "Label",
		checked: "checked",
		badgeString: "Badge",
		flipCheckboxToRight: false,
		description: "Description",
		subText: "Subtext",
		required: false,
		imageSrc: "https://placehold.co/150",
	},
};

export const SmallCheckedWithLabelWithLongDescription: Story = {
	args: {
		size: "small",
		disabled: false,
		checked: "checked",
		subLabel: true,
		badge: true,
		badgeString: "Badge",
		linkButton: true,
		text: "Email Notifications",
		subText: "Priority",
		description:
			"Receive email notifications for all priority alerts. This includes alerts for all high and medium priority incidents.",
		linkTitle: "Link",
		linkHref: "https://www.google.com",
		flipCheckboxToRight: false,
		imageSrc: "https://placehold.co/150",
	},
};

export const CheckboxDisabledWithLabel: Story = {
	args: {
		size: "small",
		disabled: true,
		checked: "checked",
		subLabel: true,
		badge: true,
		badgeString: "Badge",
		text: "Email Notifications",
		subText: "Priority",
		description:
			"Receive email notifications for all priority alerts. This includes alerts for all high and medium priority incidents.",
		linkTitle: "Link",
		linkHref: "https://www.google.com",
		flipCheckboxToRight: false,
		imageSrc: "https://placehold.co/150",
	},
};
