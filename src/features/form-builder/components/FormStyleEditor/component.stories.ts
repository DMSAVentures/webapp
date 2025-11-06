/**
 * FormStyleEditor Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { mockFormDesigns } from "@/mocks/forms.mock";
import { FormStyleEditor } from "./component";

const meta = {
	title: "Features/FormBuilder/FormStyleEditor",
	component: FormStyleEditor,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		design: {
			description: "Current design settings",
			control: "object",
		},
		onChange: {
			description: "Callback when design changes",
			action: "design-changed",
		},
		selectedFieldId: {
			description: "Currently selected field ID",
			control: "text",
		},
	},
} satisfies Meta<typeof FormStyleEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default modern design
 */
export const Modern: Story = {
	args: {
		design: mockFormDesigns.modern,
		selectedFieldId: undefined,
	},
};

/**
 * Vibrant design theme
 */
export const Vibrant: Story = {
	args: {
		design: mockFormDesigns.vibrant,
		selectedFieldId: undefined,
	},
};

/**
 * Minimal design theme
 */
export const Minimal: Story = {
	args: {
		design: mockFormDesigns.minimal,
		selectedFieldId: undefined,
	},
};

/**
 * Dark design theme
 */
export const Dark: Story = {
	args: {
		design: mockFormDesigns.dark,
		selectedFieldId: undefined,
	},
};

/**
 * Playful design theme
 */
export const Playful: Story = {
	args: {
		design: mockFormDesigns.playful,
		selectedFieldId: undefined,
	},
};

/**
 * Corporate design theme (two-column)
 */
export const Corporate: Story = {
	args: {
		design: mockFormDesigns.corporate,
		selectedFieldId: undefined,
	},
};

/**
 * Tech design theme
 */
export const Tech: Story = {
	args: {
		design: mockFormDesigns.tech,
		selectedFieldId: undefined,
	},
};

/**
 * Multi-step wizard design
 */
export const MultiStepWizard: Story = {
	args: {
		design: mockFormDesigns.multiStepWizard,
		selectedFieldId: undefined,
	},
};

/**
 * With selected field (shows field editing mode)
 */
export const WithSelectedField: Story = {
	args: {
		design: mockFormDesigns.modern,
		selectedFieldId: "field-email-1",
	},
};

/**
 * Interactive editor with state management
 */
export const Interactive: Story = {
	render: () => {
		const [design, setDesign] = useState(mockFormDesigns.modern);

		return {
			type: "div",
			props: {
				style: {
					display: "flex",
					gap: "24px",
					minHeight: "600px",
				},
				children: [
					{
						type: "div",
						props: {
							style: {
								width: "320px",
								border: "1px solid #e5e7eb",
								borderRadius: "8px",
								overflow: "hidden",
							},
							children: {
								type: FormStyleEditor,
								props: {
									design,
									onChange: (newDesign: typeof design) => {
										console.log("Design changed:", newDesign);
										setDesign(newDesign);
									},
									selectedFieldId: undefined,
								},
							},
						},
					},
					{
						type: "div",
						props: {
							style: {
								flex: 1,
								padding: "20px",
								backgroundColor: design.colors.background,
								borderRadius: "8px",
								border: `1px solid ${design.colors.border}`,
								display: "flex",
								flexDirection: "column",
								gap: `${design.spacing.gap}px`,
							},
							children: [
								{
									type: "h3",
									props: {
										style: {
											margin: 0,
											fontFamily: design.typography.fontFamily,
											fontSize: `${design.typography.fontSize + 4}px`,
											fontWeight: design.typography.fontWeight + 200,
											color: design.colors.text,
										},
										children: "Live Preview",
									},
								},
								{
									type: "div",
									props: {
										style: {
											padding: `${design.spacing.padding}px`,
											backgroundColor: design.colors.primary,
											color: design.colors.background,
											borderRadius: `${design.borderRadius}px`,
											fontFamily: design.typography.fontFamily,
											fontSize: `${design.typography.fontSize}px`,
											textAlign: "center",
										},
										children: "This preview updates in real-time",
									},
								},
								{
									type: "div",
									props: {
										style: {
											padding: `${design.spacing.padding}px`,
											border: `1px solid ${design.colors.border}`,
											borderRadius: `${design.borderRadius}px`,
											fontFamily: design.typography.fontFamily,
											fontSize: `${design.typography.fontSize}px`,
											color: design.colors.text,
										},
										children: "Edit styles on the left to see changes",
									},
								},
							],
						},
					},
				],
			},
		};
	},
};

/**
 * Editor in constrained container
 */
export const Constrained: Story = {
	args: {
		design: mockFormDesigns.modern,
		selectedFieldId: undefined,
	},
	decorators: [
		(Story) => ({
			type: "div",
			props: {
				style: {
					width: "320px",
					height: "600px",
					border: "1px solid #e5e7eb",
					borderRadius: "8px",
					overflow: "hidden",
				},
				children: { type: Story, props: {} },
			},
		}),
	],
};
