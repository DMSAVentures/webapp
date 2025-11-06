/**
 * TeamInviteModal Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { TeamInviteModal } from "./component";

const meta = {
	title: "Features/Team/TeamInviteModal",
	component: TeamInviteModal,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		isOpen: {
			description: "Whether the modal is open",
			control: "boolean",
		},
		onClose: {
			description: "Callback when modal is closed",
			action: "closed",
		},
		onInvite: {
			description: "Callback when invite is submitted",
			action: "invited",
		},
		loading: {
			description: "Loading state during submission",
			control: "boolean",
		},
	},
} satisfies Meta<typeof TeamInviteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default modal state
 */
export const Default: Story = {
	args: {
		isOpen: true,
		onClose: () => console.log("Modal closed"),
		onInvite: async (data) => {
			console.log("Inviting member:", data);
			return new Promise((resolve) => setTimeout(resolve, 1000));
		},
		loading: false,
	},
};

/**
 * Loading state
 */
export const Loading: Story = {
	args: {
		isOpen: true,
		onClose: () => console.log("Modal closed"),
		onInvite: async (data) => {
			console.log("Inviting member:", data);
			return new Promise((resolve) => setTimeout(resolve, 1000));
		},
		loading: true,
	},
};

/**
 * Closed modal
 */
export const Closed: Story = {
	args: {
		isOpen: false,
		onClose: () => console.log("Modal closed"),
		onInvite: async (data) => {
			console.log("Inviting member:", data);
			return new Promise((resolve) => setTimeout(resolve, 1000));
		},
		loading: false,
	},
};
