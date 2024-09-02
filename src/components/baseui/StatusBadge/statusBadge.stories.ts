import StatusBadge from '@/components/baseui/StatusBadge/statusBadge';

import  {Meta, StoryObj} from "@storybook/react";

const meta: Meta = {
    title: 'Components/Status Badge',
    component: StatusBadge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        text: { control: 'text' },
        variant: {
            control: 'select',
            options: ['completed', 'pending', 'failed', 'disabled'],
        },
        styleType: {
            control: 'select',
            options: ['light', 'stroke'],
        },
        icon: { control: 'text' },
    },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completed: Story = {
    args: {
        text: 'Done',
        variant: 'completed',
        styleType: 'light',
    },
}
