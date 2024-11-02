import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from "@/components/simpleui/Button/button";

// Storybook metadata and configuration
const meta: Meta<typeof Button> = {
  title: 'SimpleUI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    disabled: { control: 'boolean' },
  },
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Primary button story
export const Primary: Story = {
  args: {
    variant: 'primary',
    disabled: false,
    children: 'Primary Button',
  },
};

// Secondary button story
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    disabled: false,
    children: 'Secondary Button',
  },
};

// Disabled button story
export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};
