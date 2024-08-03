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
        size: {control: 'select', options: ['small', 'x-small']},
        disabled: {control: 'boolean'},
        checked: {control: 'select', options: ['checked', 'unchecked', 'indeterminate']},
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallChecked: Story = {
    args: {
        size: 'small',
        disabled: false,
        checked: 'checked',
    },
};

export const XSmallUnchecked: Story = {
    args: {
        size: 'x-small',
        disabled: true,
        checked: 'unchecked',
    },
};

export const SmallIndeterminate: Story = {
    args: {
        size: 'small',
        disabled: false,
        checked: 'indeterminate',
    },
};

export const XSmallIndeterminateDisabled: Story = {
    args: {
        size: 'x-small',
        disabled: true,
        checked: 'indeterminate',
    },
};
