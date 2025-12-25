/**
 * Webhook API Types
 *
 * API request/response types for webhooks (snake_case)
 */

// ============================================================================
// Webhook Types (API Response)
// ============================================================================

export type ApiWebhookStatus = "active" | "paused" | "failed";
export type ApiDeliveryStatus = "success" | "failed" | "pending";

export interface ApiWebhook {
	id: string;
	account_id: string;
	campaign_id?: string;
	url: string;
	events: string[];
	status: ApiWebhookStatus;
	retry_enabled: boolean;
	max_retries: number;
	total_sent: number;
	total_failed: number;
	last_success_at?: string;
	last_failure_at?: string;
	created_at: string;
	updated_at: string;
}

export interface ApiWebhookDelivery {
	id: string;
	webhook_id: string;
	event_type: string;
	payload: Record<string, unknown>;
	status: ApiDeliveryStatus;
	request_headers?: Record<string, string>;
	response_status?: number;
	response_body?: string;
	response_headers?: Record<string, string>;
	duration_ms?: number;
	attempt_number: number;
	next_retry_at?: string;
	error_message?: string;
	created_at: string;
	delivered_at?: string;
}

// ============================================================================
// Request Types
// ============================================================================

export interface ApiCreateWebhookRequest {
	url: string;
	campaign_id?: string;
	events: string[];
	retry_enabled?: boolean;
	max_retries?: number;
}

export interface ApiCreateWebhookResponse {
	webhook: ApiWebhook;
	secret: string;
}

export interface ApiUpdateWebhookRequest {
	url?: string;
	events?: string[];
	status?: ApiWebhookStatus;
	retry_enabled?: boolean;
	max_retries?: number;
}

export interface ApiListWebhookDeliveriesResponse {
	deliveries: ApiWebhookDelivery[];
	total: number;
	pagination: {
		page: number;
		limit: number;
		offset: number;
	};
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

export type ApiWebhookEventType = keyof typeof WEBHOOK_EVENTS;
