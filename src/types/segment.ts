/**
 * Segment UI Types
 *
 * UI types (camelCase) for segments
 */

export interface Segment {
	id: string;
	campaignId: string;
	name: string;
	description?: string;
	filterCriteria: SegmentFilterCriteria;
	cachedUserCount: number;
	cachedAt?: Date;
	status: SegmentStatus;
	createdAt: Date;
	updatedAt: Date;
}

export type SegmentStatus = "active" | "archived";

export interface SegmentFilterCriteria {
	statuses?: string[];
	sources?: string[];
	emailVerified?: boolean;
	minReferrals?: number;
	maxReferrals?: number;
	dateFrom?: Date;
	dateTo?: Date;
	customFields?: Record<string, string>;
}

export interface SegmentPreviewUser {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	status: string;
	createdAt: Date;
}

export interface SegmentPreview {
	count: number;
	sampleUsers: SegmentPreviewUser[];
}

export interface CreateSegmentInput {
	name: string;
	description?: string;
	filterCriteria: SegmentFilterCriteria;
}

export interface UpdateSegmentInput {
	name?: string;
	description?: string;
	filterCriteria?: SegmentFilterCriteria;
}
