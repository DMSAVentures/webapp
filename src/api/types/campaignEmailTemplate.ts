/**
 * Campaign Email Template API Types
 *
 * API request/response types matching Go backend (snake_case)
 * For campaign-specific automated emails (verification, welcome, etc.)
 */

import type { EmailBlocksJson } from "@/types/campaignEmailTemplate";

// ============================================================================
// Campaign Email Template Core Types (API Response)
// ============================================================================

export type ApiCampaignEmailTemplateType =
	| "verification"
	| "welcome"
	| "position_update"
	| "reward_earned"
	| "milestone"
	| "custom";

export interface ApiCampaignEmailTemplate {
	id: string;
	campaign_id: string;
	name: string;
	type: ApiCampaignEmailTemplateType;
	subject: string;
	html_body: string;
	blocks_json?: EmailBlocksJson;
	enabled: boolean;
	send_automatically: boolean;
	variant_name?: string;
	variant_weight?: number;
	created_at: string;
	updated_at: string;
}

// ============================================================================
// Request Types (for API calls)
// ============================================================================

export interface ApiCreateCampaignEmailTemplateRequest {
	name: string;
	type: ApiCampaignEmailTemplateType;
	subject: string;
	html_body: string;
	blocks_json?: EmailBlocksJson;
	enabled?: boolean;
	send_automatically?: boolean;
}

export interface ApiUpdateCampaignEmailTemplateRequest {
	name?: string;
	subject?: string;
	html_body?: string;
	blocks_json?: EmailBlocksJson;
	enabled?: boolean;
	send_automatically?: boolean;
}

export interface ApiSendTestEmailRequest {
	recipient_email: string;
	test_data?: Record<string, string | number>;
}
