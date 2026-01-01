import type { Meta, StoryObj } from "@storybook/react";
import type { ApiFormSettingsDesign } from "@/api/types";
import type { Campaign, FormSettings } from "@/types/campaign";
import { CampaignFormPreview } from "./component";

// Helper to create form settings with design embedded in custom CSS
const createFormSettings = (
	designOverrides?: Partial<ApiFormSettingsDesign>,
): FormSettings => {
	const design: ApiFormSettingsDesign = {
		layout: "single-column",
		colors: {
			primary: "#3b82f6",
			background: "#ffffff",
			text: "#1f2937",
			border: "#e5e7eb",
			error: "#ef4444",
			success: "#10b981",
		},
		typography: {
			fontFamily: "Inter, system-ui, sans-serif",
			fontSize: 16,
			fontWeight: 400,
		},
		spacing: {
			padding: 16,
			gap: 16,
		},
		borderRadius: 8,
		customCss: "",
		...designOverrides,
	};

	return {
		id: "form-settings-1",
		campaignId: "campaign-123",
		captchaEnabled: false,
		doubleOptIn: false,
		design,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-15"),
	};
};

const mockCampaign: Campaign = {
	id: "campaign-123",
	accountId: "account-456",
	name: "Product Launch Waitlist",
	slug: "product-launch",
	type: "waitlist",
	status: "active",
	description: "Join our product launch waitlist",
	totalSignups: 150,
	totalVerified: 120,
	totalReferrals: 45,
	createdAt: new Date("2024-01-01"),
	updatedAt: new Date("2024-01-15"),
	formSettings: createFormSettings(),
	formFields: [
		{
			id: "field-1",
			campaignId: "campaign-123",
			name: "email",
			fieldType: "email",
			label: "Email Address",
			placeholder: "you@example.com",
			required: true,
			displayOrder: 0,
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-15"),
		},
		{
			id: "field-2",
			campaignId: "campaign-123",
			name: "firstName",
			fieldType: "text",
			label: "First Name",
			placeholder: "John",
			required: true,
			displayOrder: 1,
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-15"),
		},
		{
			id: "field-3",
			campaignId: "campaign-123",
			name: "company",
			fieldType: "text",
			label: "Company",
			placeholder: "Acme Inc.",
			required: false,
			displayOrder: 2,
			createdAt: new Date("2024-01-01"),
			updatedAt: new Date("2024-01-15"),
		},
	],
};

const meta = {
	title: "Features/Campaigns/CampaignFormPreview",
	component: CampaignFormPreview,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof CampaignFormPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		campaign: mockCampaign,
	},
};

export const TwoColumnLayout: Story = {
	args: {
		campaign: {
			...mockCampaign,
			formSettings: createFormSettings({
				layout: "two-column",
				colors: {
					primary: "#8b5cf6",
					background: "#ffffff",
					text: "#1f2937",
					border: "#e5e7eb",
					error: "#ef4444",
					success: "#10b981",
				},
			}),
		},
	},
};

export const CustomColors: Story = {
	args: {
		campaign: {
			...mockCampaign,
			formSettings: createFormSettings({
				layout: "single-column",
				colors: {
					primary: "#ec4899",
					background: "#fdf2f8",
					text: "#831843",
					border: "#fbcfe8",
					error: "#be123c",
					success: "#15803d",
				},
				spacing: {
					padding: 20,
					gap: 20,
				},
				borderRadius: 12,
			}),
		},
	},
};
