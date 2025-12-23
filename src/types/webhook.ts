/**
 * Webhook Type Definitions
 */

export interface Webhook {
	id: string;
	account_id: string;
	campaign_id?: string;
	url: string;
	events: string[];
	status: WebhookStatus;
	retry_enabled: boolean;
	max_retries: number;
	total_sent: number;
	total_failed: number;
	last_success_at?: string;
	last_failure_at?: string;
	created_at: string;
	updated_at: string;
}

export type WebhookStatus = "active" | "paused" | "failed";

export interface WebhookDelivery {
	id: string;
	webhook_id: string;
	event_type: string;
	payload: Record<string, unknown>;
	status: DeliveryStatus;
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

export type DeliveryStatus = "success" | "failed" | "pending";

// Request/Response types
export interface CreateWebhookRequest {
	url: string;
	campaign_id?: string;
	events: string[];
	retry_enabled?: boolean;
	max_retries?: number;
}

export interface CreateWebhookResponse {
	webhook: Webhook;
	secret: string;
}

export interface UpdateWebhookRequest {
	url?: string;
	events?: string[];
	status?: WebhookStatus;
	retry_enabled?: boolean;
	max_retries?: number;
}

export interface ListWebhookDeliveriesResponse {
	deliveries: WebhookDelivery[];
	pagination: {
		page: number;
		limit: number;
		offset: number;
	};
}

// Available webhook events
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
