import {Badge} from "@/components/simpleui/badge/badge";

import  {Meta, StoryObj} from "@storybook/react";

const meta: Meta = {
    title: 'SimpleUI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        text: { control: 'text' },
        variant: {
            control: 'select',
            options: ['gray', 'blue', 'orange', 'red', 'green', 'purple', 'yellow', 'pink', 'sky', 'teal'],
        },
        styleType: {
            control: 'select',
            options: ['filled', 'light', 'lighter', 'stroke'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium'],
        },
        icon: { control: 'text' },
        iconPosition: {
            control: 'select',
            options: ['left', 'right'],
        },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        text: 'Badge',
        variant: 'gray',
        styleType: 'filled',
        size: 'small',
        icon: '',
        iconPosition: 'left',
        disabled: false,
    },
}
