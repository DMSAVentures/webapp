import {Tag} from "@/components/simpleui/Tag/tag";
import {Meta, StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const onRemove = fn(
    () => {console.log('remove')}
);

const onSelect = fn(() => {console.log('select')});

const meta: Meta = {
    title: 'SimpleUI/Tag',
    component: Tag,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        icon: { control: 'text' },
        image: { control: 'text' },
    },
    args: {
        onRemove: onRemove,
        onSelect:onSelect,
    }
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Tag',
        icon: 'ri-user-line',
    },
};

export const Active: Story = {
    args: {
        children: 'Active Tag',
        icon: 'ri-user-line',
        state: 'active',
    },
};

export const Disabled: Story = {
    args: {
        children: 'Disabled Tag',
        icon: 'ri-user-line',
        state: 'disabled',
    },
};

export const Removeable: Story = {
    args: {
        children: 'Removeable Tag',
        icon: 'ri-user-line',
        state: 'active',
        removeable: true,
    },
};

export const RemoveableDisabled: Story = {
    args: {
        children: 'Removeable Disabled Tag',
        icon: 'ri-user-line',
        state: 'disabled',
        removeable: true,
    },
};

export const Image: Story = {
    args: {
        children: 'Image Tag',
        image: 'https://placehold.co/150',
    },
};


