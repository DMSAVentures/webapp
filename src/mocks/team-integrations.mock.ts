/**
 * Mock data for Team and Integration components
 * Used for Storybook stories and testing
 */

import type { Integration, TeamMember, Webhook } from "../types/common.types";

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
	{
		id: "team-1",
		userId: "user-1",
		email: "sarah.chen@startupco.com",
		name: "Sarah Chen",
		role: "owner",
		invitedAt: new Date("2024-01-15T10:00:00Z"),
		joinedAt: new Date("2024-01-15T10:05:00Z"),
		lastActiveAt: new Date("2025-11-05T08:30:00Z"),
	},
	{
		id: "team-2",
		userId: "user-2",
		email: "alex.rivera@techstartup.io",
		name: "Alex Rivera",
		role: "admin",
		invitedAt: new Date("2024-03-20T08:00:00Z"),
		joinedAt: new Date("2024-03-20T09:15:00Z"),
		lastActiveAt: new Date("2025-11-04T16:45:00Z"),
	},
	{
		id: "team-3",
		userId: "user-3",
		email: "jordan.kim@productlaunch.com",
		name: "Jordan Kim",
		role: "editor",
		invitedAt: new Date("2024-06-10T14:00:00Z"),
		joinedAt: new Date("2024-06-11T10:30:00Z"),
		lastActiveAt: new Date("2025-11-03T14:22:00Z"),
	},
	{
		id: "team-4",
		userId: "user-4",
		email: "morgan.taylor@startupco.com",
		name: "Morgan Taylor",
		role: "editor",
		invitedAt: new Date("2024-08-15T11:00:00Z"),
		joinedAt: new Date("2024-08-16T09:00:00Z"),
		lastActiveAt: new Date("2025-11-02T11:15:00Z"),
	},
	{
		id: "team-5",
		userId: "user-5",
		email: "casey.williams@consulting.com",
		name: "Casey Williams",
		role: "viewer",
		invitedAt: new Date("2024-09-05T15:30:00Z"),
		joinedAt: new Date("2024-09-06T08:45:00Z"),
		lastActiveAt: new Date("2025-10-28T10:00:00Z"),
	},
	{
		id: "team-6",
		userId: "user-6",
		email: "riley.anderson@startupco.com",
		name: "Riley Anderson",
		role: "viewer",
		invitedAt: new Date("2024-10-12T09:00:00Z"),
		joinedAt: new Date("2024-10-13T14:20:00Z"),
		lastActiveAt: new Date("2025-11-01T09:30:00Z"),
	},
	// Pending invitation
	{
		id: "team-7",
		userId: "user-7",
		email: "jamie.martinez@agency.com",
		name: "Jamie Martinez",
		role: "editor",
		invitedAt: new Date("2025-11-02T10:00:00Z"),
		joinedAt: undefined,
		lastActiveAt: undefined,
	},
	// Another pending invitation
	{
		id: "team-8",
		userId: "user-8",
		email: "sam.patel@freelancer.com",
		name: "Sam Patel",
		role: "viewer",
		invitedAt: new Date("2025-11-04T14:30:00Z"),
		joinedAt: undefined,
		lastActiveAt: undefined,
	},
];

