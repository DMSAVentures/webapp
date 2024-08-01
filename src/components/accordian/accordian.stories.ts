import Accordian     from "@/components/accordian/accordian";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';


const meta: Meta = {
    title: 'Components/Accordian',
    component: Accordian,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        flipIcon: { control: 'boolean' },
        leftIcon: { control: 'text' },
        changeIcon: { control: 'text' },
        title: { control: 'text' },
        description: { control: 'text' },
    },
    args: { onClick: fn() },
} satisfies Meta<typeof Accordian>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Primary: Story = {
    args: {
        flipIcon: false,
        leftIcon: "s",
        changeIcon: "k",
        title: 'Title',
        description: 'Description',
    },
};
