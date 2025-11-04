import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import React, { useState } from "react";
import { TabMenuHorizontal } from "@/components/simpleui/TabMenu/Horizontal/tabMenuHorizontal";
import { TabMenuHorizontalItem } from "@/components/simpleui/TabMenu/Horizontal/tabMenuHorizontalItem";

const meta: Meta = {
	title: "SimpleUI/TabMenuHorizontal",
	component: TabMenuHorizontal,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		items: { control: "object" },
		activeTab: { control: "number" },
	},
	args: { onTabClick: fn() },
} satisfies Meta<typeof TabMenuHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state and render the TabMenuHorizontal
const TabMenuWrapper: React.FC<{
	items: string[];
	initialActiveTab: number;
}> = ({ items, initialActiveTab }) => {
	const [activeTab, setActiveTab] = useState(initialActiveTab);

	const handleTabClick = (index: number) => {
		setActiveTab(index);
	};

	const tabItems = [
		<TabMenuHorizontalItem
			key={1}
			text={items[0]}
			onClick={() => handleTabClick(0)}
			active={activeTab === 0}
			leftIcon={"ri-question-line"}
			rightIcon={"ri-arrow-right-s-line"}
		/>,
		<TabMenuHorizontalItem
			key={2}
			text={items[1]}
			onClick={() => handleTabClick(1)}
			active={activeTab === 1}
		/>,
		<TabMenuHorizontalItem
			key={3}
			text={items[2]}
			onClick={() => handleTabClick(2)}
			active={activeTab === 2}
		/>,
	];

	return (
		<div>
			<TabMenuHorizontal
				items={tabItems}
				activeTab={activeTab}
				onTabClick={handleTabClick}
			/>
		</div>
	);
};

export const Primary: Story = {
	render: (args) => (
		<TabMenuWrapper items={args.items} initialActiveTab={args.activeTab} />
	),
	args: {
		items: ["Item 1", "Item 2", "Item 3"],
		activeTab: 0,
	},
};

export const Secondary: Story = {
	render: (args) => (
		<TabMenuWrapper items={args.items} initialActiveTab={args.activeTab} />
	),
	args: {
		items: ["Item 1", "Item 2", "Item 3"],
		activeTab: 1,
	},
};
