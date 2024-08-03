import Checkbox from '@/components/baseui/checkbox/checkbox';
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: {control: 'boolean'},
        checked: {control: 'select', options: ['checked', 'unchecked', 'indeterminate']},
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    args: {
        disabled: false,
        checked: 'checked',
    },
};


export const Indeterminate: Story = {
    args: {
        disabled: false,
        checked: 'indeterminate',
    },
};

export const IndeterminateDisabled: Story = {
    args: {
        disabled: true,
        checked: 'indeterminate',
    },
};
