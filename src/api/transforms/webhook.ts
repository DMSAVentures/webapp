/**
 * Webhook Transformers
 *
 * Transform between API (snake_case) and UI (camelCase) webhook types
 */

import type { Webhook, WebhookDelivery } from "@/types/webhook";
import type { ApiWebhook, ApiWebhookDelivery } from "../types/webhook";
import { parseDate } from "./base";

// ============================================================================
// API → UI Transformers
// ============================================================================

export function toUiWebhook(api: ApiWebhook): Webhook {
	return {
		id: api.id,
		accountId: api.account_id,
		campaignId: api.campaign_id,
		url: api.url,
		events: api.events,
		status: api.status,
		retryEnabled: api.retry_enabled,
		maxRetries: api.max_retries,
		totalSent: api.total_sent,
		totalFailed: api.total_failed,
		lastSuccessAt: parseDate(api.last_success_at),
		lastFailureAt: parseDate(api.last_failure_at),
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiWebhookDelivery(api: ApiWebhookDelivery): WebhookDelivery {
	return {
		id: api.id,
		webhookId: api.webhook_id,
		eventType: api.event_type,
		payload: api.payload,
		status: api.status,
		requestHeaders: api.request_headers,
		responseStatus: api.response_status,
		responseBody: api.response_body,
		responseHeaders: api.response_headers,
		durationMs: api.duration_ms,
		attemptNumber: api.attempt_number,
		nextRetryAt: parseDate(api.next_retry_at),
		errorMessage: api.error_message,
		createdAt: parseDate(api.created_at)!,
		deliveredAt: parseDate(api.delivered_at),
	};
}

// ============================================================================
// UI → API Transformers (for requests)
// ============================================================================

export function toApiCreateWebhookRequest(
	webhook: Partial<Webhook>,
): import("../types/webhook").ApiCreateWebhookRequest {
	return {
		url: webhook.url!,
		campaign_id: webhook.campaignId,
		events: webhook.events!,
		retry_enabled: webhook.retryEnabled,
		max_retries: webhook.maxRetries,
	};
}

export function toApiUpdateWebhookRequest(
	webhook: Partial<Webhook>,
): import("../types/webhook").ApiUpdateWebhookRequest {
	return {
		url: webhook.url,
		events: webhook.events,
		status: webhook.status,
		retry_enabled: webhook.retryEnabled,
		max_retries: webhook.maxRetries,
	};
}
