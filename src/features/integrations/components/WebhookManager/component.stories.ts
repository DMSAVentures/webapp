import type { Meta, StoryObj } from "@storybook/react";
import type { Webhook } from "@/types/common.types";
import { WebhookManager } from "./component";

// Mock webhooks data
const mockWebhooks: Webhook[] = [
	{
		id: "1",
		campaignId: "campaign-1",
		name: "Production Webhook",
		url: "https://api.example.com/webhooks/production",
		events: [
			"user.created",
			"user.verified",
			"referral.created",
			"reward.earned",
		],
		status: "active",
		secret: "whsec_abc123",
		headers: {
			"X-Custom-Header": "value",
		},
		retryConfig: {
			maxAttempts: 3,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 1250,
			successfulDeliveries: 1230,
			failedDeliveries: 20,
			lastDeliveryAt: new Date("2025-11-06T10:30:00"),
			lastSuccess: new Date("2025-11-06T10:30:00"),
			lastFailure: new Date("2025-11-05T14:20:00"),
		},
		createdAt: new Date("2025-10-01"),
	},
	{
		id: "2",
		campaignId: "campaign-1",
		name: "Development Webhook",
		url: "https://dev.example.com/webhooks/test",
		events: ["user.created", "user.verified"],
		status: "active",
		retryConfig: {
			maxAttempts: 5,
			backoffMultiplier: 1.5,
		},
		stats: {
			totalAttempts: 45,
			successfulDeliveries: 45,
			failedDeliveries: 0,
			lastDeliveryAt: new Date("2025-11-06T09:15:00"),
			lastSuccess: new Date("2025-11-06T09:15:00"),
		},
		createdAt: new Date("2025-10-15"),
	},
	{
		id: "3",
		campaignId: "campaign-1",
		name: "Legacy Webhook",
		url: "https://old-api.example.com/webhook",
		events: ["campaign.milestone"],
		status: "inactive",
		retryConfig: {
			maxAttempts: 3,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 0,
			successfulDeliveries: 0,
			failedDeliveries: 0,
		},
		createdAt: new Date("2025-08-20"),
	},
	{
		id: "4",
		campaignId: "campaign-1",
		name: "Failing Webhook",
		url: "https://broken.example.com/webhook",
		events: ["user.created", "referral.created"],
		status: "active",
		retryConfig: {
			maxAttempts: 3,
			backoffMultiplier: 2,
		},
		stats: {
			totalAttempts: 100,
			successfulDeliveries: 50,
			failedDeliveries: 50,
			lastDeliveryAt: new Date("2025-11-06T11:00:00"),
			lastSuccess: new Date("2025-11-05T18:30:00"),
			lastFailure: new Date("2025-11-06T11:00:00"),
		},
		createdAt: new Date("2025-09-10"),
	},
];

const meta = {
	title: "Features/Integrations/WebhookManager",
	component: WebhookManager,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
	argTypes: {
		onCreate: { action: "create" },
		onEdit: { action: "edit" },
		onDelete: { action: "delete" },
		onTest: { action: "test" },
		onViewLogs: { action: "view-logs" },
	},
} satisfies Meta<typeof WebhookManager>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default webhook manager with multiple webhooks
 */
export const Default: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: mockWebhooks,
	},
};

/**
 * Loading state with skeleton cards
 */
export const Loading: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: mockWebhooks,
		loading: true,
	},
};

/**
 * Empty state with no webhooks
 */
export const Empty: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: [],
	},
};

/**
 * Single webhook
 */
export const SingleWebhook: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: [mockWebhooks[0]],
	},
};

/**
 * Only active webhooks
 */
export const OnlyActive: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: mockWebhooks.filter((w) => w.status === "active"),
	},
};

/**
 * Only inactive webhooks
 */
export const OnlyInactive: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: mockWebhooks.filter((w) => w.status === "inactive"),
	},
};

/**
 * Webhook with high failure rate
 */
export const HighFailureRate: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: [mockWebhooks[3]],
	},
};

/**
 * Webhook with no attempts yet
 */
export const NoAttempts: Story = {
	args: {
		campaignId: "campaign-1",
		webhooks: [mockWebhooks[2]],
	},
};
