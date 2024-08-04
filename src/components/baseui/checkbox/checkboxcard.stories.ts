import CheckboxCard  from "@/components/baseui/checkbox/checkboxcard";
import {Meta, StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';

const meta: Meta = {
    title: 'Components/CheckboxCard',
    component: CheckboxCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        subLabel: {control: 'boolean'},
        badge: {control: 'boolean'},
        badgeString: {control: 'text'},
        editLabel: {control: 'text'},
        editSubLabel: {control: 'text'},
        editDescription: {control: 'text'},
        imageSrc: {control: 'text'},
        centeredImage: {control: 'boolean'},
    },
    args: { onClick: fn() },
} satisfies Meta<typeof CheckboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        subLabel: true,
        badge: true,
        badgeString: 'Badge',
        editLabel: 'Label',
        editSubLabel: 'Sublabel',
        editDescription: 'Description',
        imageSrc: 'https://via.placeholder.com/150',
        centeredImage: false,
    },
};

export const Disabled: Story = {
    args: {
        subLabel: true,
        badge: true,
        badgeString: 'Badge',
        editLabel: 'Label',
        editSubLabel: 'Sublabel',
        editDescription: 'Description',
        imageSrc: 'https://via.placeholder.com/150',
        centeredImage: false,
        disabled: true,
    },
};

