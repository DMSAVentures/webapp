/**
 * User Data Transformation Utilities
 *
 * Utilities for transforming API responses to UI-friendly formats
 */

import type { WaitlistUser } from "@/types/users.types";

/**
 * Transform API user response to WaitlistUser type
 * Maps snake_case API fields to camelCase UI fields and parses dates
 */
// biome-ignore lint/suspicious/noExplicitAny: API response structure differs from UI types
export function transformApiUserToWaitlistUser(user: any): WaitlistUser {
	return {
		id: user.id,
		campaignId: user.campaign_id,
		email: user.email,
		name:
			user.first_name && user.last_name
				? `${user.first_name} ${user.last_name}`.trim()
				: user.first_name || user.last_name || undefined,
		customFields: user.metadata || {},
		status: user.status || "pending",
		position: user.position || 0,
		referralCode: user.referral_code || "",
		referredBy: user.referred_by_id,
		referralCount: user.referral_count || 0,
		points: user.points || 0,
		source: user.source || "direct",
		utmParams: {
			source: user.utm_source,
			medium: user.utm_medium,
			campaign: user.utm_campaign,
			term: user.utm_term,
			content: user.utm_content,
		},
		metadata: {
			ipAddress: user.metadata?.ipAddress,
			userAgent: user.metadata?.userAgent,
			country: user.country_code,
			device: user.metadata?.device,
		},
		createdAt: new Date(user.created_at),
		verifiedAt: user.verified_at ? new Date(user.verified_at) : undefined,
		invitedAt: user.invited_at ? new Date(user.invited_at) : undefined,
	};
}

/**
 * Transform array of API users to WaitlistUser array
 */
// biome-ignore lint/suspicious/noExplicitAny: API response structure differs from UI types
export function transformApiUsersToWaitlistUsers(users: any[]): WaitlistUser[] {
	return users.map(transformApiUserToWaitlistUser);
}
