/**
 * Mock data for Form Builder components
 * Used for Storybook stories and testing
 */

import type {
	FormBehavior,
	FormConfig,
	FormDesign,
	FormField,
} from "../types/common.types";

// Mock Form Fields
export const mockFormFields: Record<string, FormField[]> = {
	minimal: [
		{
			id: "field-email-1",
			type: "email",
			label: "Email Address",
			placeholder: "your@email.com",
			required: true,
			order: 1,
		},
	],
	standard: [
		{
			id: "field-email-2",
			type: "email",
			label: "Email Address",
			placeholder: "your@email.com",
			required: true,
			order: 1,
			validation: {
				customError: "Please enter a valid email address",
			},
		},
		{
			id: "field-name-1",
			type: "text",
			label: "Full Name",
			placeholder: "John Doe",
			required: true,
			order: 2,
			validation: {
				minLength: 2,
				maxLength: 100,
			},
		},
	],
	comprehensive: [
		{
			id: "field-email-3",
			type: "email",
			label: "Work Email",
			placeholder: "name@company.com",
			required: true,
			order: 1,
			validation: {
				pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
				customError: "Please use your work email",
			},
		},
		{
			id: "field-firstname-1",
			type: "text",
			label: "First Name",
			placeholder: "John",
			required: true,
			order: 2,
			validation: {
				minLength: 1,
				maxLength: 50,
			},
		},
		{
			id: "field-lastname-1",
			type: "text",
			label: "Last Name",
			placeholder: "Doe",
			required: true,
			order: 3,
			validation: {
				minLength: 1,
				maxLength: 50,
			},
		},
		{
			id: "field-company-1",
			type: "text",
			label: "Company Name",
			placeholder: "Acme Inc.",
			required: true,
			order: 4,
			validation: {
				minLength: 2,
				maxLength: 100,
			},
		},
		{
			id: "field-role-1",
			type: "select",
			label: "Job Role",
			placeholder: "Select your role",
			required: true,
			order: 5,
			options: [
				"Founder/CEO",
				"Product Manager",
				"Engineer",
				"Designer",
				"Marketing",
				"Sales",
				"Other",
			],
		},
		{
			id: "field-company-size-1",
			type: "radio",
			label: "Company Size",
			required: false,
			order: 6,
			options: ["1-10", "11-50", "51-200", "201-500", "500+"],
		},
		{
			id: "field-interests-1",
			type: "checkbox",
			label: "I'm interested in",
			required: false,
			order: 7,
			options: [
				"Product updates",
				"Early access features",
				"Partner opportunities",
				"Case studies",
			],
		},
	],
	multiStep: [
		// Step 1: Contact Info
		{
			id: "field-email-4",
			type: "email",
			label: "Email Address",
			placeholder: "your@email.com",
			required: true,
			order: 1,
		},
		{
			id: "field-name-2",
			type: "text",
			label: "Full Name",
			placeholder: "Jane Smith",
			required: true,
			order: 2,
		},
		{
			id: "field-phone-1",
			type: "phone",
			label: "Phone Number",
			placeholder: "+1 (555) 123-4567",
			required: false,
			order: 3,
			validation: {
				pattern:
					"^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$",
			},
		},
		// Step 2: Company Info
		{
			id: "field-company-2",
			type: "text",
			label: "Company",
			placeholder: "Your company name",
			required: true,
			order: 4,
		},
		{
			id: "field-website-1",
			type: "url",
			label: "Website",
			placeholder: "https://example.com",
			required: false,
			order: 5,
			validation: {
				pattern: "^https?:\\/\\/.+",
			},
		},
		{
			id: "field-industry-1",
			type: "select",
			label: "Industry",
			placeholder: "Select industry",
			required: true,
			order: 6,
			options: [
				"Technology",
				"Finance",
				"Healthcare",
				"Education",
				"Retail",
				"Manufacturing",
				"Other",
			],
		},
		// Step 3: Additional Info
		{
			id: "field-use-case-1",
			type: "textarea",
			label: "Tell us about your use case",
			placeholder: "What are you hoping to achieve?",
			required: false,
			order: 7,
			validation: {
				maxLength: 500,
			},
		},
		{
			id: "field-launch-date-1",
			type: "date",
			label: "Expected Launch Date",
			required: false,
			order: 8,
		},
		{
			id: "field-budget-1",
			type: "number",
			label: "Monthly Budget (USD)",
			placeholder: "1000",
			required: false,
			order: 9,
			validation: {
				min: 0,
				max: 1000000,
			},
		},
	],
	withConditionalLogic: [
		{
			id: "field-email-5",
			type: "email",
			label: "Email",
			placeholder: "email@example.com",
			required: true,
			order: 1,
		},
		{
			id: "field-user-type-1",
			type: "select",
			label: "I am a",
			placeholder: "Select option",
			required: true,
			order: 2,
			options: ["Individual", "Business", "Agency"],
		},
		{
			id: "field-company-3",
			type: "text",
			label: "Company Name",
			placeholder: "Your company",
			required: true,
			order: 3,
			conditionalLogic: {
				showIf: {
					fieldId: "field-user-type-1",
					operator: "not_equals",
					value: "Individual",
				},
			},
		},
		{
			id: "field-team-size-1",
			type: "number",
			label: "Team Size",
			placeholder: "10",
			required: true,
			order: 4,
			validation: {
				min: 1,
				max: 10000,
			},
			conditionalLogic: {
				showIf: {
					fieldId: "field-user-type-1",
					operator: "equals",
					value: "Business",
				},
			},
		},
		{
			id: "field-clients-1",
			type: "number",
			label: "Number of Clients",
			placeholder: "25",
			required: true,
			order: 5,
			validation: {
				min: 1,
			},
			conditionalLogic: {
				showIf: {
					fieldId: "field-user-type-1",
					operator: "equals",
					value: "Agency",
				},
			},
		},
	],
};

