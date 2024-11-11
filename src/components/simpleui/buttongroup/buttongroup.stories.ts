import ButtonGroup  from "@/components/simpleui/buttongroup/buttongroup";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'SimpleUI/Button Group',
    component: ButtonGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        items: { control: 'object' },
        size: { control: 'select', options: ['small', 'x-small', '2x-small'] },
    },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        items: [
            { text: 'Button 1', iconPosition: 'left', icon: 'ri-home-line', iconOnly: false, onClick: fn(), disabled: false },
            { text: 'Button 2', iconPosition: 'right', icon: 'ri-book-line', iconOnly: false, onClick: fn(), disabled: false },
            { text: 'Button 3', iconPosition: 'left', icon: 'ri-database-line', iconOnly: false, onClick: fn(), disabled: false },
        ],
        size: 'small',
    },
};

export const ButtonGroupWithTwoButtons: Story = {
    args: {
        items: [
            { text: 'Button 1', iconPosition: 'left', icon: 'ri-home-line', iconOnly: false, onClick: fn(), disabled: false },
            { text: 'Button 2', iconPosition: 'right', icon: 'ri-book-line', iconOnly: false, onClick: fn(), disabled: false },
        ],
        size: 'small',
    },
};

export const ButtonGroupIconsOnly: Story = {
    args: {
        items: [
            { text: '', iconPosition: 'left', icon: 'ri-home-line', iconOnly: true, onClick: fn(), disabled: false },
            { text: '', iconPosition: 'right', icon: 'ri-book-line', iconOnly: true, onClick: fn(), disabled: false },
            { text: '', iconPosition: 'left', icon: 'ri-database-line', iconOnly: true, onClick: fn(), disabled: false },
        ],
        size: 'small',
    },
};

export const ButtonGroupWithRightIcons : Story = {
    args: {
        items: [
            { text: 'Button 1', iconPosition: 'right', icon: 'ri-home-line', iconOnly: false, onClick: fn(), disabled: false },
            { text: 'Button 2', iconPosition: 'right', icon: 'ri-book-line', iconOnly: false, onClick: fn(), disabled: false },
            { text: 'Button 3', iconPosition: 'right', icon: 'ri-database-line', iconOnly: false, onClick: fn(), disabled: false },
        ],
        size: 'small',
    },
};

export const ButtonGroupWithSingleButton : Story = {
    args: {
        items: [
            { text: 'Button 1', iconPosition: 'right', icon: 'ri-home-line', iconOnly: false, onClick: fn(), disabled: false },
        ],
        size: 'small',
    },
};
