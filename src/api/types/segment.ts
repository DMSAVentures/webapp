/**
 * Segment API Types
 *
 * API request/response types matching Go backend (snake_case)
 */

// ============================================================================
// Segment Core Types (API Response)
// ============================================================================

export interface ApiSegment {
	id: string;
	campaign_id: string;
	name: string;
	description?: string;
	filter_criteria: ApiSegmentFilterCriteria;
	cached_user_count: number;
	cached_at?: string;
	status: ApiSegmentStatus;
	created_at: string;
	updated_at: string;
}

export type ApiSegmentStatus = "active" | "archived";

export interface ApiSegmentFilterCriteria {
	statuses?: string[];
	sources?: string[];
	email_verified?: boolean;
	min_referrals?: number;
	max_referrals?: number;
	date_from?: string;
	date_to?: string;
	custom_fields?: Record<string, string>;
}

// ============================================================================
// Request Types (for API calls)
// ============================================================================

export interface ApiCreateSegmentRequest {
	name: string;
	description?: string;
	filter_criteria: ApiSegmentFilterCriteria;
}

export interface ApiUpdateSegmentRequest {
	name?: string;
	description?: string;
	filter_criteria?: ApiSegmentFilterCriteria;
}

export interface ApiPreviewSegmentRequest {
	filter_criteria: ApiSegmentFilterCriteria;
}

export interface ApiPreviewSegmentResponse {
	count: number;
	sample_users: ApiSegmentPreviewUser[];
}

export interface ApiSegmentPreviewUser {
	id: string;
	email: string;
	first_name?: string;
	last_name?: string;
	status: string;
	created_at: string;
}

// ============================================================================
// Response Types
// ============================================================================

export interface ApiListSegmentsResponse {
	segments: ApiSegment[];
	total: number;
	page: number;
	limit: number;
	total_pages: number;
}

export interface ApiListSegmentsParams {
	page?: number;
	limit?: number;
	status?: ApiSegmentStatus;
}
