import Accordian     from "@/components/simpleui/accordian/accordian";
import {Meta, type StoryObj} from '@storybook/react';
import { fn } from '@storybook/test';


const meta: Meta = {
    title: 'SimpleUI/Accordian',
    component: Accordian,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        flipIcon: { control: 'boolean' },
        leftIcon: { control: 'text' },
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
        leftIcon: "question-line",
        title: 'Title',
        description: 'Description',
    },
};
