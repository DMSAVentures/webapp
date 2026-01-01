/**
 * Blast Email Template API Types
 *
 * API request/response types matching Go backend (snake_case)
 * For account-level blast email templates used with email blasts.
 */

import type { EmailBlocksJson } from "@/types/campaignEmailTemplate";

// ============================================================================
// Blast Email Template Core Types (API Response)
// ============================================================================

export interface ApiBlastEmailTemplate {
	id: string;
	account_id: string;
	name: string;
	subject: string;
	html_body: string;
	blocks_json?: EmailBlocksJson;
	created_at: string;
	updated_at: string;
}

// ============================================================================
// Request Types (for API calls)
// ============================================================================

export interface ApiCreateBlastEmailTemplateRequest {
	name: string;
	subject: string;
	html_body: string;
	blocks_json?: EmailBlocksJson;
}

export interface ApiUpdateBlastEmailTemplateRequest {
	name?: string;
	subject?: string;
	html_body?: string;
	blocks_json?: EmailBlocksJson;
}

export interface ApiBlastTemplateSendTestEmailRequest {
	recipient_email: string;
	test_data?: Record<string, string | number>;
}
