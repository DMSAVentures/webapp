import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta = {
	title: 'ProtoDesignSystem/Feedback/LoadingSpinner',
	component: LoadingSpinner,
	tags: ['autodocs'],
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		size: {
			control: 'select',
			options: ['small', 'medium', 'large'],
			description: 'Size of the spinner',
		},
		mode: {
			control: 'select',
			options: ['inline', 'centered', 'fullscreen'],
			description: 'Display mode',
		},
		message: {
			control: 'text',
			description: 'Optional message below spinner',
		},
	},
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithMessage: Story = {
	args: {
		message: 'Loading your data...',
	},
};

export const Small: Story = {
	args: {
		size: 'small',
		message: 'Loading...',
	},
};

export const Medium: Story = {
	args: {
		size: 'medium',
		message: 'Loading...',
	},
};

export const Large: Story = {
	args: {
		size: 'large',
		message: 'Loading...',
	},
};

export const Inline: Story = {
	args: {
		size: 'small',
		mode: 'inline',
	},
};

export const Centered: Story = {
	args: {
		size: 'medium',
		mode: 'centered',
		message: 'Please wait...',
	},
};

export const Fullscreen: Story = {
	args: {
		size: 'large',
		mode: 'fullscreen',
		message: 'Loading application...',
	},
};
