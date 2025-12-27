/**
 * Segment Hooks
 *
 * Hooks for managing segments for campaigns
 */

import { useCallback, useEffect, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import {
	toApiFilterCriteria,
	toUiSegment,
	toUiSegmentPreview,
} from "@/api/transforms/segment";
import type {
	ApiListSegmentsResponse,
	ApiPreviewSegmentResponse,
	ApiSegment,
} from "@/api/types/segment";
import type {
	Segment,
	SegmentFilterCriteria,
	SegmentPreview,
} from "@/types/segment";
import { isAbortError, toApiError } from "@/utils";

// ============================================================================
// useGetSegments - Fetch all segments for a campaign
// ============================================================================

export const useGetSegments = (campaignId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [segments, setSegments] = useState<Segment[]>([]);
	const [total, setTotal] = useState<number>(0);

	const fetchSegments = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId) {
				setSegments([]);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiListSegmentsResponse>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/segments`,
					{ method: "GET", signal },
				);
				setSegments((response.segments || []).map(toUiSegment));
				setTotal(response.total);
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
				setSegments([]);
			} finally {
				setLoading(false);
			}
		},
		[campaignId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchSegments(controller.signal);
		return () => controller.abort();
	}, [fetchSegments]);

	return {
		segments,
		total,
		loading,
		error,
		refetch: fetchSegments,
	};
};

// ============================================================================
// useGetSegment - Fetch a single segment
// ============================================================================

export const useGetSegment = (campaignId: string, segmentId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [segment, setSegment] = useState<Segment | null>(null);

	const fetchSegment = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId || !segmentId) {
				setSegment(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiSegment>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/segments/${segmentId}`,
					{ method: "GET", signal },
				);
				setSegment(toUiSegment(response));
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[campaignId, segmentId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchSegment(controller.signal);
		return () => controller.abort();
	}, [fetchSegment]);

	return {
		segment,
		loading,
		error,
		refetch: fetchSegment,
	};
};

// ============================================================================
// useCreateSegment - Create a new segment
// ============================================================================

export const useCreateSegment = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Segment | null>(null);

	const createSegment = useCallback(
		async (
			campaignId: string,
			name: string,
			filterCriteria: SegmentFilterCriteria,
			description?: string,
		): Promise<Segment | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiSegment>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/segments`,
					{
						method: "POST",
						body: JSON.stringify({
							name,
							description,
							filter_criteria: toApiFilterCriteria(filterCriteria),
						}),
					},
				);
				const segment = toUiSegment(response);
				setData(segment);
				return segment;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		createSegment,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useUpdateSegment - Update an existing segment
// ============================================================================

export const useUpdateSegment = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Segment | null>(null);

	const updateSegment = useCallback(
		async (
			campaignId: string,
			segmentId: string,
			updates: {
				name?: string;
				description?: string;
				filterCriteria?: SegmentFilterCriteria;
			},
		): Promise<Segment | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiSegment>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/segments/${segmentId}`,
					{
						method: "PUT",
						body: JSON.stringify({
							name: updates.name,
							description: updates.description,
							filter_criteria: updates.filterCriteria
								? toApiFilterCriteria(updates.filterCriteria)
								: undefined,
						}),
					},
				);
				const segment = toUiSegment(response);
				setData(segment);
				return segment;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		updateSegment,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useDeleteSegment - Delete a segment
// ============================================================================

export const useDeleteSegment = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const deleteSegment = useCallback(
		async (campaignId: string, segmentId: string): Promise<boolean> => {
			setLoading(true);
			setError(null);
			try {
				await fetcher<void>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/segments/${segmentId}`,
					{ method: "DELETE" },
				);
				return true;
			} catch (error: unknown) {
				setError(toApiError(error));
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		deleteSegment,
		loading,
		error,
	};
};

// ============================================================================
// usePreviewSegment - Preview segment with count and sample users
// ============================================================================

export const usePreviewSegment = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [preview, setPreview] = useState<SegmentPreview | null>(null);

	const previewSegment = useCallback(
		async (
			campaignId: string,
			filterCriteria: SegmentFilterCriteria,
		): Promise<SegmentPreview | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiPreviewSegmentResponse>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/segments/preview`,
					{
						method: "POST",
						body: JSON.stringify({
							filter_criteria: toApiFilterCriteria(filterCriteria),
						}),
					},
				);
				const result = toUiSegmentPreview(response);
				setPreview(result);
				return result;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const reset = useCallback(() => {
		setPreview(null);
		setError(null);
	}, []);

	return {
		previewSegment,
		loading,
		error,
		preview,
		reset,
	};
};

// ============================================================================
// useRefreshSegment - Refresh cached user count
// ============================================================================

export const useRefreshSegment = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<Segment | null>(null);

	const refreshSegment = useCallback(
		async (campaignId: string, segmentId: string): Promise<Segment | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiSegment>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/segments/${segmentId}/refresh`,
					{ method: "POST" },
				);
				const segment = toUiSegment(response);
				setData(segment);
				return segment;
			} catch (error: unknown) {
				setError(toApiError(error));
				return null;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		refreshSegment,
		loading,
		error,
		data,
	};
};
