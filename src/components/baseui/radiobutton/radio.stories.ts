import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';
import Radio from "@/components/baseui/radiobutton/radio";

const meta: Meta = {
    title: 'Components/Radio',
    component: Radio,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: {control: 'boolean'},
        checked: {control: 'select', options: ['checked', 'unchecked']},
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    args: {
        disabled: false,
        checked: 'checked',
    },
};