// Mock Integrations
export const mockIntegrations: Integration[] = [
	{
		id: "int-1",
		name: "Zapier",
		type: "zapier",
		status: "connected",
		config: {
			apiKey: "zap_live_***************",
			webhookUrl: "https://hooks.zapier.com/hooks/catch/12345/abcdef",
		},
		lastSyncedAt: new Date("2025-11-05T07:30:00Z"),
		createdAt: new Date("2024-09-20T10:00:00Z"),
	},
	{
		id: "int-2",
		name: "Mailchimp",
		type: "mailchimp",
		status: "connected",
		config: {
			apiKey: "mc_***************",
			audienceId: "abc123def456",
			server: "us12",
			syncEnabled: true,
		},
		lastSyncedAt: new Date("2025-11-05T08:15:00Z"),
		createdAt: new Date("2024-09-25T11:30:00Z"),
	},
	{
		id: "int-3",
		name: "HubSpot",
		type: "hubspot",
		status: "error",
		config: {
			apiKey: "hub_***************",
			portalId: "12345678",
			syncContacts: true,
			syncDeals: false,
		},
		lastSyncedAt: new Date("2025-11-02T14:00:00Z"),
		createdAt: new Date("2024-10-05T09:00:00Z"),
	},
	{
		id: "int-4",
		name: "Salesforce",
		type: "salesforce",
		status: "disconnected",
		config: {
			instanceUrl: "https://startupco.my.salesforce.com",
			clientId: "sf_***************",
		},
		lastSyncedAt: new Date("2025-10-15T10:00:00Z"),
		createdAt: new Date("2024-08-10T14:00:00Z"),
	},
	{
		id: "int-5",
		name: "Google Analytics",
		type: "google_analytics",
		status: "connected",
		config: {
			measurementId: "G-XXXXXXXXXX",
			propertyId: "12345678",
			trackEvents: ["signup", "referral", "conversion"],
		},
		lastSyncedAt: new Date("2025-11-05T08:45:00Z"),
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "int-6",
		name: "Facebook Pixel",
		type: "facebook_pixel",
		status: "connected",
		config: {
			pixelId: "1234567890123456",
			accessToken: "fb_***************",
			trackPageView: true,
			trackCustomEvents: true,
		},
		lastSyncedAt: new Date("2025-11-05T08:00:00Z"),
		createdAt: new Date("2024-09-18T11:00:00Z"),
	},
	{
		id: "int-7",
		name: "Slack Notifications",
		type: "custom",
		status: "connected",
		config: {
			webhookUrl: "https://hooks.slack.com/services/T00/B00/XXXXX",
			channel: "#waitlist-signups",
			notifyOnSignup: true,
			notifyOnMilestone: true,
		},
		lastSyncedAt: new Date("2025-11-05T08:35:00Z"),
		createdAt: new Date("2024-09-16T12:00:00Z"),
	},
	{
		id: "int-8",
		name: "Custom Webhook",
		type: "webhook",
		status: "connected",
		config: {
			url: "https://api.example.com/webhooks/waitlist",
			secret: "whsec_***************",
			events: ["user.created", "user.verified", "referral.created"],
		},
		lastSyncedAt: new Date("2025-11-05T08:20:00Z"),
		createdAt: new Date("2024-10-01T15:00:00Z"),
	},
	{
		id: "int-9",
		name: "Stripe",
		type: "custom",
		status: "disconnected",
		config: {
			apiKey: "sk_live_***************",
			webhookSecret: "whsec_***************",
		},
		lastSyncedAt: undefined,
		createdAt: new Date("2024-11-01T10:00:00Z"),
	},
];

