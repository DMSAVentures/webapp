import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import RadioCard from "@/components/simpleui/radiobutton/radiocard";

const meta: Meta = {
	title: "SimpleUI/RadioCard",
	component: RadioCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		badgeString: { control: "text" },
		text: { control: "text" },
		subText: { control: "text" },
		description: { control: "text" },
		imageSrc: { control: "text" },
		centeredImage: { control: "boolean" },
	},
	args: { onClick: fn() },
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		badgeString: "Badge",
		text: "Label",
		subText: "Sublabel",
		description: "Description",
		imageSrc: "https://placehold.co/150",
		centeredImage: false,
	},
};

export const Disabled: Story = {
	args: {
		badgeString: "Badge",
		text: "Label",
		subText: "Sublabel",
		description: "Description",
		imageSrc: "https://placehold.co/150",
		centeredImage: false,
		disabled: true,
	},
};
