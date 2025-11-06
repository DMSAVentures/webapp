/**
 * FormBuilder Storybook Stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { mockFormConfigs } from "@/mocks/forms.mock";
import { FormBuilder } from "./component";

const meta = {
	title: "Features/FormBuilder/FormBuilder",
	component: FormBuilder,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		campaignId: {
			description: "Campaign ID this form belongs to",
			control: "text",
		},
		initialConfig: {
			description: "Initial form configuration",
			control: "object",
		},
		onSave: {
			description: "Callback when form is saved",
			action: "saved",
		},
	},
} satisfies Meta<typeof FormBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default form builder (empty form)
 */
export const Default: Story = {
	args: {
		campaignId: "campaign-demo-1",
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with standard form
 */
export const WithStandardForm: Story = {
	args: {
		campaignId: "campaign-demo-2",
		initialConfig: mockFormConfigs[0],
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with minimal form
 */
export const WithMinimalForm: Story = {
	args: {
		campaignId: "campaign-demo-3",
		initialConfig: mockFormConfigs[1],
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with comprehensive form
 */
export const WithComprehensiveForm: Story = {
	args: {
		campaignId: "campaign-demo-4",
		initialConfig: mockFormConfigs[2],
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with tech theme
 */
export const WithTechTheme: Story = {
	args: {
		campaignId: "campaign-demo-5",
		initialConfig: mockFormConfigs[3],
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with playful theme
 */
export const WithPlayfulTheme: Story = {
	args: {
		campaignId: "campaign-demo-6",
		initialConfig: mockFormConfigs[4],
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with multi-step form
 */
export const WithMultiStepForm: Story = {
	args: {
		campaignId: "campaign-demo-7",
		initialConfig: mockFormConfigs[5],
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with conditional logic
 */
export const WithConditionalLogic: Story = {
	args: {
		campaignId: "campaign-demo-8",
		initialConfig: mockFormConfigs[6],
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with dark theme
 */
export const WithDarkTheme: Story = {
	args: {
		campaignId: "campaign-demo-9",
		initialConfig: {
			...mockFormConfigs[0],
			id: "form-dark",
			design: {
				layout: "single-column",
				colors: {
					primary: "#8B5CF6",
					background: "#1F2937",
					text: "#F9FAFB",
					border: "#4B5563",
					error: "#FCA5A5",
					success: "#86EFAC",
				},
				typography: {
					fontFamily: "Space Grotesk",
					fontSize: 16,
					fontWeight: 500,
				},
				spacing: {
					padding: 24,
					gap: 16,
				},
				borderRadius: 10,
			},
		},
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Form builder with corporate theme (two-column)
 */
export const WithCorporateTheme: Story = {
	args: {
		campaignId: "campaign-demo-10",
		initialConfig: {
			...mockFormConfigs[2],
			design: {
				layout: "two-column",
				colors: {
					primary: "#1E40AF",
					background: "#F8FAFC",
					text: "#0F172A",
					border: "#CBD5E1",
					error: "#DC2626",
					success: "#059669",
				},
				typography: {
					fontFamily: "Arial",
					fontSize: 15,
					fontWeight: 400,
				},
				spacing: {
					padding: 32,
					gap: 20,
				},
				borderRadius: 6,
			},
		},
		onSave: async (config) => {
			console.log("Saving form config:", config);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			alert("Form saved successfully!");
		},
	},
};

/**
 * Interactive demo with save callback
 */
export const InteractiveDemo: Story = {
	args: {
		campaignId: "campaign-interactive",
		initialConfig: mockFormConfigs[0],
		onSave: async (config) => {
			console.log("Form configuration to be saved:", config);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Show detailed info
			const fieldCount = config.fields.length;
			const layout = config.design.layout;
			const message = `
Form saved successfully!

Details:
- Fields: ${fieldCount}
- Layout: ${layout}
- Primary Color: ${config.design.colors.primary}
- Font: ${config.design.typography.fontFamily}
      `;

			alert(message);
		},
	},
};

/**
 * Form builder demo - Complete workflow
 */
export const CompleteWorkflow: Story = {
	render: () => ({
		type: "div",
		props: {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "16px",
				padding: "24px",
				backgroundColor: "#f9fafb",
				minHeight: "100vh",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							padding: "20px",
							backgroundColor: "#fff",
							borderRadius: "8px",
							boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
						},
						children: [
							{
								type: "h1",
								props: {
									style: {
										margin: "0 0 8px 0",
										fontSize: "24px",
										fontWeight: 600,
										color: "#1f2937",
									},
									children: "Form Builder Demo",
								},
							},
							{
								type: "p",
								props: {
									style: {
										margin: 0,
										fontSize: "14px",
										color: "#6b7280",
									},
									children:
										"Try building a form using the drag-and-drop interface below. Add fields from the left panel, customize styles on the right, and preview your form.",
								},
							},
						],
					},
				},
				{
					type: FormBuilder,
					props: {
						campaignId: "campaign-workflow-demo",
						initialConfig: mockFormConfigs[0],
						onSave: async (config) => {
							console.log("Saving form:", config);
							await new Promise((resolve) => setTimeout(resolve, 1500));
							alert("✅ Form saved successfully!");
						},
					},
				},
			],
		},
	}),
};
