import StepIndicatorVerticalItem   from "@/components/baseui/stepindicatorvertical/stepIndicatorItem"
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/StepIndicatorVertical Item',
    component: StepIndicatorVerticalItem,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        state: { control: 'select', options: ['default', 'active', 'completed', 'disabled'] },
        text: { control: 'text' },
        idx: { control: 'number' },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof StepIndicatorVerticalItem>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
    args: {
        state: 'default',
        text: 'Text',
        idx: 4,
    },
};

export const Completed: Story = {
    args: {
        state: 'completed',
        text: 'Text',
        idx: 1,
    },
};

export const Active: Story = {
    args: {
        state: 'active',
        text: 'Text',
        idx: 2,
    },
};
