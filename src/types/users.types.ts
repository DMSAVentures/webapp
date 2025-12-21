/**
 * User and Waitlist User Type Definitions
 *
 * Types for users, waitlist participants, and related functionality
 */

// ============================================================================
// Waitlist User Types
// ============================================================================

export interface WaitlistUser {
	id: string;
	campaignId: string;
	email: string;
	emailVerified: boolean;
	status: WaitlistUserStatus;
	position: number;
	originalPosition: number;
	referralCode: string;
	referredById?: string;
	referralCount: number;
	verifiedReferralCount: number;
	shareCount: number;
	points: number;
	source: string;
	termsAccepted: boolean;
	marketingConsent: boolean;
	customFields?: Record<string, string>;
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type WaitlistUserStatus =
	| "pending"
	| "verified"
	| "invited"
	| "active"
	| "rejected";

export interface UTMParams {
	source?: string;
	medium?: string;
	campaign?: string;
	content?: string;
	term?: string;
}

export interface UserMetadata {
	ipAddress?: string;
	userAgent?: string;
	country?: string;
	device?: "mobile" | "tablet" | "desktop";
}

// ============================================================================
// User List/Filter Types
// ============================================================================

export interface ListUsersParams {
	page?: number;
	limit?: number;
	status?: WaitlistUserStatus | "removed" | "blocked";
	sort?: "position" | "created_at" | "referral_count";
	order?: "asc" | "desc";
}

export interface ListUsersResponse {
	users: WaitlistUser[];
	total_count: number;
	page: number;
	page_size: number;
	total_pages: number;
}

// ============================================================================
// User Filter Types (for UI components)
// ============================================================================

export interface UserFilters {
	status?: WaitlistUserStatus[];
	source?: string[];
	hasReferrals?: boolean;
	minPosition?: number;
	maxPosition?: number;
	dateRange?: {
		start: Date;
		end: Date;
	};
}

// ============================================================================
// Sort Types
// ============================================================================

export type UserSortField =
	| "email"
	| "status"
	| "position"
	| "referralCount"
	| "source"
	| "createdAt";

export type SortDirection = "asc" | "desc";
