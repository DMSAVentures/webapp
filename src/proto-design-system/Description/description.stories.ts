import type { Meta, StoryObj } from '@storybook/react';
import { Description } from './description';

const meta = {
	title: 'ProtoDesignSystem/Typography/Description',
	component: Description,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		disabled: {
			control: 'boolean',
			description: 'Whether the description is disabled',
		},
	},
} satisfies Meta<typeof Description>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'This field is used to enter your full legal name as it appears on official documents.',
	},
};

export const Disabled: Story = {
	args: {
		children: 'This is a disabled description',
		disabled: true,
	},
};

export const ShortDescription: Story = {
	args: {
		children: 'Enter your name',
	},
};
