import Slider from './slider';
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta = {
    title: 'Components/Slider',
    component: Slider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        value: { control: 'number' },
        onChange: { action: 'changed' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        label: 'Primary',
    },
};

export const Secondary: Story = {
    args: {
        min: 0,
        max: 100,
        step: 1,
        value: 75,
        label: 'Secondary',
    },
};

export const Tertiary: Story = {
    args: {
        min: 0,
        max: 100,
        step: 1,
        value: 25,
        label: 'Tertiary',
    },
};

export const Disabled: Story = {
    args: {
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        disabled: true,
        label: 'Disabled',
    },
};


export const StepsTen : Story = {
    args: {
        min: 0,
        max: 100,
        step: 10,
        value: 50,
        label: 'Steps of 10',
    },
};

export const OptionalLabel : Story = {
    args: {
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        label: 'Optional Label',
        optional: true,
    },
};
