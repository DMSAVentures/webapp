import DropdownMenu  from "@/components/baseui/dropdownmenu/dropdownmenu";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';
import Button from "@/components/baseui/button/button";

const meta: Meta = {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        items: {
            control: 'object',
        },
        bottomButton: {
            control: 'object',
        },
        caption: {
            control: 'text',
        },
    },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 1',
        sublabel: 'Sublabel',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 2',
        sublabel: 'Sublabel',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 3',
        sublabel: 'Sublabel',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        size: 'thin',
        text: '',
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 4',
        sublabel: 'Sublabel',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 5',
        sublabel: 'Sublabel',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 6',
        sublabel: 'Sublabel',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
];

export const Primary: Story = {
    args: {
        items: items,
        bottomButton: <Button variant="neutral" styleType={'stroke'} text="Button"  size={'2x-small'}/>,
        caption: 'v1.2.0',
    },
};

const itemsWithoutSublabels = [
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 1',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 2',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 3',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        size: 'thin',
        text: '',
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 4',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 5',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
    {
        state: 'default',
        size: 'medium',
        checkbox: false,
        label: 'Item 6',
        badge: false,
        shortcut: false,
        toggle: false,
        button: false,
        icon: 'ri-home-2-line',
        iconPosition: 'left',
        onClick: () => {},
    },
];

export const itemsWithoutSublabelsStory: Story = {
    args: {
        items: itemsWithoutSublabels,
        bottomButton: <Button variant="neutral" styleType={'stroke'} text="Button"  size={'2x-small'}/>,
        caption: 'v1.2.0',
    },
};
