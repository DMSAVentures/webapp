import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from "@/components/baseui/button/button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'neutral', 'error'],
    },
    styleType: {
      control: 'select',
      options: ['filled', 'stroke', 'lighter', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['2x-small', 'x-small','small', 'medium'],
    },
    onlyIcon: { control: 'boolean' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    pickLeft: { control: 'boolean' },
    pickRight: { control: 'boolean' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',

    size: 'medium',
    children: 'Button',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    styleType: 'filled',

    size: 'medium',
    children: 'Neutral Button',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    styleType: 'filled',
    size: 'medium',
    children: 'Error Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    disabled: true,
    size: 'medium',
    children: 'Disabled Button',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'medium',
    onlyIcon: true,
    leftIcon: '🔍',
    children: ''
  },
};

export const LeftIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'medium',
    children: 'Search',
    leftIcon: '🔍',
  },
};

export const RightIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'filled',
    size: 'medium',
    children: 'Send',
    rightIcon: '📤',
  },
};