// Mock Form Designs
export const mockFormDesigns: Record<string, FormDesign> = {
	modern: {
		layout: "single-column",
		colors: {
			primary: "#3B82F6",
			background: "#FFFFFF",
			text: "#1F2937",
			border: "#E5E7EB",
			error: "#EF4444",
			success: "#10B981",
		},
		typography: {
			fontFamily: "Inter",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 24,
			gap: 16,
		},
		borderRadius: 8,
	},
	vibrant: {
		layout: "single-column",
		colors: {
			primary: "#8B5CF6",
			background: "#F9FAFB",
			text: "#111827",
			border: "#D1D5DB",
			error: "#DC2626",
			success: "#059669",
		},
		typography: {
			fontFamily: "Poppins",
			fontSize: 15,
			fontWeight: 400,
		},
		spacing: {
			padding: 20,
			gap: 12,
		},
		borderRadius: 12,
	},
	minimal: {
		layout: "single-column",
		colors: {
			primary: "#000000",
			background: "#FFFFFF",
			text: "#000000",
			border: "#D1D5DB",
			error: "#DC2626",
			success: "#16A34A",
		},
		typography: {
			fontFamily: "Helvetica",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 32,
			gap: 20,
		},
		borderRadius: 4,
	},
	dark: {
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
	playful: {
		layout: "single-column",
		colors: {
			primary: "#EC4899",
			background: "#FFF1F2",
			text: "#881337",
			border: "#FBBF24",
			error: "#DC2626",
			success: "#10B981",
		},
		typography: {
			fontFamily: "Comic Sans MS",
			fontSize: 17,
			fontWeight: 600,
		},
		spacing: {
			padding: 28,
			gap: 18,
		},
		borderRadius: 20,
	},
	corporate: {
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
	tech: {
		layout: "single-column",
		colors: {
			primary: "#14B8A6",
			background: "#F0FDFA",
			text: "#134E4A",
			border: "#99F6E4",
			error: "#DC2626",
			success: "#14B8A6",
		},
		typography: {
			fontFamily: "DM Sans",
			fontSize: 17,
			fontWeight: 400,
		},
		spacing: {
			padding: 28,
			gap: 18,
		},
		borderRadius: 16,
	},
	multiStepWizard: {
		layout: "multi-step",
		colors: {
			primary: "#6366F1",
			background: "#FFFFFF",
			text: "#1E293B",
			border: "#E2E8F0",
			error: "#EF4444",
			success: "#22C55E",
		},
		typography: {
			fontFamily: "Roboto",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 24,
			gap: 16,
		},
		borderRadius: 8,
	},
};

// Mock Form Behaviors
export const mockFormBehaviors: Record<string, FormBehavior> = {
	inlineSuccess: {
		submitAction: "inline-message",
		successMessage:
			"Thank you for joining! Check your email for the next steps.",
		duplicateHandling: "block",
	},
	redirectToThankYou: {
		submitAction: "redirect",
		redirectUrl: "https://example.com/thank-you",
		duplicateHandling: "update",
	},
	showReferralPage: {
		submitAction: "referral-page",
		successMessage: "You're on the list! Share your unique link to move up.",
		duplicateHandling: "block",
	},
	simpleConfirmation: {
		submitAction: "inline-message",
		successMessage: "All set! We'll be in touch soon.",
		duplicateHandling: "allow",
	},
	strictVerification: {
		submitAction: "inline-message",
		successMessage: "Please check your email to verify your address.",
		duplicateHandling: "block",
	},
};

// Mock Complete Form Configurations
export const mockFormConfigs: FormConfig[] = [
	{
		id: "form-1",
		campaignId: "campaign-1",
		fields: mockFormFields.standard,
		design: mockFormDesigns.modern,
		behavior: mockFormBehaviors.showReferralPage,
	},
	{
		id: "form-2",
		campaignId: "campaign-2",
		fields: mockFormFields.minimal,
		design: mockFormDesigns.vibrant,
		behavior: mockFormBehaviors.inlineSuccess,
	},
	{
		id: "form-3",
		campaignId: "campaign-3",
		fields: mockFormFields.comprehensive,
		design: mockFormDesigns.corporate,
		behavior: mockFormBehaviors.redirectToThankYou,
	},
	{
		id: "form-4",
		campaignId: "campaign-4",
		fields: mockFormFields.standard,
		design: mockFormDesigns.tech,
		behavior: mockFormBehaviors.showReferralPage,
	},
	{
		id: "form-5",
		campaignId: "campaign-5",
		fields: mockFormFields.minimal,
		design: mockFormDesigns.playful,
		behavior: mockFormBehaviors.simpleConfirmation,
	},
	{
		id: "form-6",
		campaignId: "campaign-6",
		fields: mockFormFields.multiStep,
		design: mockFormDesigns.multiStepWizard,
		behavior: mockFormBehaviors.strictVerification,
	},
	{
		id: "form-7",
		campaignId: "campaign-7",
		fields: mockFormFields.withConditionalLogic,
		design: mockFormDesigns.dark,
		behavior: mockFormBehaviors.showReferralPage,
	},
];

// Helper functions
export const getMockFormConfigById = (id: string): FormConfig | undefined => {
	return mockFormConfigs.find((config) => config.id === id);
};

export const getMockFormConfigByCampaign = (
	campaignId: string,
): FormConfig | undefined => {
	return mockFormConfigs.find((config) => config.campaignId === campaignId);
};

export const getMockFormsByLayout = (
	layout: FormDesign["layout"],
): FormConfig[] => {
	return mockFormConfigs.filter((config) => config.design.layout === layout);
};

// Form field templates for drag-drop palette
export const mockFieldTemplates: Omit<FormField, "id" | "order">[] = [
	{
		type: "email",
		label: "Email Address",
		placeholder: "your@email.com",
		required: true,
	},
	{
		type: "text",
		label: "Text Input",
		placeholder: "Enter text",
		required: false,
	},
	{
		type: "textarea",
		label: "Long Text",
		placeholder: "Enter detailed information",
		required: false,
		validation: {
			maxLength: 500,
		},
	},
	{
		type: "select",
		label: "Dropdown",
		placeholder: "Select an option",
		required: false,
		options: ["Option 1", "Option 2", "Option 3"],
	},
	{
		type: "checkbox",
		label: "Checkboxes",
		required: false,
		options: ["Choice 1", "Choice 2", "Choice 3"],
	},
	{
		type: "radio",
		label: "Radio Buttons",
		required: false,
		options: ["Choice A", "Choice B", "Choice C"],
	},
	{
		type: "phone",
		label: "Phone Number",
		placeholder: "+1 (555) 123-4567",
		required: false,
	},
	{
		type: "url",
		label: "Website URL",
		placeholder: "https://example.com",
		required: false,
	},
	{
		type: "date",
		label: "Date",
		placeholder: "Select a date",
		required: false,
	},
	{
		type: "number",
		label: "Number",
		placeholder: "0",
		required: false,
		validation: {
			min: 0,
		},
	},
];

// Example custom CSS for form designs
export const mockCustomCss = `
/* Custom form styling */
.form-container {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-field:focus {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.submit-button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
`;
