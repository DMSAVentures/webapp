/**
 * Webhook UI Type Definitions
 *
 * UI types (camelCase) for webhooks
 */

// ============================================================================
// Webhook Types (UI - camelCase)
// ============================================================================

export type WebhookStatus = "active" | "paused" | "failed";
export type DeliveryStatus = "success" | "failed" | "pending";

export interface Webhook {
	id: string;
	accountId: string;
	campaignId?: string;
	url: string;
	events: string[];
	status: WebhookStatus;
	retryEnabled: boolean;
	maxRetries: number;
	totalSent: number;
	totalFailed: number;
	lastSuccessAt?: Date;
	lastFailureAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface WebhookDelivery {
	id: string;
	webhookId: string;
	eventType: string;
	payload: Record<string, unknown>;
	status: DeliveryStatus;
	requestHeaders?: Record<string, string>;
	responseStatus?: number;
	responseBody?: string;
	responseHeaders?: Record<string, string>;
	durationMs?: number;
	attemptNumber: number;
	nextRetryAt?: Date;
	errorMessage?: string;
	createdAt: Date;
	deliveredAt?: Date;
}

// ============================================================================
// Webhook Events
// ============================================================================

export const WEBHOOK_EVENTS = {
	// User events
	"user.created": "User signed up to waitlist",
	"user.updated": "User information updated",
	"user.verified": "User email verified",
	"user.deleted": "User removed from waitlist",
	"user.position_changed": "User position changed",
	"user.converted": "User converted",

	// Referral events
	"referral.created": "New referral created",
	"referral.verified": "Referral verified",
	"referral.converted": "Referral converted",

	// Reward events
	"reward.earned": "User earned a reward",
	"reward.delivered": "Reward delivered",
	"reward.redeemed": "Reward redeemed",

	// Campaign events
	"campaign.milestone": "Campaign reached milestone",
	"campaign.launched": "Campaign launched",
	"campaign.completed": "Campaign completed",
} as const;

export type WebhookEventType = keyof typeof WEBHOOK_EVENTS;
