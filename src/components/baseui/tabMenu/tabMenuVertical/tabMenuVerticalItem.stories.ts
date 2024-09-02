import {TabMenuVerticalItem} from "@/components/baseui/tabMenu/tabMenuVertical/tabMenuVerticalItem";
import {Meta, type StoryObj} from '@storybook/react';

const meta: Meta = {
    title: 'Components/TabMenuVertical Item',
    component: TabMenuVerticalItem,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        active: { control: 'boolean' },
        text: { control: 'text' },
        onClick: { action: 'clicked' },
        leftIcon: { control: 'text' },
        rightIcon: { control: 'text' },
        number: { control: 'number' },
    },
} satisfies Meta<typeof TabMenuVerticalItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        active: false,
        text: 'Text',
        leftIcon: 'ri-question-line',
        rightIcon: 'ri-question-line',
        number: 1,
    },
};

export const Active: Story = {
    args: {
        active: true,
        text: "Overview",
        leftIcon: 'ri-question-line',
        rightIcon: 'ri-question-line',
        number: false,
    },
};
