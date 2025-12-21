/**
 * Common Type Definitions
 *
 * Core types for the Viral Waitlist & Referral Marketing Platform
 * Based on the Technical Design Document v3.0
 */

// ============================================================================
// Account User Types (distinct from Waitlist Users)
// ============================================================================

export interface AccountUser {
	id: string;
	email: string;
	name: string;
	role: "owner" | "admin" | "editor" | "viewer";
	permissions?: string[];
	createdAt: Date;
	updatedAt: Date;
}

// ============================================================================
// Campaign Types
// ============================================================================

export interface Campaign {
	id: string;
	name: string;
	description?: string;
	status: "draft" | "active" | "paused" | "completed";
	formConfig: FormConfig;
	settings: CampaignSettings;
	stats: CampaignStats;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
}

export interface CampaignSettings {
	redirectUrl?: string;
	emailVerificationRequired: boolean;
	duplicateHandling: "block" | "update" | "allow";
	enableReferrals: boolean;
	enableRewards: boolean;
}

export interface CampaignStats {
	totalSignups: number;
	verifiedSignups: number;
	totalReferrals: number;
	conversionRate: number;
	viralCoefficient: number;
}

// Re-export waitlist user types from users.types.ts
export type {
	ListUsersParams,
	ListUsersResponse,
	SortDirection,
	UserFilters,
	UserMetadata,
	UserSortField,
	UTMParams,
	WaitlistUser,
	WaitlistUserStatus,
} from "./users.types";

// ============================================================================
// Referral Types
// ============================================================================

export interface Referral {
	id: string;
	referrerId: string;
	referredUserId: string;
	campaignId: string;
	status: "clicked" | "signed_up" | "verified" | "converted";
	source:
		| "link"
		| "email"
		| "twitter"
		| "facebook"
		| "linkedin"
		| "whatsapp"
		| "instagram"
		| "telegram"
		| "other";
	createdAt: Date;
	verifiedAt?: Date;
}

// ============================================================================
// Form Types
// ============================================================================

export interface FormConfig {
	id: string;
	campaignId: string;
	fields: FormField[];
	design: FormDesign;
	behavior: FormBehavior;
}

export interface FormField {
	id: string;
	type:
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
	label: string;
	placeholder?: string;
	helpText?: string;
	required: boolean;
	order: number;
	column?: 1 | 2; // For two-column layout (1 = left, 2 = right)
	step?: number; // For multi-step forms
	options?: string[]; // For select/radio
	validation?: {
		minLength?: number;
		maxLength?: number;
		pattern?: string;
		min?: number; // For number
		max?: number; // For number
		customError?: string;
	};
	conditionalLogic?: {
		showIf: {
			fieldId: string;
			operator: "equals" | "contains" | "not_equals";
			value: unknown;
		};
	};
}

export interface FormDesign {
	layout: "single-column" | "two-column" | "multi-step";
	colors: {
		primary: string;
		background: string;
		text: string;
		border: string;
		error: string;
		success: string;
	};
	typography: {
		fontFamily: string;
		fontSize: number;
		fontWeight: number;
	};
	spacing: {
		padding: number;
		gap: number;
	};
	borderRadius: number;
	submitButtonText?: string;
	customCss?: string;
}

export interface FormBehavior {
	submitAction: "inline-message" | "redirect" | "referral-page";
	redirectUrl?: string;
	successMessage?: string;
	doubleOptIn: boolean;
	duplicateHandling: "block" | "update" | "allow";
}

// ============================================================================
// Reward Types
// ============================================================================

export interface Reward {
	id: string;
	campaignId: string;
	name: string;
	description: string;
	type:
		| "early_access"
		| "discount"
		| "premium_feature"
		| "merchandise"
		| "custom";
	value?: string; // e.g., "20% off", "Free for 6 months"
	tier: number;
	triggerType: "referral_count" | "position" | "manual";
	triggerValue?: number; // e.g., 5 referrals, top 100 position
	status: "active" | "inactive";
	inventory?: number;
	expiryDate?: Date;
	deliveryMethod: "email" | "dashboard" | "api_webhook";
	createdAt: Date;
}

export interface RewardEarned {
	id: string;
	userId: string;
	rewardId: string;
	status:
		| "pending"
		| "earned"
		| "delivered"
		| "redeemed"
		| "revoked"
		| "expired";
	earnedAt: Date;
	deliveredAt?: Date;
	redeemedAt?: Date;
	expiresAt?: Date;
	deliveryDetails?: {
		code?: string;
		instructions?: string;
	};
}

