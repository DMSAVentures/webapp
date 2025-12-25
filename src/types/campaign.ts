/**
 * Campaign UI Type Definitions
 *
 * UI types (camelCase) for use in React components
 */

import type { ApiFormSettingsDesign, ApiSharingChannel } from "@/api/types";

// ============================================================================
// Campaign Core Types (UI - camelCase)
// ============================================================================

export interface Campaign {
	id: string;
	accountId: string;
	name: string;
	slug: string;
	description?: string;
	status: CampaignStatus;
	type: CampaignType;
	launchDate?: Date;
	endDate?: Date;
	privacyPolicyUrl?: string;
	termsUrl?: string;
	maxSignups?: number;
	totalSignups: number;
	totalVerified: number;
	totalReferrals: number;
	createdAt: Date;
	updatedAt: Date;

	// Settings (loaded via relationships)
	emailSettings?: EmailSettings;
	brandingSettings?: BrandingSettings;
	formSettings?: FormSettings;
	referralSettings?: ReferralSettings;
	formFields?: FormField[];
	shareMessages?: ShareMessage[];
	trackingIntegrations?: TrackingIntegration[];
}

export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type CampaignType = "waitlist" | "referral" | "contest";

// ============================================================================
// Settings Types (UI - camelCase)
// ============================================================================

export interface EmailSettings {
	id: string;
	campaignId: string;
	fromName?: string;
	fromEmail?: string;
	replyTo?: string;
	verificationRequired: boolean;
	sendWelcomeEmail: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface BrandingSettings {
	id: string;
	campaignId: string;
	logoUrl?: string;
	primaryColor?: string;
	fontFamily?: string;
	customDomain?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface FormSettings {
	id: string;
	campaignId: string;
	captchaEnabled: boolean;
	captchaProvider?: CaptchaProvider;
	captchaSiteKey?: string;
	doubleOptIn: boolean;
	design?: FormSettingsDesign;
	successTitle?: string;
	successMessage?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type CaptchaProvider = "turnstile" | "recaptcha" | "hcaptcha";

/** Form design configuration - same structure as API (no transformation needed) */
export type FormSettingsDesign = ApiFormSettingsDesign;

export interface ReferralSettings {
	id: string;
	campaignId: string;
	enabled: boolean;
	pointsPerReferral: number;
	verifiedOnly: boolean;
	positionsToJump: number;
	referrerPositionsToJump: number;
	sharingChannels: SharingChannel[];
	createdAt: Date;
	updatedAt: Date;
}

export type SharingChannel = ApiSharingChannel;

// ============================================================================
// Entity Types (UI - camelCase)
// ============================================================================

export interface FormField {
	id: string;
	campaignId: string;
	name: string;
	fieldType: FormFieldType;
	label: string;
	placeholder?: string;
	required: boolean;
	validationPattern?: string;
	options?: string[];
	displayOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export type FormFieldType =
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

/** Type for fields that require options (select, radio) */
export type OptionsFieldType = Extract<FormFieldType, "select" | "radio">;

/** Type for fields that don't require options */
export type SimpleFieldType = Exclude<FormFieldType, OptionsFieldType>;

/** Type guard to check if a form field type requires options */
export const isOptionsFieldType = (
	type: FormFieldType,
): type is OptionsFieldType => {
	return type === "select" || type === "radio";
};

/** Type guard to check if a form field has options */
export const hasOptions = (
	field: FormField,
): field is FormField & { options: string[] } => {
	return isOptionsFieldType(field.fieldType) && Array.isArray(field.options);
};

export interface ShareMessage {
	id: string;
	campaignId: string;
	channel: SharingChannel;
	message: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TrackingIntegration {
	id: string;
	campaignId: string;
	integrationType: TrackingIntegrationType;
	enabled: boolean;
	trackingId: string;
	trackingLabel?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type TrackingIntegrationType =
	| "google_analytics"
	| "meta_pixel"
	| "google_ads"
	| "tiktok_pixel"
	| "linkedin_insight";

// ============================================================================
// List/Filter Types
// ============================================================================

export interface ListCampaignsParams {
	page?: number;
	limit?: number;
	status?: CampaignStatus;
	type?: CampaignType;
}
