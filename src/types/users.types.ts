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
	name?: string;
	customFields: Record<string, unknown>;
	status: WaitlistUserStatus;
	position: number;
	referralCode: string;
	referredBy?: string;
	referralCount: number;
	points: number;
	source: string;
	utmParams?: UTMParams;
	metadata: UserMetadata;
	createdAt: Date;
	verifiedAt?: Date;
	invitedAt?: Date;
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
	| "name"
	| "status"
	| "position"
	| "referralCount"
	| "source"
	| "createdAt";

export type SortDirection = "asc" | "desc";