// ============================================================================
// Email Types
// ============================================================================

export interface EmailTemplate {
	id: string;
	campaignId: string;
	name: string;
	subject: string;
	preheader?: string;
	htmlContent: string;
	textContent?: string;
	type:
		| "welcome"
		| "verification"
		| "position_update"
		| "milestone"
		| "invitation"
		| "launch"
		| "custom";
	variables: string[]; // e.g., ['first_name', 'position', 'referral_link']
	status: "draft" | "active";
	createdAt: Date;
	updatedAt: Date;
}

export interface EmailCampaign {
	id: string;
	campaignId: string;
	name: string;
	templateId: string;
	segmentId?: string;
	trigger:
		| "manual"
		| "signup"
		| "verified"
		| "milestone"
		| "scheduled"
		| "inactive";
	triggerConfig?: {
		days?: number;
		hours?: number;
		milestoneType?: string;
		milestoneValue?: number;
	};
	status: "draft" | "scheduled" | "sending" | "sent" | "paused";
	scheduledFor?: Date;
	stats: {
		sent: number;
		delivered: number;
		opened: number;
		clicked: number;
		bounced: number;
		unsubscribed: number;
	};
	createdAt: Date;
	sentAt?: Date;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface Analytics {
	campaignId: string;
	dateRange: {
		start: Date;
		end: Date;
	};
	overview: {
		totalSignups: number;
		todaySignups: number;
		verificationRate: number;
		referralRate: number;
		viralCoefficient: number;
		avgReferralsPerUser: number;
	};
	funnel: {
		impressions: number;
		started: number;
		submitted: number;
		verified: number;
		referred: number;
	};
	trafficSources: {
		source: string;
		count: number;
		percentage: number;
	}[];
	referralSources: {
		platform: string;
		clicks: number;
		conversions: number;
		conversionRate: number;
	}[];
	geographic: {
		country: string;
		count: number;
		percentage: number;
	}[];
	devices: {
		type: "mobile" | "tablet" | "desktop";
		count: number;
		percentage: number;
	}[];
	timeline: {
		date: string;
		signups: number;
		referrals: number;
		verifications: number;
	}[];
}

// ============================================================================
// Leaderboard Types
// ============================================================================

export interface Leaderboard {
	campaignId: string;
	period: "all_time" | "daily" | "weekly" | "monthly";
	entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
	rank: number;
	userId: string;
	name: string;
	referralCount: number;
	points: number;
	badges: string[];
}

// ============================================================================
// Team Types
// ============================================================================

export interface TeamMember {
	id: string;
	userId: string;
	email: string;
	name: string;
	role: "owner" | "admin" | "editor" | "viewer";
	invitedAt: Date;
	joinedAt?: Date;
	lastActiveAt?: Date;
}

// ============================================================================
// Integration Types
// ============================================================================

export interface Integration {
	id: string;
	name: string;
	type:
		| "zapier"
		| "webhook"
		| "mailchimp"
		| "hubspot"
		| "salesforce"
		| "google_analytics"
		| "facebook_pixel"
		| "custom";
	status: "connected" | "disconnected" | "error";
	config: Record<string, unknown>;
	lastSyncedAt?: Date;
	createdAt: Date;
}

export interface Webhook {
	id: string;
	campaignId: string;
	name: string;
	url: string;
	events: (
		| "user.created"
		| "user.verified"
		| "user.invited"
		| "referral.created"
		| "reward.earned"
		| "campaign.milestone"
	)[];
	status: "active" | "inactive";
	secret?: string;
	headers?: Record<string, string>;
	retryConfig: {
		maxAttempts: number;
		backoffMultiplier: number;
	};
	stats: {
		totalAttempts: number;
		successfulDeliveries: number;
		failedDeliveries: number;
		lastDeliveryAt?: Date;
		lastSuccess?: Date;
		lastFailure?: Date;
	};
	createdAt: Date;
}

// ============================================================================
// UI Types
// ============================================================================

export interface Toast {
	id: string;
	type: "success" | "error" | "info" | "warning";
	message: string;
	duration?: number;
}

// Re-export API types for convenience
export type {
	ApiError,
	ApiResponse,
	ListParams,
	ListResponse,
	PaginatedResponse,
	Pagination,
	PaginationParams,
} from "./api.types";
