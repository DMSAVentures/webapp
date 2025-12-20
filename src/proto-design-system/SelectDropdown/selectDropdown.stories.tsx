import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SelectDropdown, type SelectOption } from "./selectDropdown";

const meta = {
	title: "ProtoDesignSystem/SelectDropdown",
	component: SelectDropdown,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
	argTypes: {
		mode: {
			control: "radio",
			options: ["single", "multi"],
		},
		size: {
			control: "select",
			options: ["small", "medium", "large"],
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof SelectDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions: SelectOption[] = [
	{ value: "option1", label: "Option 1" },
	{ value: "option2", label: "Option 2" },
	{ value: "option3", label: "Option 3" },
	{ value: "option4", label: "Option 4" },
	{ value: "option5", label: "Option 5", disabled: true },
];

export const SingleSelect: Story = {
	args: {
		options: sampleOptions,
		placeholder: "Select an option",
		mode: "single",
	},
	render: (args) => {
		const [value, setValue] = useState<string | undefined>();
		return (
			<SelectDropdown
				{...args}
				mode="single"
				value={value}
				onChange={setValue}
			/>
		);
	},
};

export const MultiSelect: Story = {
	args: {
		options: sampleOptions,
		placeholder: "Select options",
		mode: "multi",
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>([]);
		return (
			<SelectDropdown
				{...args}
				mode="multi"
				value={values}
				onChange={setValues}
			/>
		);
	},
};

export const WithLabel: Story = {
	args: {
		options: sampleOptions,
		placeholder: "Select status",
		label: "Status",
		mode: "multi",
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>([]);
		return (
			<SelectDropdown
				{...args}
				mode="multi"
				value={values}
				onChange={setValues}
			/>
		);
	},
};

export const Sizes: Story = {
	render: () => {
		const [small, setSmall] = useState<string[]>([]);
		const [medium, setMedium] = useState<string[]>([]);
		const [large, setLarge] = useState<string[]>([]);

		return (
			<div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
				<SelectDropdown
					options={sampleOptions}
					placeholder="Small"
					size="small"
					mode="multi"
					value={small}
					onChange={setSmall}
				/>
				<SelectDropdown
					options={sampleOptions}
					placeholder="Medium"
					size="medium"
					mode="multi"
					value={medium}
					onChange={setMedium}
				/>
				<SelectDropdown
					options={sampleOptions}
					placeholder="Large"
					size="large"
					mode="multi"
					value={large}
					onChange={setLarge}
				/>
			</div>
		);
	},
};

export const Disabled: Story = {
	args: {
		options: sampleOptions,
		placeholder: "Disabled dropdown",
		disabled: true,
	},
};

export const WithPreselectedValues: Story = {
	args: {
		options: sampleOptions,
		mode: "multi",
	},
	render: (args) => {
		const [values, setValues] = useState<string[]>(["option1", "option3"]);
		return (
			<SelectDropdown
				{...args}
				mode="multi"
				value={values}
				onChange={setValues}
			/>
		);
	},
};
