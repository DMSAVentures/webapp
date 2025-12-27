/**
 * Email Blast Transformers
 *
 * Transform between API (snake_case) and UI (camelCase) blast types
 */

import type { BlastAnalytics, BlastRecipient, EmailBlast } from "@/types/blast";
import type {
	ApiBlastAnalytics,
	ApiBlastRecipient,
	ApiEmailBlast,
} from "../types/blast";
import { parseDate } from "./base";

// ============================================================================
// API → UI Transformers
// ============================================================================

export function toUiEmailBlast(api: ApiEmailBlast): EmailBlast {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		segmentId: api.segment_id,
		templateId: api.template_id,
		name: api.name,
		subject: api.subject,
		scheduledAt: parseDate(api.scheduled_at),
		startedAt: parseDate(api.started_at),
		completedAt: parseDate(api.completed_at),
		status: api.status,
		totalRecipients: api.total_recipients ?? 0,
		sentCount: api.sent_count ?? 0,
		deliveredCount: api.delivered_count ?? 0,
		openedCount: api.opened_count ?? 0,
		clickedCount: api.clicked_count ?? 0,
		bouncedCount: api.bounced_count ?? 0,
		failedCount: api.failed_count ?? 0,
		batchSize: api.batch_size ?? 100,
		currentBatch: api.current_batch ?? 0,
		lastBatchAt: parseDate(api.last_batch_at),
		errorMessage: api.error_message,
		sendThrottlePerSecond: api.send_throttle_per_second,
		createdBy: api.created_by,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiBlastRecipient(api: ApiBlastRecipient): BlastRecipient {
	return {
		id: api.id,
		blastId: api.blast_id,
		userId: api.user_id,
		email: api.email,
		status: api.status,
		emailLogId: api.email_log_id,
		queuedAt: parseDate(api.queued_at),
		sentAt: parseDate(api.sent_at),
		deliveredAt: parseDate(api.delivered_at),
		openedAt: parseDate(api.opened_at),
		clickedAt: parseDate(api.clicked_at),
		bouncedAt: parseDate(api.bounced_at),
		failedAt: parseDate(api.failed_at),
		errorMessage: api.error_message,
		batchNumber: api.batch_number,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiBlastAnalytics(api: ApiBlastAnalytics): BlastAnalytics {
	return {
		blastId: api.blast_id,
		name: api.name,
		status: api.status,
		totalRecipients: api.total_recipients,
		sent: api.sent,
		delivered: api.delivered,
		opened: api.opened,
		clicked: api.clicked,
		bounced: api.bounced,
		failed: api.failed,
		openRate: api.open_rate,
		clickRate: api.click_rate,
		bounceRate: api.bounce_rate,
		startedAt: parseDate(api.started_at),
		completedAt: parseDate(api.completed_at),
		durationSeconds: api.duration_seconds,
	};
}
