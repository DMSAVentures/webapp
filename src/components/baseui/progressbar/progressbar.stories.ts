import ProgressBarLine from "@/components/baseui/progressbar/progressbar";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
    title: 'Components/ProgressBar',
    component: ProgressBarLine,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        progress: { control: 'number' },
        variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
        showPercentage: { control: 'boolean' },
        size: { control: 'select', options: ['small', 'medium', 'large'] },
    },

} satisfies Meta<typeof ProgressBarLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        progress: 50,
        size: 'medium',
        variant: 'primary',
        showPercentage: true,
    },
};

export const Secondary: Story = {
    args: {
        progress: 75,
        size: 'large',
        variant: 'secondary',
    },
};

