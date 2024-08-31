import RadialProgress from "@/components/baseui/progressbar/radialProgressProps";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
    title: 'Components/RadialProgress',
    component: RadialProgress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        percentage: { control: 'number' },
        showPercentage: { control: 'boolean' },
        size: { control: 'select', options: [ 'x-small', 'small', 'medium', 'large'] },
        variant: { control: 'select', options: ['success', 'info', 'warning', 'error'] },
    },

} satisfies Meta<typeof RadialProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessMedium: Story = {
    args: {
        percentage: 50,
        showPercentage: true,
        size: 'medium',
        variant: 'success',
    },
};

export const InfoLarge: Story = {
    args: {
        percentage: 75,
        showPercentage: true,
        size: 'large',
        variant: 'info',
    },
};

export const WarningSmall: Story = {
    args: {
        percentage: 25,
        showPercentage: true,
        size: 'small',
        variant: 'warning',
    },
};

export const ErrorXSmall: Story = {
    args: {
        percentage: 10,
        showPercentage: true,
        size: 'x-small',
        variant: 'error',
    },
};
