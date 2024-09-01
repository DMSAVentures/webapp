import React, { useState } from 'react';
import { TabMenuHorizontal } from "@/components/baseui/tabMenu/tabMenuHorizontal/tabMenuHorizontal";
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/TabMenuHorizontal',
    component: TabMenuHorizontal,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        items: { control: 'object' },
        activeTab: { control: 'number' },
    },
    args: { onTabClick: fn() },
} satisfies Meta<typeof TabMenuHorizontal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state and render the TabMenuHorizontal
const TabMenuWrapper: React.FC<{ items: string[], initialActiveTab: number }> = ({ items, initialActiveTab }) => {
    const [activeTab, setActiveTab] = useState(initialActiveTab);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    return (
        <div>
    <TabMenuHorizontal
        items={items}
    activeTab={activeTab}
    onTabClick={handleTabClick}
    />
    </div>
);
};

export const Primary: Story = {
    render: (args) => <TabMenuWrapper items={args.items} initialActiveTab={args.activeTab} />,
args: {
    items: ['Item 1', 'Item 2', 'Item 3'],
        activeTab: 0,
},
};

export const Secondary: Story = {
    render: (args) => <TabMenuWrapper items={args.items} initialActiveTab={args.activeTab} />,
args: {
    items: ['Item 1', 'Item 2', 'Item 3'],
        activeTab: 1,
},
};
