import {TableCell} from "@/components/baseui/Table/TableCell/tableCell";
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta = {
    title: 'Components/TableCell',
    component: TableCell,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof TableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Table Cell',
    },
}

export const Empty: Story = {
    args: {
    },
}