// Mock Webhooks
export const mockWebhooks: Webhook[] = [
	{
		id: "webhook-1",
		campaignId: "campaign-1",
		name: "New User Notification",
		url: "https://api.example.com/webhooks/new-user",
		events: ["user.created", "user.verified"],
		status: "active",
		secret: "whsec_a1b2c3d4e5f6g7h8i9j0",
		headers: {
			"X-Custom-Header": "campaign-1",
			Authorization: "Bearer token123",
		},
		retryConfig: {
			maxAttempts: 3,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 12547,
			successfulDeliveries: 12389,
			failedDeliveries: 158,
			lastDeliveryAt: new Date("2025-11-05T08:45:00Z"),
			lastSuccess: new Date("2025-11-05T08:45:00Z"),
			lastFailure: new Date("2025-11-04T14:22:00Z"),
		},
		createdAt: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "webhook-2",
		campaignId: "campaign-1",
		name: "Referral Tracking",
		url: "https://analytics.example.com/track/referral",
		events: ["referral.created"],
		status: "active",
		secret: "whsec_k9l8m7n6o5p4q3r2s1t0",
		headers: {
			"Content-Type": "application/json",
		},
		retryConfig: {
			maxAttempts: 5,
			backoffMultiplier: 1.5,
		},
		stats: {
			totalAttempts: 8932,
			successfulDeliveries: 8876,
			failedDeliveries: 56,
			lastDeliveryAt: new Date("2025-11-05T08:30:00Z"),
			lastSuccess: new Date("2025-11-05T08:30:00Z"),
			lastFailure: new Date("2025-11-03T11:15:00Z"),
		},
		createdAt: new Date("2024-09-18T14:00:00Z"),
	},
	{
		id: "webhook-3",
		campaignId: "campaign-1",
		name: "Reward Distribution",
		url: "https://rewards.example.com/api/distribute",
		events: ["reward.earned"],
		status: "active",
		secret: "whsec_u0v9w8x7y6z5a4b3c2d1",
		headers: {
			"X-API-Key": "api_key_12345",
		},
		retryConfig: {
			maxAttempts: 3,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 234,
			successfulDeliveries: 228,
			failedDeliveries: 6,
			lastDeliveryAt: new Date("2025-11-04T16:20:00Z"),
			lastSuccess: new Date("2025-11-04T16:20:00Z"),
			lastFailure: new Date("2025-10-28T09:45:00Z"),
		},
		createdAt: new Date("2024-10-01T10:00:00Z"),
	},
	{
		id: "webhook-4",
		campaignId: "campaign-1",
		name: "Campaign Milestones",
		url: "https://slack.example.com/webhooks/milestone",
		events: ["campaign.milestone"],
		status: "active",
		secret: undefined,
		headers: undefined,
		retryConfig: {
			maxAttempts: 2,
			backoffMultiplier: 1,
		},
		stats: {
			totalAttempts: 45,
			successfulDeliveries: 45,
			failedDeliveries: 0,
			lastDeliveryAt: new Date("2025-11-01T12:00:00Z"),
			lastSuccess: new Date("2025-11-01T12:00:00Z"),
			lastFailure: undefined,
		},
		createdAt: new Date("2024-09-20T11:00:00Z"),
	},
	{
		id: "webhook-5",
		campaignId: "campaign-2",
		name: "Beta User Sync",
		url: "https://api.fitnessapp.com/beta/sync",
		events: ["user.created", "user.verified", "user.invited"],
		status: "active",
		secret: "whsec_e1f2g3h4i5j6k7l8m9n0",
		headers: {
			"X-App-Version": "v2.0",
			Authorization: "Bearer beta_token_xyz",
		},
		retryConfig: {
			maxAttempts: 4,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 3421,
			successfulDeliveries: 3398,
			failedDeliveries: 23,
			lastDeliveryAt: new Date("2025-11-05T08:15:00Z"),
			lastSuccess: new Date("2025-11-05T08:15:00Z"),
			lastFailure: new Date("2025-11-02T10:30:00Z"),
		},
		createdAt: new Date("2024-10-20T08:30:00Z"),
	},
	{
		id: "webhook-6",
		campaignId: "campaign-4",
		name: "CRM Integration",
		url: "https://crm.example.com/api/contacts/sync",
		events: ["user.created", "user.verified"],
		status: "inactive",
		secret: "whsec_o0p9q8r7s6t5u4v3w2x1",
		headers: {
			"X-CRM-Key": "crm_key_abc123",
		},
		retryConfig: {
			maxAttempts: 3,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 892,
			successfulDeliveries: 745,
			failedDeliveries: 147,
			lastDeliveryAt: new Date("2025-10-15T14:00:00Z"),
			lastSuccess: new Date("2025-10-15T11:30:00Z"),
			lastFailure: new Date("2025-10-15T14:00:00Z"),
		},
		createdAt: new Date("2024-08-15T09:00:00Z"),
	},
	{
		id: "webhook-7",
		campaignId: "campaign-1",
		name: "Analytics Pipeline",
		url: "https://data.example.com/ingest/waitlist",
		events: [
			"user.created",
			"user.verified",
			"referral.created",
			"reward.earned",
			"campaign.milestone",
		],
		status: "active",
		secret: "whsec_y1z2a3b4c5d6e7f8g9h0",
		headers: {
			"X-Data-Source": "waitlist-campaign",
			"X-Pipeline-Version": "v3",
		},
		retryConfig: {
			maxAttempts: 5,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 21890,
			successfulDeliveries: 21745,
			failedDeliveries: 145,
			lastDeliveryAt: new Date("2025-11-05T08:50:00Z"),
			lastSuccess: new Date("2025-11-05T08:50:00Z"),
			lastFailure: new Date("2025-11-04T16:45:00Z"),
		},
		createdAt: new Date("2024-09-22T13:00:00Z"),
	},
];

// Helper functions for Team Members
export const getMockTeamMemberById = (id: string): TeamMember | undefined => {
	return mockTeamMembers.find((member) => member.id === id);
};

export const getMockTeamMembersByRole = (
	role: TeamMember["role"],
): TeamMember[] => {
	return mockTeamMembers.filter((member) => member.role === role);
};

export const getMockActiveTeamMembers = (): TeamMember[] => {
	return mockTeamMembers.filter((member) => member.joinedAt !== undefined);
};

export const getMockPendingInvitations = (): TeamMember[] => {
	return mockTeamMembers.filter((member) => member.joinedAt === undefined);
};

