/**
 * Mock data for Campaign-related components
 * Used for Storybook stories and testing
 */

import type {
	Campaign,
	CampaignSettings,
	CampaignStats,
	User,
} from "../types/common.types";

// Mock Users (Campaign Owners)
export const mockUsers: User[] = [
	{
		id: "user-1",
		email: "sarah.chen@startupco.com",
		name: "Sarah Chen",
		role: "owner",
		permissions: ["all"],
		createdAt: new Date("2024-01-15T10:00:00Z"),
		updatedAt: new Date("2025-11-01T15:30:00Z"),
	},
	{
		id: "user-2",
		email: "alex.rivera@techstartup.io",
		name: "Alex Rivera",
		role: "admin",
		permissions: ["campaigns:read", "campaigns:write", "users:read"],
		createdAt: new Date("2024-03-20T08:00:00Z"),
		updatedAt: new Date("2025-11-03T12:15:00Z"),
	},
	{
		id: "user-3",
		email: "jordan.kim@productlaunch.com",
		name: "Jordan Kim",
		role: "editor",
		permissions: ["campaigns:read", "campaigns:write"],
		createdAt: new Date("2024-06-10T14:00:00Z"),
		updatedAt: new Date("2025-10-28T09:45:00Z"),
	},
];

// Mock Campaign Settings
export const mockCampaignSettings: Record<string, CampaignSettings> = {
	standard: {
		redirectUrl: "https://startupco.com/welcome",
		emailVerificationRequired: true,
		duplicateHandling: "block",
		enableReferrals: true,
		enableRewards: true,
	},
	noVerification: {
		redirectUrl: "https://example.com/thankyou",
		emailVerificationRequired: false,
		duplicateHandling: "update",
		enableReferrals: true,
		enableRewards: false,
	},
	minimal: {
		emailVerificationRequired: false,
		duplicateHandling: "allow",
		enableReferrals: false,
		enableRewards: false,
	},
	highSecurity: {
		redirectUrl: "https://secure-app.com/verified",
		emailVerificationRequired: true,
		duplicateHandling: "block",
		enableReferrals: true,
		enableRewards: true,
	},
};

