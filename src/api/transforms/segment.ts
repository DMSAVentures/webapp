/**
 * Segment Transformers
 *
 * Transform between API (snake_case) and UI (camelCase) segment types
 */

import type {
	Segment,
	SegmentFilterCriteria,
	SegmentPreview,
	SegmentPreviewUser,
} from "@/types/segment";
import type {
	ApiPreviewSegmentResponse,
	ApiSegment,
	ApiSegmentFilterCriteria,
	ApiSegmentPreviewUser,
} from "../types/segment";
import { formatDateToISO, parseDate } from "./base";

// ============================================================================
// API → UI Transformers
// ============================================================================

export function toUiFilterCriteria(
	api: ApiSegmentFilterCriteria,
): SegmentFilterCriteria {
	return {
		statuses: api.statuses,
		sources: api.sources,
		emailVerified: api.email_verified,
		minReferrals: api.min_referrals,
		maxReferrals: api.max_referrals,
		dateFrom: parseDate(api.date_from),
		dateTo: parseDate(api.date_to),
		customFields: api.custom_fields,
	};
}

export function toUiSegmentPreviewUser(
	api: ApiSegmentPreviewUser,
): SegmentPreviewUser {
	return {
		id: api.id,
		email: api.email,
		firstName: api.first_name,
		lastName: api.last_name,
		status: api.status,
		createdAt: parseDate(api.created_at)!,
	};
}

export function toUiSegment(api: ApiSegment): Segment {
	return {
		id: api.id,
		campaignId: api.campaign_id,
		name: api.name,
		description: api.description,
		filterCriteria: toUiFilterCriteria(api.filter_criteria || {}),
		cachedUserCount: api.cached_user_count ?? 0,
		cachedAt: parseDate(api.cached_at),
		status: api.status,
		createdAt: parseDate(api.created_at)!,
		updatedAt: parseDate(api.updated_at)!,
	};
}

export function toUiSegmentPreview(
	api: ApiPreviewSegmentResponse,
): SegmentPreview {
	return {
		count: api.count ?? 0,
		sampleUsers: (api.sample_users || []).map(toUiSegmentPreviewUser),
	};
}

// ============================================================================
// UI → API Transformers (for requests)
// ============================================================================

export function toApiFilterCriteria(
	ui: SegmentFilterCriteria,
): ApiSegmentFilterCriteria {
	return {
		statuses: ui.statuses,
		sources: ui.sources,
		email_verified: ui.emailVerified,
		min_referrals: ui.minReferrals,
		max_referrals: ui.maxReferrals,
		date_from: formatDateToISO(ui.dateFrom),
		date_to: formatDateToISO(ui.dateTo),
		custom_fields: ui.customFields,
	};
}