// Helper functions for Integrations
export const getMockIntegrationById = (id: string): Integration | undefined => {
	return mockIntegrations.find((integration) => integration.id === id);
};

export const getMockIntegrationsByType = (
	type: Integration["type"],
): Integration[] => {
	return mockIntegrations.filter((integration) => integration.type === type);
};

export const getMockIntegrationsByStatus = (
	status: Integration["status"],
): Integration[] => {
	return mockIntegrations.filter(
		(integration) => integration.status === status,
	);
};

export const getMockConnectedIntegrations = (): Integration[] => {
	return mockIntegrations.filter(
		(integration) => integration.status === "connected",
	);
};

// Helper functions for Webhooks
export const getMockWebhookById = (id: string): Webhook | undefined => {
	return mockWebhooks.find((webhook) => webhook.id === id);
};

export const getMockWebhooksByCampaign = (campaignId: string): Webhook[] => {
	return mockWebhooks.filter((webhook) => webhook.campaignId === campaignId);
};

export const getMockWebhooksByStatus = (
	status: Webhook["status"],
): Webhook[] => {
	return mockWebhooks.filter((webhook) => webhook.status === status);
};

export const getMockActiveWebhooks = (): Webhook[] => {
	return mockWebhooks.filter((webhook) => webhook.status === "active");
};

// Mock webhook delivery logs (for detailed view)
export const mockWebhookDeliveryLogs = [
	{
		id: "log-1",
		webhookId: "webhook-1",
		timestamp: new Date("2025-11-05T08:45:00Z"),
		event: "user.verified",
		status: "success",
		statusCode: 200,
		responseTime: 145,
		payload: {
			event: "user.verified",
			userId: "wuser-9",
			email: "noah.wilson@protonmail.com",
			timestamp: "2025-11-05T08:45:00Z",
		},
		response: { success: true, message: "User processed" },
	},
	{
		id: "log-2",
		webhookId: "webhook-1",
		timestamp: new Date("2025-11-04T14:22:00Z"),
		event: "user.created",
		status: "failed",
		statusCode: 500,
		responseTime: 5002,
		payload: {
			event: "user.created",
			userId: "wuser-test",
			email: "test@example.com",
			timestamp: "2025-11-04T14:22:00Z",
		},
		response: { error: "Internal server error" },
		retryAttempt: 3,
	},
	{
		id: "log-3",
		webhookId: "webhook-2",
		timestamp: new Date("2025-11-05T08:30:00Z"),
		event: "referral.created",
		status: "success",
		statusCode: 200,
		responseTime: 98,
		payload: {
			event: "referral.created",
			referrerId: "wuser-1",
			referredUserId: "wuser-23",
			timestamp: "2025-11-05T08:30:00Z",
		},
		response: { tracked: true },
	},
];

// Mock integration categories for the marketplace
export const mockIntegrationCategories = {
	email: mockIntegrations.filter((i) => ["mailchimp"].includes(i.type)),
	crm: mockIntegrations.filter((i) =>
		["hubspot", "salesforce"].includes(i.type),
	),
	analytics: mockIntegrations.filter((i) =>
		["google_analytics", "facebook_pixel"].includes(i.type),
	),
	automation: mockIntegrations.filter((i) => ["zapier"].includes(i.type)),
	webhook: mockIntegrations.filter((i) =>
		["webhook", "custom"].includes(i.type),
	),
};

// Mock team activity logs
export const mockTeamActivityLogs = [
	{
		id: "activity-1",
		userId: "user-1",
		userName: "Sarah Chen",
		action: "created_campaign",
		details: 'Created campaign "SaaS Product Launch 2025"',
		timestamp: new Date("2024-09-15T10:00:00Z"),
	},
	{
		id: "activity-2",
		userId: "user-2",
		userName: "Alex Rivera",
		action: "invited_member",
		details: "Invited jordan.kim@productlaunch.com to the team",
		timestamp: new Date("2024-06-10T14:00:00Z"),
	},
	{
		id: "activity-3",
		userId: "user-3",
		userName: "Jordan Kim",
		action: "updated_form",
		details: "Updated form design for Campaign #1",
		timestamp: new Date("2025-11-03T14:22:00Z"),
	},
	{
		id: "activity-4",
		userId: "user-1",
		userName: "Sarah Chen",
		action: "connected_integration",
		details: "Connected Mailchimp integration",
		timestamp: new Date("2024-09-25T11:30:00Z"),
	},
];