// Mock Campaign Stats
export const mockCampaignStats: Record<string, CampaignStats> = {
	highPerformance: {
		totalSignups: 12547,
		verifiedSignups: 10234,
		totalReferrals: 8932,
		conversionRate: 81.6,
		viralCoefficient: 2.8,
	},
	mediumPerformance: {
		totalSignups: 3421,
		verifiedSignups: 2567,
		totalReferrals: 1843,
		conversionRate: 75.0,
		viralCoefficient: 1.5,
	},
	earlyStage: {
		totalSignups: 234,
		verifiedSignups: 189,
		totalReferrals: 145,
		conversionRate: 80.8,
		viralCoefficient: 1.8,
	},
	struggling: {
		totalSignups: 89,
		verifiedSignups: 45,
		totalReferrals: 12,
		conversionRate: 50.6,
		viralCoefficient: 0.4,
	},
	viral: {
		totalSignups: 45782,
		verifiedSignups: 42109,
		totalReferrals: 38654,
		conversionRate: 92.0,
		viralCoefficient: 3.5,
	},
};

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
	{
		id: "campaign-1",
		name: "SaaS Product Launch 2025",
		description:
			"Waitlist for our revolutionary project management tool launching Q2 2025",
		status: "active",
		formConfig: {
			id: "form-1",
			campaignId: "campaign-1",
			fields: [],
			design: {
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
			behavior: {
				submitAction: "referral-page",
				successMessage:
					"Thank you for joining! Share your link to move up the waitlist.",
				doubleOptIn: true,
				duplicateHandling: "block",
			},
		},
		settings: mockCampaignSettings.standard,
		stats: mockCampaignStats.highPerformance,
		createdAt: new Date("2024-09-15T10:00:00Z"),
		updatedAt: new Date("2025-11-04T14:22:00Z"),
		userId: "user-1",
	},
	{
		id: "campaign-2",
		name: "Mobile App Beta Launch",
		description: "Early access to our fitness tracking app",
		status: "active",
		formConfig: {
			id: "form-2",
			campaignId: "campaign-2",
			fields: [],
			design: {
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
			behavior: {
				submitAction: "inline-message",
				successMessage: "Welcome to the beta! Check your email for next steps.",
				doubleOptIn: true,
				duplicateHandling: "update",
			},
		},
		settings: mockCampaignSettings.standard,
		stats: mockCampaignStats.mediumPerformance,
		createdAt: new Date("2024-10-20T08:30:00Z"),
		updatedAt: new Date("2025-11-03T11:15:00Z"),
		userId: "user-2",
	},
	{
		id: "campaign-3",
		name: "E-commerce Platform Pre-Launch",
		description: "Be the first to sell on our new marketplace",
		status: "draft",
		formConfig: {
			id: "form-3",
			campaignId: "campaign-3",
			fields: [],
			design: {
				layout: "two-column",
				colors: {
					primary: "#EC4899",
					background: "#FFFFFF",
					text: "#0F172A",
					border: "#CBD5E1",
					error: "#F87171",
					success: "#34D399",
				},
				typography: {
					fontFamily: "Roboto",
					fontSize: 16,
					fontWeight: 400,
				},
				spacing: {
					padding: 32,
					gap: 20,
				},
				borderRadius: 6,
			},
			behavior: {
				submitAction: "redirect",
				redirectUrl: "https://ecommerce.com/seller-welcome",
				doubleOptIn: false,
				duplicateHandling: "allow",
			},
		},
		settings: mockCampaignSettings.noVerification,
		stats: mockCampaignStats.earlyStage,
		createdAt: new Date("2025-10-01T15:00:00Z"),
		updatedAt: new Date("2025-10-28T16:45:00Z"),
		userId: "user-3",
	},
	{
		id: "campaign-4",
		name: "AI Writing Assistant Waitlist",
		description: "Join thousands waiting for the smartest writing tool",
		status: "active",
		formConfig: {
			id: "form-4",
			campaignId: "campaign-4",
			fields: [],
			design: {
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
			behavior: {
				submitAction: "referral-page",
				successMessage: "You're on the list! Refer friends to skip the line.",
				doubleOptIn: true,
				duplicateHandling: "block",
			},
		},
		settings: mockCampaignSettings.highSecurity,
		stats: mockCampaignStats.viral,
		createdAt: new Date("2024-08-10T09:00:00Z"),
		updatedAt: new Date("2025-11-05T08:30:00Z"),
		userId: "user-1",
	},
	{
		id: "campaign-5",
		name: "Newsletter Signup - Tech Weekly",
		description: "Weekly newsletter on startup and tech news",
		status: "paused",
		formConfig: {
			id: "form-5",
			campaignId: "campaign-5",
			fields: [],
			design: {
				layout: "single-column",
				colors: {
					primary: "#F59E0B",
					background: "#FFFBEB",
					text: "#78350F",
					border: "#FCD34D",
					error: "#DC2626",
					success: "#10B981",
				},
				typography: {
					fontFamily: "Open Sans",
					fontSize: 15,
					fontWeight: 400,
				},
				spacing: {
					padding: 16,
					gap: 12,
				},
				borderRadius: 4,
			},
			behavior: {
				submitAction: "inline-message",
				successMessage: "Subscribed! First issue coming next Monday.",
				doubleOptIn: false,
				duplicateHandling: "update",
			},
		},
		settings: mockCampaignSettings.minimal,
		stats: mockCampaignStats.struggling,
		createdAt: new Date("2025-09-05T12:00:00Z"),
		updatedAt: new Date("2025-10-15T10:20:00Z"),
		userId: "user-2",
	},
	{
		id: "campaign-6",
		name: "Conference 2026 Early Bird",
		description: "Secure your spot at the biggest tech conference",
		status: "completed",
		formConfig: {
			id: "form-6",
			campaignId: "campaign-6",
			fields: [],
			design: {
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
					fontFamily: "Helvetica",
					fontSize: 16,
					fontWeight: 400,
				},
				spacing: {
					padding: 24,
					gap: 16,
				},
				borderRadius: 8,
			},
			behavior: {
				submitAction: "redirect",
				redirectUrl: "https://conference2026.com/confirmed",
				doubleOptIn: true,
				duplicateHandling: "block",
			},
		},
		settings: mockCampaignSettings.standard,
		stats: mockCampaignStats.mediumPerformance,
		createdAt: new Date("2024-06-01T07:00:00Z"),
		updatedAt: new Date("2025-09-30T18:00:00Z"),
		userId: "user-1",
	},
	{
		id: "campaign-7",
		name: "Crypto Wallet Beta Testing",
		description: "Test the future of decentralized finance",
		status: "active",
		formConfig: {
			id: "form-7",
			campaignId: "campaign-7",
			fields: [],
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
			behavior: {
				submitAction: "referral-page",
				successMessage: "You're in! Refer others to earn bonus tokens.",
				doubleOptIn: true,
				duplicateHandling: "block",
			},
		},
		settings: mockCampaignSettings.highSecurity,
		stats: mockCampaignStats.earlyStage,
		createdAt: new Date("2025-09-28T13:00:00Z"),
		updatedAt: new Date("2025-11-02T16:10:00Z"),
		userId: "user-3",
	},
];

// Mock campaign by status
export const mockCampaignsByStatus = {
	active: mockCampaigns.filter((c) => c.status === "active"),
	draft: mockCampaigns.filter((c) => c.status === "draft"),
	paused: mockCampaigns.filter((c) => c.status === "paused"),
	completed: mockCampaigns.filter((c) => c.status === "completed"),
};

// Helper function to get a campaign by ID
export const getMockCampaignById = (id: string): Campaign | undefined => {
	return mockCampaigns.find((campaign) => campaign.id === id);
};

// Helper function to get campaigns by user ID
export const getMockCampaignsByUserId = (userId: string): Campaign[] => {
	return mockCampaigns.filter((campaign) => campaign.userId === userId);
};

// Single campaign for detailed views
export const mockCampaignDetail = mockCampaigns[0];
