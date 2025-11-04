import { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/simpleui/badge/badge";
import { BadgeGroup } from "@/components/simpleui/badge/badgeGroup";

const meta: Meta = {
	title: "SimpleUI/Badge Group",
	component: BadgeGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		children: { control: "text" },
	},
} satisfies Meta<typeof BadgeGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: [
			<Badge
				key={"badge-1"}
				styleType={"filled"}
				size={"small"}
				variant={"green"}
				text={"Badge 1"}
			/>,
			<Badge
				key={"badge-2"}
				styleType={"filled"}
				size={"small"}
				variant={"blue"}
				text={"Badge 2"}
			/>,
			<Badge
				key={"badge-3"}
				styleType={"filled"}
				size={"small"}
				variant={"red"}
				text={"Badge 3"}
			/>,
			<Badge
				key={"badge-4"}
				styleType={"filled"}
				size={"small"}
				variant={"red"}
				text={"Badge 4"}
			/>,
		],
	},
};
