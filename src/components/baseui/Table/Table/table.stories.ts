import {Table} from "@/components/baseui/Table/Table/table";
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta = {
    title: 'Components/Table',
    component: Table,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {},
};
