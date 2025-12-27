/**
 * Email Blast API Types
 *
 * API request/response types matching Go backend (snake_case)
 */

// ============================================================================
// Email Blast Core Types (API Response)
// ============================================================================

export interface ApiEmailBlast {
	id: string;
	campaign_id: string;
	segment_id: string;
	template_id: string;
	name: string;
	subject: string;
	scheduled_at?: string;
	started_at?: string;
	completed_at?: string;
	status: ApiEmailBlastStatus;
	total_recipients: number;
	sent_count: number;
	delivered_count: number;
	opened_count: number;
	clicked_count: number;
	bounced_count: number;
	failed_count: number;
	batch_size: number;
	current_batch: number;
	last_batch_at?: string;
	error_message?: string;
	send_throttle_per_second?: number;
	created_by?: string;
	created_at: string;
	updated_at: string;
}

export type ApiEmailBlastStatus =
	| "draft"
	| "scheduled"
	| "processing"
	| "sending"
	| "completed"
	| "paused"
	| "cancelled"
	| "failed";

// ============================================================================
// Blast Recipient Types
// ============================================================================

export interface ApiBlastRecipient {
	id: string;
	blast_id: string;
	user_id: string;
	email: string;
	status: ApiBlastRecipientStatus;
	email_log_id?: string;
	queued_at?: string;
	sent_at?: string;
	delivered_at?: string;
	opened_at?: string;
	clicked_at?: string;
	bounced_at?: string;
	failed_at?: string;
	error_message?: string;
	batch_number?: number;
	created_at: string;
	updated_at: string;
}

export type ApiBlastRecipientStatus =
	| "pending"
	| "queued"
	| "sending"
	| "sent"
	| "delivered"
	| "opened"
	| "clicked"
	| "bounced"
	| "failed";

// ============================================================================
// Analytics Types
// ============================================================================

export interface ApiBlastAnalytics {
	blast_id: string;
	name: string;
	status: ApiEmailBlastStatus;
	total_recipients: number;
	sent: number;
	delivered: number;
	opened: number;
	clicked: number;
	bounced: number;
	failed: number;
	open_rate: number;
	click_rate: number;
	bounce_rate: number;
	started_at?: string;
	completed_at?: string;
	duration_seconds?: number;
}

// ============================================================================
// Request Types (for API calls)
// ============================================================================

export interface ApiCreateEmailBlastRequest {
	name: string;
	segment_id: string;
	template_id: string;
	subject: string;
	scheduled_at?: string;
	batch_size?: number;
	send_throttle_per_second?: number;
}

export interface ApiUpdateEmailBlastRequest {
	name?: string;
	subject?: string;
	batch_size?: number;
}

export interface ApiScheduleBlastRequest {
	scheduled_at: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ApiListEmailBlastsResponse {
	blasts: ApiEmailBlast[];
	total: number;
	page: number;
	limit: number;
	total_pages: number;
}

export interface ApiListEmailBlastsParams {
	page?: number;
	limit?: number;
}

export interface ApiListBlastRecipientsResponse {
	recipients: ApiBlastRecipient[];
	total: number;
	page: number;
	limit: number;
	total_pages: number;
}

export interface ApiListBlastRecipientsParams {
	page?: number;
	limit?: number;
}
