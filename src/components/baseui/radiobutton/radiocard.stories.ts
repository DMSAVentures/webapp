import {Meta, StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';
import RadioCard from "@/components/baseui/radiobutton/radiocard";

const meta: Meta = {
    title: 'Components/RadioCard',
    component: RadioCard,
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
} satisfies Meta<typeof RadioCard>;

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

