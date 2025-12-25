/**
 * Campaign API Types
 *
 * API request/response types matching Go backend (snake_case)
 */

// ============================================================================
// Campaign Core Types (API Response)
// ============================================================================

export interface ApiCampaign {
	id: string;
	account_id: string;
	name: string;
	slug: string;
	description?: string;
	status: ApiCampaignStatus;
	type: ApiCampaignType;
	launch_date?: string;
	end_date?: string;
	privacy_policy_url?: string;
	terms_url?: string;
	max_signups?: number;
	total_signups: number;
	total_verified: number;
	total_referrals: number;
	created_at: string;
	updated_at: string;

	// Settings (loaded via relationships)
	email_settings?: ApiEmailSettings;
	branding_settings?: ApiBrandingSettings;
	form_settings?: ApiFormSettings;
	referral_settings?: ApiReferralSettings;
	form_fields?: ApiFormField[];
	share_messages?: ApiShareMessage[];
	tracking_integrations?: ApiTrackingIntegration[];
}

export type ApiCampaignStatus = "draft" | "active" | "paused" | "completed";
export type ApiCampaignType = "waitlist" | "referral" | "contest";

// ============================================================================
// Settings Types (API Response - 1:1 relationships)
// ============================================================================

export interface ApiEmailSettings {
	id: string;
	campaign_id: string;
	from_name?: string;
	from_email?: string;
	reply_to?: string;
	verification_required: boolean;
	send_welcome_email: boolean;
	created_at: string;
	updated_at: string;
}

export interface ApiBrandingSettings {
	id: string;
	campaign_id: string;
	logo_url?: string;
	primary_color?: string;
	font_family?: string;
	custom_domain?: string;
	created_at: string;
	updated_at: string;
}

export interface ApiFormSettings {
	id: string;
	campaign_id: string;
	captcha_enabled: boolean;
	captcha_provider?: ApiCaptchaProvider;
	captcha_site_key?: string;
	double_opt_in: boolean;
	design?: ApiFormSettingsDesign;
	success_title?: string;
	success_message?: string;
	created_at: string;
	updated_at: string;
}

export type ApiCaptchaProvider = "turnstile" | "recaptcha" | "hcaptcha";

export interface ApiFormSettingsDesign {
	layout?: "single-column" | "two-column" | "multi-step";
	colors?: {
		primary?: string;
		background?: string;
		text?: string;
		border?: string;
		error?: string;
		success?: string;
	};
	typography?: {
		fontFamily?: string;
		fontSize?: number;
		fontWeight?: number;
	};
	spacing?: {
		padding?: number;
		gap?: number;
	};
	borderRadius?: number;
	submitButtonText?: string;
	customCss?: string;
}

export interface ApiReferralSettings {
	id: string;
	campaign_id: string;
	enabled: boolean;
	points_per_referral: number;
	verified_only: boolean;
	positions_to_jump: number;
	referrer_positions_to_jump: number;
	sharing_channels: ApiSharingChannel[];
	created_at: string;
	updated_at: string;
}

export type ApiSharingChannel =
	| "email"
	| "twitter"
	| "facebook"
	| "linkedin"
	| "whatsapp";

// ============================================================================
// Entity Types (API Response - 1:N relationships)
// ============================================================================

export interface ApiFormField {
	id: string;
	campaign_id: string;
	name: string;
	field_type: ApiFormFieldType;
	label: string;
	placeholder?: string;
	required: boolean;
	validation_pattern?: string;
	options?: string[];
	display_order: number;
	created_at: string;
	updated_at: string;
}

export type ApiFormFieldType =
	| "email"
	| "text"
	| "textarea"
	| "select"
	| "checkbox"
	| "radio"
	| "phone"
	| "url"
	| "date"
	| "number";

export interface ApiShareMessage {
	id: string;
	campaign_id: string;
	channel: ApiSharingChannel;
	message: string;
	created_at: string;
	updated_at: string;
}

export interface ApiTrackingIntegration {
	id: string;
	campaign_id: string;
	integration_type: ApiTrackingIntegrationType;
	enabled: boolean;
	tracking_id: string;
	tracking_label?: string;
	created_at: string;
	updated_at: string;
}

export type ApiTrackingIntegrationType =
	| "google_analytics"
	| "meta_pixel"
	| "google_ads"
	| "tiktok_pixel"
	| "linkedin_insight";

// ============================================================================
// Request Types (for API calls)
// ============================================================================

export interface ApiEmailSettingsInput {
	from_name?: string;
	from_email?: string;
	reply_to?: string;
	verification_required?: boolean;
	send_welcome_email?: boolean;
}

export interface ApiBrandingSettingsInput {
	logo_url?: string;
	primary_color?: string;
	font_family?: string;
	custom_domain?: string;
}

export interface ApiFormSettingsInput {
	captcha_enabled?: boolean;
	captcha_provider?: ApiCaptchaProvider;
	captcha_site_key?: string;
	double_opt_in?: boolean;
	design?: ApiFormSettingsDesign;
	success_title?: string;
	success_message?: string;
}

export interface ApiReferralSettingsInput {
	enabled?: boolean;
	points_per_referral?: number;
	verified_only?: boolean;
	positions_to_jump?: number;
	referrer_positions_to_jump?: number;
	sharing_channels?: ApiSharingChannel[];
}

export interface ApiFormFieldInput {
	name: string;
	field_type: ApiFormFieldType;
	label: string;
	placeholder?: string;
	required?: boolean;
	validation_pattern?: string;
	options?: string[];
	display_order: number;
}

export interface ApiShareMessageInput {
	channel: ApiSharingChannel;
	message: string;
}

export interface ApiTrackingIntegrationInput {
	integration_type: ApiTrackingIntegrationType;
	enabled?: boolean;
	tracking_id: string;
	tracking_label?: string;
}

export interface ApiCreateCampaignRequest {
	name: string;
	slug: string;
	description?: string;
	type: ApiCampaignType;
	privacy_policy_url?: string;
	terms_url?: string;
	max_signups?: number;

	// Settings
	email_settings?: ApiEmailSettingsInput;
	branding_settings?: ApiBrandingSettingsInput;
	form_settings?: ApiFormSettingsInput;
	referral_settings?: ApiReferralSettingsInput;
	form_fields?: ApiFormFieldInput[];
	share_messages?: ApiShareMessageInput[];
	tracking_integrations?: ApiTrackingIntegrationInput[];
}

export interface ApiUpdateCampaignRequest {
	name?: string;
	description?: string;
	launch_date?: string;
	end_date?: string;
	privacy_policy_url?: string;
	terms_url?: string;
	max_signups?: number;

	// Settings
	email_settings?: ApiEmailSettingsInput;
	branding_settings?: ApiBrandingSettingsInput;
	form_settings?: ApiFormSettingsInput;
	referral_settings?: ApiReferralSettingsInput;
	form_fields?: ApiFormFieldInput[];
	share_messages?: ApiShareMessageInput[];
	tracking_integrations?: ApiTrackingIntegrationInput[];
}

export interface ApiUpdateCampaignStatusRequest {
	status: ApiCampaignStatus;
}

export interface ApiListCampaignsResponse {
	campaigns: ApiCampaign[];
	pagination: {
		next_cursor?: string;
		has_more: boolean;
		total_count?: number;
	};
}

export interface ApiListCampaignsParams {
	page?: number;
	limit?: number;
	status?: ApiCampaignStatus;
	type?: ApiCampaignType;
}
