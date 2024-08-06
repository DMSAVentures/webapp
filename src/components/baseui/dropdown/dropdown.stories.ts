import Dropdown from "@/components/baseui/dropdown/dropdown";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        size: { control: 'select', options: ['medium', 'small', 'x-small'] },
        optional: { control: 'boolean' },
        tooltip: { control: 'text' },
        label: { control: 'text' },
        hintText: { control: 'text' },
        badge: { control: 'text' },
        leftIcon: { control: 'text' },
        placeholderText: { control: 'text' },
        disabled: { control: 'boolean' },
        error: { control: 'text' },
    },
} satisfies Meta<typeof Dropdown>;


export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        dropdownType: 'text',
        size: 'medium',
        optional: false,
        tooltip: 'Tooltip',
        label: 'Label',
        hintText: 'Hint Text',
        badge: 'Badge',
        leftIcon: 'ri-question-line',
        placeholderText: 'Placeholder Text',
        options: [
            {value: '1', label: 'Option 1'},
            {value: '2', label: 'Option 2'},
            {value: '3', label: 'Option 3'}
        ]
    },
};

export const Disabled: Story = {
    args: {
        dropdownType: 'text',
        size: 'medium',
        optional: false,
        tooltip: 'Tooltip',
        label: 'Label',
        hintText: 'Hint Text',
        badge: 'Badge',
        leftIcon: 'ri-question-line',
        placeholderText: 'Placeholder Text',
        disabled: true,
        options: [
            {value: '1', label: 'Option 1'},
            {value: '2', label: 'Option 2'},
            {value: '3', label: 'Option 3'}
        ]
    },
};

export const Error: Story = {
    args: {
        dropdownType: 'text',
        size: 'medium',
        optional: false,
        tooltip: 'Tooltip',
        label: 'Label',
        hintText: 'Hint Text',
        badge: 'Badge',
        leftIcon: 'ri-question-line',
        placeholderText: 'Placeholder Text',
        error: 'Please select an option before proceeding.',
        options: [
            {value: '1', label: 'Option 1'},
            {value: '2', label: 'Option 2'},
            {value: '3', label: 'Option 3'}
        ]
    },
};
