/**
 * Campaign Type Definitions
 *
 * Based on OpenAPI Schema v1.0.0
 * Aligned with backend API contracts
 */

// ============================================================================
// Campaign Core Types
// ============================================================================

export interface Campaign {
	id: string;
	account_id: string;
	name: string;
	slug: string;
	description?: string;
	status: CampaignStatus;
	type: CampaignType;
	launch_date?: string;
	end_date?: string;
	form_config?: FormConfig;
	referral_config?: ReferralConfig;
	email_config?: EmailConfig;
	branding_config?: BrandingConfig;
	privacy_policy_url?: string;
	terms_url?: string;
	max_signups?: number;
	total_signups: number;
	total_verified: number;
	total_referrals: number;
	created_at: string;
	updated_at: string;
}

export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type CampaignType = "waitlist" | "referral" | "contest";

// ============================================================================
// Campaign Configuration Types
// ============================================================================

export interface FormConfig {
	fields?: FormField[];
	captcha_enabled?: boolean;
	double_opt_in?: boolean;
	custom_css?: string;
}

export interface FormField {
	name: string;
	type: FormFieldType;
	label: string;
	placeholder?: string;
	required?: boolean;
	options?: string[];
	validation?: string;
}

export type FormFieldType =
	| "email"
	| "text"
	| "select"
	| "checkbox"
	| "textarea"
	| "number";

export interface ReferralConfig {
	enabled?: boolean;
	points_per_referral?: number;
	verified_only?: boolean;
	sharing_channels?: SharingChannel[];
	custom_share_messages?: Record<string, string>;
}

export type SharingChannel =
	| "email"
	| "twitter"
	| "facebook"
	| "linkedin"
	| "whatsapp";

export interface EmailConfig {
	from_name?: string;
	from_email?: string;
	reply_to?: string;
	verification_required?: boolean;
}

export interface BrandingConfig {
	logo_url?: string;
	primary_color?: string;
	font_family?: string;
	custom_domain?: string;
}

// ============================================================================
// Campaign Request/Response Types
// ============================================================================

export interface CreateCampaignRequest {
	name: string;
	slug: string;
	description?: string;
	type: CampaignType;
	form_config?: FormConfig;
	referral_config?: ReferralConfig;
	email_config?: EmailConfig;
	branding_config?: BrandingConfig;
}

export interface UpdateCampaignRequest {
	name?: string;
	description?: string;
	launch_date?: string;
	end_date?: string;
	form_config?: FormConfig;
	referral_config?: ReferralConfig;
	email_config?: EmailConfig;
	branding_config?: BrandingConfig;
	max_signups?: number;
}

export interface UpdateCampaignStatusRequest {
	status: CampaignStatus;
}

export interface ListCampaignsResponse {
	campaigns: Campaign[];
	pagination: Pagination;
}

export interface ListCampaignsParams {
	page?: number;
	limit?: number;
	status?: CampaignStatus;
	type?: CampaignType;
}

// Re-export shared API types for convenience
export type { ApiError, Pagination } from "./api.types";
