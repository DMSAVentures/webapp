import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Linkbutton from "@/components/linkbutton/linkbutton";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Linkbutton',
  component: Linkbutton,
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
      options: ['primary', 'gray', 'neutral', 'error'],
    },
    styleType: {
      control: 'select',
      options: ['lighter', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    underline: { control: 'boolean' },
    leftIcon: { control: 'text' },
    rightIcon: { control: 'text' },
    pickLeft: { control: 'boolean' },
    pickRight: { control: 'boolean' },
    text: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Linkbutton>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'primary',
    styleType: 'ghost',
    size: 'medium',
    text: 'Button',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    styleType: 'ghost',

    size: 'medium',
    text: 'Neutral Linkbutton',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    styleType: 'ghost',
    size: 'medium',
    text: 'Error Linkbutton',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    styleType: 'ghost',
    disabled: true,
    size: 'medium',
    text: 'Disabled Linkbutton',
  },
};

export const LeftIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'ghost',
    size: 'medium',
    text: 'Search',
    leftIcon: '🔍',
  },
};

export const RightIcon: Story = {
  args: {
    variant: 'primary',
    styleType: 'ghost',
    size: 'medium',
    text: 'Send',
    rightIcon: '📤',
  },
};
