import { Meta, StoryObj } from "@storybook/react";
import { UIShellWithCollapsibleNavigation } from "./UIShellWithCollapsibleNavigation";

const meta: Meta<typeof UIShellWithCollapsibleNavigation> = {
	title: "SimpleUI/Shell",
	component: UIShellWithCollapsibleNavigation,
	args: {},
	argTypes: {},
	parameters: {
		docs: {
			description: {
				component:
					"A Shell component that includes a header with a logo and a responsive grid layout below.",
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof UIShellWithCollapsibleNavigation>;

// Default story for Shell
export const DefaultShell: Story = {
	render: (args) => <UIShellWithCollapsibleNavigation {...args} />,
	parameters: {
		docs: {
			description: {
				story: "Default shell layout with a header and grid content area.",
			},
		},
	},
};
