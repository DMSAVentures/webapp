import { Meta, StoryObj } from "@storybook/react";
import ButtonGroup, {
	ButtonItemProps,
} from "@/proto-design-system/buttongroup/buttongroup";
import ContentDivider from "@/proto-design-system/contentdivider/contentdivider";

const meta: Meta = {
	title: "SimpleUI/Content Divider",
	component: ContentDivider,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		size: { control: "select", options: ["thin", "thick"] },
		styleType: { control: "select", options: ["light", "gray"] },
		text: { control: "text" },
		buttonGroup: { control: "object" },
	},
} satisfies Meta<typeof ContentDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThinLine: Story = {
	args: {
		size: "thin",
	},
};

export const ThickLine: Story = {
	args: {
		size: "thick",
	},
};

export const ThinLineWithText: Story = {
	args: {
		size: "thin",
		text: "Text",
	},
};

export const BannerWithTextGrayDivider: Story = {
	args: {
		styleType: "gray",
		text: "Text",
	},
};

export const BannerWithTextLightDivider: Story = {
	args: {
		styleType: "light",
		text: "Text",
	},
};
const button1: ButtonItemProps = {
	text: "Button 1",
	iconPosition: "left",
	icon: "ri-home-line",
	iconOnly: false,
	onClick: () => {
		/* Storybook demo button */
	},
	disabled: false,
};
const button2: ButtonItemProps = {
	text: "Button 2",
	iconPosition: "right",
	icon: "ri-book-line",
	iconOnly: false,
	onClick: () => {
		/* Storybook demo button */
	},
	disabled: false,
};

const buttonGroup = <ButtonGroup items={[button1, button2]} size={"small"} />;

export const BannerWithButtonGroup: Story = {
	args: {
		buttonGroup: buttonGroup,
	},
	parameters: {
		layout: "default",
	},
};

export const BannerWithButtonGroupWithOneButton: Story = {
	args: {
		buttonGroup: <ButtonGroup items={[button1]} size={"small"} />,
	},
	parameters: {
		layout: "default",
	},
};
