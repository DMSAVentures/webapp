import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Toggle } from "@/components/simpleui/Toggle/toggle";

const meta: Meta = {
	title: "SimpleUI/Toggle",
	component: Toggle,
	argTypes: {
		checked: { control: "boolean" },
	},
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = (args: any) => {
	const [checked, setChecked] = useState(args.checked);

	const handleChange = () => {
		setChecked(!checked);
	};

	return <Toggle {...args} checked={checked} onChange={handleChange} />;
};

export const Default: Story = {
	render: Template.bind({}),
	args: {
		checked: false,
	},
};

export const Checked: Story = {
	render: Template.bind({}),
	args: {
		checked: true,
	},
};

export const Disabled: Story = {
	render: Template.bind({}),
	args: {
		checked: false,
		disabled: true,
	},
};

export const CheckedDisabled: Story = {
	render: Template.bind({}),
	args: {
		checked: true,
		disabled: true,
	},
};

export const WithLabel: Story = {
	render: Template.bind({}),
	args: {
		checked: false,
		label: "Toggle",
	},
};
