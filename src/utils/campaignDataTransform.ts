/**
 * Campaign Data Transformation Utilities
 *
 * Utilities for transforming API responses (snake_case) to UI-friendly formats (camelCase)
 */

import type {
	BrandingConfig,
	Campaign,
	CampaignStatus,
	CampaignType,
	EmailConfig,
	FormConfig,
	ReferralConfig,
	SharingChannel,
} from "@/types/campaign";

/**
 * API Response type for Campaign (snake_case)
 */
interface ApiCampaignResponse {
	id: string;
	account_id: string;
	name: string;
	slug: string;
	description?: string;
	status: CampaignStatus;
	type: CampaignType;
	launch_date?: string;
	end_date?: string;
	form_config?: {
		fields?: Array<{
			name: string;
			type: string;
			label: string;
			placeholder?: string;
			required?: boolean;
			options?: string[];
			validation?: string;
		}>;
		captcha_enabled?: boolean;
		double_opt_in?: boolean;
		custom_css?: string;
	};
	referral_config?: {
		enabled?: boolean;
		points_per_referral?: number;
		verified_only?: boolean;
		sharing_channels?: SharingChannel[];
		custom_share_messages?: Record<string, string>;
	};
	email_config?: {
		from_name?: string;
		from_email?: string;
		reply_to?: string;
		verification_required?: boolean;
	};
	branding_config?: {
		logo_url?: string;
		primary_color?: string;
		font_family?: string;
		custom_domain?: string;
	};
	privacy_policy_url?: string;
	terms_url?: string;
	max_signups?: number;
	total_signups: number;
	total_verified: number;
	total_referrals: number;
	created_at: string;
	updated_at: string;
}

/**
 * Transform API FormConfig to UI FormConfig
 */
function transformFormConfig(
	apiFormConfig?: ApiCampaignResponse["form_config"],
): FormConfig | undefined {
	if (!apiFormConfig) return undefined;

	return {
		fields: apiFormConfig.fields?.map((field) => ({
			name: field.name,
			type: field.type as FormConfig["fields"][number]["type"],
			label: field.label,
			placeholder: field.placeholder,
			required: field.required,
			options: field.options,
			validation: field.validation,
		})),
		captcha_enabled: apiFormConfig.captcha_enabled,
		double_opt_in: apiFormConfig.double_opt_in,
		custom_css: apiFormConfig.custom_css,
	};
}

/**
 * Transform API ReferralConfig to UI ReferralConfig
 */
function transformReferralConfig(
	apiReferralConfig?: ApiCampaignResponse["referral_config"],
): ReferralConfig | undefined {
	if (!apiReferralConfig) return undefined;

	return {
		enabled: apiReferralConfig.enabled,
		points_per_referral: apiReferralConfig.points_per_referral,
		verified_only: apiReferralConfig.verified_only,
		sharing_channels: apiReferralConfig.sharing_channels,
		custom_share_messages: apiReferralConfig.custom_share_messages,
	};
}

/**
 * Transform API EmailConfig to UI EmailConfig
 */
function transformEmailConfig(
	apiEmailConfig?: ApiCampaignResponse["email_config"],
): EmailConfig | undefined {
	if (!apiEmailConfig) return undefined;

	return {
		from_name: apiEmailConfig.from_name,
		from_email: apiEmailConfig.from_email,
		reply_to: apiEmailConfig.reply_to,
		verification_required: apiEmailConfig.verification_required,
	};
}

/**
 * Transform API BrandingConfig to UI BrandingConfig
 */
function transformBrandingConfig(
	apiBrandingConfig?: ApiCampaignResponse["branding_config"],
): BrandingConfig | undefined {
	if (!apiBrandingConfig) return undefined;

	return {
		logo_url: apiBrandingConfig.logo_url,
		primary_color: apiBrandingConfig.primary_color,
		font_family: apiBrandingConfig.font_family,
		custom_domain: apiBrandingConfig.custom_domain,
	};
}

/**
 * Transform API Campaign response to Campaign type
 * Converts snake_case API fields to camelCase UI fields
 */
export function transformApiCampaignToCampaign(
	apiCampaign: ApiCampaignResponse,
): Campaign {
	return {
		id: apiCampaign.id,
		account_id: apiCampaign.account_id,
		name: apiCampaign.name,
		slug: apiCampaign.slug,
		description: apiCampaign.description,
		status: apiCampaign.status,
		type: apiCampaign.type,
		launch_date: apiCampaign.launch_date,
		end_date: apiCampaign.end_date,
		form_config: transformFormConfig(apiCampaign.form_config),
		referral_config: transformReferralConfig(apiCampaign.referral_config),
		email_config: transformEmailConfig(apiCampaign.email_config),
		branding_config: transformBrandingConfig(apiCampaign.branding_config),
		privacy_policy_url: apiCampaign.privacy_policy_url,
		terms_url: apiCampaign.terms_url,
		max_signups: apiCampaign.max_signups,
		total_signups: apiCampaign.total_signups,
		total_verified: apiCampaign.total_verified,
		total_referrals: apiCampaign.total_referrals,
		created_at: apiCampaign.created_at,
		updated_at: apiCampaign.updated_at,
	};
}

/**
 * Transform array of API campaigns to Campaign array
 */
export function transformApiCampaignsToCampaigns(
	apiCampaigns: ApiCampaignResponse[],
): Campaign[] {
	return apiCampaigns.map(transformApiCampaignToCampaign);
}
