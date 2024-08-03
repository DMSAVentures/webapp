import BreadcrumbItem   from "@/components/baseui/breadcrumb/breadcrumbitem";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/Breadcrumb Item',
    component: BreadcrumbItem,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        state: { control: 'select', options: ['default', 'active', 'disabled'] },
        text: { control: 'text' },
        icon: { control: 'text' },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof BreadcrumbItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        state: 'default',
        text: 'Text',
    },
};

export const WithIcon: Story = {
    args: {
        state: 'default',
        icon: 'ri-home-line',
    },
};

export const WithTextAndIcon: Story = {
    args: {
        state: 'default',
        text: 'Text',
        icon: 'ri-home-line',
    },
};

export const Disabled: Story = {
    args: {
        state: 'disabled',
        text: 'Text',
        icon: 'ri-home-line',
    },
};
