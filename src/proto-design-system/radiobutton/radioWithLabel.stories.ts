import { Meta, type StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import RadioWithLabel from "@/proto-design-system/radiobutton/radioWithLabel";

const meta: Meta = {
	title: "SimpleUI/RadioWithLabel",
	component: RadioWithLabel,
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
		subText: { control: "boolean" },
		badgeString: { control: "text" },
		linkHref: { control: "boolean" },
		text: { control: "text" },
		description: { control: "text" },
		linkTitle: { control: "text" },
		flipRadioToRight: { control: "boolean" },
	},
	args: { onClick: fn() },
} satisfies Meta<typeof RadioWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallCheckedWithLabel: Story = {
	args: {
		size: "small",
		disabled: false,
		checked: "checked",
		badgeString: "Badge",
		text: "Label",
		subText: "Sublabel",
		description: "Description",
		linkTitle: "Link",
		linkHref: "https://www.google.com",
		flipRadioToRight: false,
	},
};

export const SmallCheckedWithLabelWithLongDescription: Story = {
	args: {
		size: "small",
		disabled: false,
		checked: "checked",
		badgeString: "Badge",
		text: "Label",
		subText: "Sublabel",
		description:
			"Receive email notifications for all priority alerts. This includes alerts for all high and medium priority incidents.",
		linkTitle: "Link",
		linkHref: "https://www.google.com",
		flipRadioToRight: false,
	},
};

export const RadioDisabledWithLabel: Story = {
	args: {
		size: "small",
		disabled: true,
		checked: "checked",
		badgeString: "Badge",
		text: "Label",
		subText: "Sublabel",
		description: "Description",
		linkTitle: "Link",
		linkHref: "https://www.google.com",
		flipRadioToRight: false,
	},
};
