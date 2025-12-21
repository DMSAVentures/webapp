/**
 * User Data Transformation Utilities
 *
 * Utilities for transforming API responses to UI-friendly formats
 */

import type { ApiWaitlistUser } from "@/types/api.types";
import type { WaitlistUser } from "@/types/users.types";

/**
 * Transform API user response to WaitlistUser type
 * Maps snake_case API fields to camelCase UI fields and parses dates
 */
export function transformApiUserToWaitlistUser(
	user: ApiWaitlistUser,
): WaitlistUser {
	return {
		id: user.id,
		campaignId: user.campaign_id,
		email: user.email,
		emailVerified: user.email_verified,
		status: user.status,
		position: user.position,
		originalPosition: user.original_position,
		referralCode: user.referral_code,
		referredById: user.referred_by_id,
		referralCount: user.referral_count,
		verifiedReferralCount: user.verified_referral_count,
		shareCount: user.share_count,
		points: user.points,
		source: user.source,
		termsAccepted: user.terms_accepted,
		marketingConsent: user.marketing_consent,
		customFields: user.custom_fields,
		utmSource: user.utm_source,
		utmMedium: user.utm_medium,
		utmCampaign: user.utm_campaign,
		utmContent: user.utm_content,
		utmTerm: user.utm_term,
		createdAt: new Date(user.created_at),
		updatedAt: new Date(user.updated_at),
	};
}

/**
 * Transform array of API users to WaitlistUser array
 */
export function transformApiUsersToWaitlistUsers(
	users: ApiWaitlistUser[],
): WaitlistUser[] {
	return users.map(transformApiUserToWaitlistUser);
}
