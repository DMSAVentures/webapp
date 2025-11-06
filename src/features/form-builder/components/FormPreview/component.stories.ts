/**
 * FormPreview Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { mockFormConfigs } from "@/mocks/forms.mock";
import { FormPreview } from "./component";

const meta = {
	title: "Features/FormBuilder/FormPreview",
	component: FormPreview,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		config: {
			description: "Form configuration to preview",
			control: "object",
		},
		device: {
			description: "Device type for responsive preview",
			control: "select",
			options: ["mobile", "tablet", "desktop"],
		},
	},
} satisfies Meta<typeof FormPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Desktop preview with standard form
 */
export const DesktopStandard: Story = {
	args: {
		config: mockFormConfigs[0],
		device: "desktop",
	},
};

/**
 * Tablet preview
 */
export const TabletStandard: Story = {
	args: {
		config: mockFormConfigs[0],
		device: "tablet",
	},
};

/**
 * Mobile preview
 */
export const MobileStandard: Story = {
	args: {
		config: mockFormConfigs[0],
		device: "mobile",
	},
};

/**
 * Minimal form preview
 */
export const MinimalForm: Story = {
	args: {
		config: mockFormConfigs[1],
		device: "desktop",
	},
};

/**
 * Comprehensive form preview
 */
export const ComprehensiveForm: Story = {
	args: {
		config: mockFormConfigs[2],
		device: "desktop",
	},
};

/**
 * Tech theme preview
 */
export const TechTheme: Story = {
	args: {
		config: mockFormConfigs[3],
		device: "desktop",
	},
};

/**
 * Playful theme preview
 */
export const PlayfulTheme: Story = {
	args: {
		config: mockFormConfigs[4],
		device: "desktop",
	},
};

/**
 * Multi-step form preview
 */
export const MultiStepForm: Story = {
	args: {
		config: mockFormConfigs[5],
		device: "desktop",
	},
};

/**
 * Form with conditional logic preview
 */
export const ConditionalLogicForm: Story = {
	args: {
		config: mockFormConfigs[6],
		device: "desktop",
	},
};

/**
 * Empty form preview (no fields)
 */
export const EmptyForm: Story = {
	args: {
		config: {
			...mockFormConfigs[0],
			fields: [],
		},
		device: "desktop",
	},
};

/**
 * Two-column layout preview
 */
export const TwoColumnLayout: Story = {
	args: {
		config: mockFormConfigs[2], // Corporate design with two-column
		device: "desktop",
	},
};

/**
 * Mobile comparison - multiple forms
 */
export const MobileComparison: Story = {
	render: () => ({
		type: "div",
		props: {
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
				gap: "24px",
				padding: "24px",
				backgroundColor: "#f9fafb",
			},
			children: [
				{
					type: FormPreview,
					props: {
						config: mockFormConfigs[0],
						device: "mobile",
					},
				},
				{
					type: FormPreview,
					props: {
						config: mockFormConfigs[3],
						device: "mobile",
					},
				},
				{
					type: FormPreview,
					props: {
						config: mockFormConfigs[4],
						device: "mobile",
					},
				},
			],
		},
	}),
};

/**
 * Device comparison - same form across devices
 */
export const DeviceComparison: Story = {
	render: () => ({
		type: "div",
		props: {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "24px",
				padding: "24px",
				backgroundColor: "#f9fafb",
			},
			children: [
				{
					type: "h2",
					props: {
						style: {
							margin: 0,
							fontSize: "24px",
							fontWeight: 600,
							color: "#1f2937",
						},
						children: "Responsive Preview",
					},
				},
				{
					type: "div",
					props: {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
							gap: "24px",
						},
						children: [
							{
								type: "div",
								props: {
									children: [
										{
											type: "h3",
											props: {
												style: {
													margin: "0 0 16px 0",
													fontSize: "18px",
													color: "#4b5563",
												},
												children: "Desktop",
											},
										},
										{
											type: FormPreview,
											props: {
												config: mockFormConfigs[0],
												device: "desktop",
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									children: [
										{
											type: "h3",
											props: {
												style: {
													margin: "0 0 16px 0",
													fontSize: "18px",
													color: "#4b5563",
												},
												children: "Tablet",
											},
										},
										{
											type: FormPreview,
											props: {
												config: mockFormConfigs[0],
												device: "tablet",
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									children: [
										{
											type: "h3",
											props: {
												style: {
													margin: "0 0 16px 0",
													fontSize: "18px",
													color: "#4b5563",
												},
												children: "Mobile",
											},
										},
										{
											type: FormPreview,
											props: {
												config: mockFormConfigs[0],
												device: "mobile",
											},
										},
									],
								},
							},
						],
					},
				},
			],
		},
	}),
};

/**
 * Theme showcase - different themes
 */
export const ThemeShowcase: Story = {
	render: () => ({
		type: "div",
		props: {
			style: {
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
				gap: "24px",
				padding: "24px",
				backgroundColor: "#f9fafb",
			},
			children: mockFormConfigs.slice(0, 6).map((config, index) => ({
				type: "div",
				key: config.id,
				props: {
					children: [
						{
							type: "h3",
							props: {
								style: {
									margin: "0 0 16px 0",
									fontSize: "18px",
									color: "#4b5563",
									textTransform: "capitalize",
								},
								children: `Theme ${index + 1}`,
							},
						},
						{
							type: FormPreview,
							props: {
								config,
								device: "tablet",
							},
						},
					],
				},
			})),
		},
	}),
};
