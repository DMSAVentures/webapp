/**
 * Campaign Transformers
 *
 * Transform between API (snake_case) and UI (camelCase) campaign types
 */

import type {
	BrandingSettings,
	Campaign,
	EmailSettings,
	FormField,
	FormSettings,
	ReferralSettings,
	ShareMessage,
	TrackingIntegration,
} from "@/types/campaign";
import type {
	ApiBrandingSettings,
	ApiCampaign,
	ApiEmailSettings,
	ApiFormField,
	ApiFormSettings,
	ApiReferralSettings,
	ApiShareMessage,
	ApiTrackingIntegration,
} from "../types/campaign";
import { parseDate } from "./base";

// ============================================================================
// API → UI Transformers
// ============================================================================

export function toUiEmailSettings(api: ApiEmailSettings): EmailSettings {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		fromName: api.from_name,
		fromEmail: api.from_email,
		replyTo: api.reply_to,
		verificationRequired: api.verification_required,
		sendWelcomeEmail: api.send_welcome_email,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiBrandingSettings(
	api: ApiBrandingSettings,
): BrandingSettings {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		logoUrl: api.logo_url,
		primaryColor: api.primary_color,
		fontFamily: api.font_family,
		customDomain: api.custom_domain,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiFormSettings(api: ApiFormSettings): FormSettings {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		captchaEnabled: api.captcha_enabled,
		captchaProvider: api.captcha_provider,
		captchaSiteKey: api.captcha_site_key,
		doubleOptIn: api.double_opt_in,
		design: api.design,
		successTitle: api.success_title,
		successMessage: api.success_message,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiReferralSettings(
	api: ApiReferralSettings,
): ReferralSettings {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		enabled: api.enabled,
		pointsPerReferral: api.points_per_referral,
		verifiedOnly: api.verified_only,
		positionsToJump: api.positions_to_jump,
		referrerPositionsToJump: api.referrer_positions_to_jump,
		sharingChannels: api.sharing_channels,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiFormField(api: ApiFormField): FormField {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		name: api.name,
		fieldType: api.field_type,
		label: api.label,
		placeholder: api.placeholder,
		required: api.required,
		validationPattern: api.validation_pattern,
		options: api.options,
		displayOrder: api.display_order,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiShareMessage(api: ApiShareMessage): ShareMessage {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		channel: api.channel,
		message: api.message,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiTrackingIntegration(
	api: ApiTrackingIntegration,
): TrackingIntegration {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		integrationType: api.integration_type,
		enabled: api.enabled,
		trackingId: api.tracking_id,
		trackingLabel: api.tracking_label,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiCampaign(api: ApiCampaign): Campaign {
	return {
		id: api.id,
		accountId: api.account_id,
		name: api.name,
		slug: api.slug,
		description: api.description,
		status: api.status,
		type: api.type,
		launchDate: parseDate(api.launch_date),
		endDate: parseDate(api.end_date),
		privacyPolicyUrl: api.privacy_policy_url,
		termsUrl: api.terms_url,
		maxSignups: api.max_signups,
		totalSignups: api.total_signups,
		totalVerified: api.total_verified,
		totalReferrals: api.total_referrals,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,

		// Settings
		emailSettings: api.email_settings
			? toUiEmailSettings(api.email_settings)
			: undefined,
		brandingSettings: api.branding_settings
			? toUiBrandingSettings(api.branding_settings)
			: undefined,
		formSettings: api.form_settings
			? toUiFormSettings(api.form_settings)
			: undefined,
		referralSettings: api.referral_settings
			? toUiReferralSettings(api.referral_settings)
			: undefined,
		formFields: api.form_fields?.map(toUiFormField),
		shareMessages: api.share_messages?.map(toUiShareMessage),
		trackingIntegrations: api.tracking_integrations?.map(
			toUiTrackingIntegration,
		),
	};
}

// ============================================================================
// UI → API Transformers (for requests)
// ============================================================================

export function toApiFormFieldInput(
	field: FormField,
): import("../types/campaign").ApiFormFieldInput {
	return {
		name: field.name,
		field_type: field.fieldType,
		label: field.label,
		placeholder: field.placeholder,
		required: field.required,
		validation_pattern: field.validationPattern,
		options: field.options,
		display_order: field.displayOrder,
	};
}

export function toApiShareMessageInput(
	msg: ShareMessage,
): import("../types/campaign").ApiShareMessageInput {
	return {
		channel: msg.channel,
		message: msg.message,
	};
}

export function toApiTrackingIntegrationInput(
	integration: TrackingIntegration,
): import("../types/campaign").ApiTrackingIntegrationInput {
	return {
		integration_type: integration.integrationType,
		enabled: integration.enabled,
		tracking_id: integration.trackingId,
		tracking_label: integration.trackingLabel,
	};
}
