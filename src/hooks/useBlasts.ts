/**
 * Email Blast Hooks
 *
 * Hooks for managing email blasts for campaigns
 */

import { useCallback, useEffect, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import {
	toUiBlastAnalytics,
	toUiBlastRecipient,
	toUiEmailBlast,
} from "@/api/transforms/blast";
import type {
	ApiBlastAnalytics,
	ApiEmailBlast,
	ApiListBlastRecipientsResponse,
	ApiListEmailBlastsResponse,
} from "@/api/types/blast";
import type { BlastAnalytics, BlastRecipient, EmailBlast } from "@/types/blast";
import { isAbortError, toApiError } from "@/utils";

// ============================================================================
// useGetBlasts - Fetch all blasts for a campaign
// ============================================================================

export const useGetBlasts = (campaignId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [blasts, setBlasts] = useState<EmailBlast[]>([]);
	const [total, setTotal] = useState<number>(0);

	const fetchBlasts = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId) {
				setBlasts([]);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiListEmailBlastsResponse>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts`,
					{ method: "GET", signal },
				);
				setBlasts((response.blasts || []).map(toUiEmailBlast));
				setTotal(response.total);
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
				setBlasts([]);
			} finally {
				setLoading(false);
			}
		},
		[campaignId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchBlasts(controller.signal);
		return () => controller.abort();
	}, [fetchBlasts]);

	return {
		blasts,
		total,
		loading,
		error,
		refetch: fetchBlasts,
	};
};

// ============================================================================
// useGetBlast - Fetch a single blast
// ============================================================================

export const useGetBlast = (campaignId: string, blastId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [blast, setBlast] = useState<EmailBlast | null>(null);

	const fetchBlast = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId || !blastId) {
				setBlast(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}`,
					{ method: "GET", signal },
				);
				setBlast(toUiEmailBlast(response));
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[campaignId, blastId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchBlast(controller.signal);
		return () => controller.abort();
	}, [fetchBlast]);

	return {
		blast,
		loading,
		error,
		refetch: fetchBlast,
	};
};

// ============================================================================
// useCreateBlast - Create a new blast
// ============================================================================

export const useCreateBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailBlast | null>(null);

	const createBlast = useCallback(
		async (
			campaignId: string,
			request: {
				name: string;
				segmentId: string;
				templateId: string;
				subject: string;
				scheduledAt?: Date;
				batchSize?: number;
			},
		): Promise<EmailBlast | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts`,
					{
						method: "POST",
						body: JSON.stringify({
							name: request.name,
							segment_id: request.segmentId,
							template_id: request.templateId,
							subject: request.subject,
							scheduled_at: request.scheduledAt?.toISOString(),
							batch_size: request.batchSize,
						}),
					},
				);
				const blast = toUiEmailBlast(response);
				setData(blast);
				return blast;
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
		createBlast,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useUpdateBlast - Update an existing blast
// ============================================================================

export const useUpdateBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailBlast | null>(null);

	const updateBlast = useCallback(
		async (
			campaignId: string,
			blastId: string,
			updates: {
				name?: string;
				subject?: string;
				batchSize?: number;
			},
		): Promise<EmailBlast | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}`,
					{
						method: "PUT",
						body: JSON.stringify({
							name: updates.name,
							subject: updates.subject,
							batch_size: updates.batchSize,
						}),
					},
				);
				const blast = toUiEmailBlast(response);
				setData(blast);
				return blast;
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
		updateBlast,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useDeleteBlast - Delete a blast
// ============================================================================

export const useDeleteBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const deleteBlast = useCallback(
		async (campaignId: string, blastId: string): Promise<boolean> => {
			setLoading(true);
			setError(null);
			try {
				await fetcher<void>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}`,
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
		deleteBlast,
		loading,
		error,
	};
};

// ============================================================================
// useSendBlast - Send a blast immediately
// ============================================================================

export const useSendBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailBlast | null>(null);

	const sendBlast = useCallback(
		async (campaignId: string, blastId: string): Promise<EmailBlast | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}/send`,
					{ method: "POST" },
				);
				const blast = toUiEmailBlast(response);
				setData(blast);
				return blast;
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
		sendBlast,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useScheduleBlast - Schedule a blast
// ============================================================================

export const useScheduleBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailBlast | null>(null);

	const scheduleBlast = useCallback(
		async (
			campaignId: string,
			blastId: string,
			scheduledAt: Date,
		): Promise<EmailBlast | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}/schedule`,
					{
						method: "POST",
						body: JSON.stringify({
							scheduled_at: scheduledAt.toISOString(),
						}),
					},
				);
				const blast = toUiEmailBlast(response);
				setData(blast);
				return blast;
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
		scheduleBlast,
		loading,
		error,
		data,
	};
};

// ============================================================================
// usePauseBlast - Pause a sending blast
// ============================================================================

export const usePauseBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailBlast | null>(null);

	const pauseBlast = useCallback(
		async (campaignId: string, blastId: string): Promise<EmailBlast | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}/pause`,
					{ method: "POST" },
				);
				const blast = toUiEmailBlast(response);
				setData(blast);
				return blast;
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
		pauseBlast,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useResumeBlast - Resume a paused blast
// ============================================================================

export const useResumeBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailBlast | null>(null);

	const resumeBlast = useCallback(
		async (campaignId: string, blastId: string): Promise<EmailBlast | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}/resume`,
					{ method: "POST" },
				);
				const blast = toUiEmailBlast(response);
				setData(blast);
				return blast;
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
		resumeBlast,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useCancelBlast - Cancel a blast
// ============================================================================

export const useCancelBlast = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<EmailBlast | null>(null);

	const cancelBlast = useCallback(
		async (campaignId: string, blastId: string): Promise<EmailBlast | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiEmailBlast>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}/cancel`,
					{ method: "POST" },
				);
				const blast = toUiEmailBlast(response);
				setData(blast);
				return blast;
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
		cancelBlast,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useGetBlastAnalytics - Get analytics for a blast
// ============================================================================

export const useGetBlastAnalytics = (campaignId: string, blastId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [analytics, setAnalytics] = useState<BlastAnalytics | null>(null);

	const fetchAnalytics = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId || !blastId) {
				setAnalytics(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiBlastAnalytics>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}/analytics`,
					{ method: "GET", signal },
				);
				setAnalytics(toUiBlastAnalytics(response));
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[campaignId, blastId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchAnalytics(controller.signal);
		return () => controller.abort();
	}, [fetchAnalytics]);

	return {
		analytics,
		loading,
		error,
		refetch: fetchAnalytics,
	};
};

// ============================================================================
// useGetBlastRecipients - Get recipients for a blast
// ============================================================================

export const useGetBlastRecipients = (
	campaignId: string,
	blastId: string,
	page: number = 1,
	limit: number = 25,
) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [recipients, setRecipients] = useState<BlastRecipient[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(0);

	const fetchRecipients = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!campaignId || !blastId) {
				setRecipients([]);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiListBlastRecipientsResponse>(
					`${import.meta.env.VITE_API_URL}/api/v1/campaigns/${campaignId}/blasts/${blastId}/recipients?page=${page}&limit=${limit}`,
					{ method: "GET", signal },
				);
				setRecipients((response.recipients || []).map(toUiBlastRecipient));
				setTotal(response.total);
				setTotalPages(response.total_pages);
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
				setRecipients([]);
			} finally {
				setLoading(false);
			}
		},
		[campaignId, blastId, page, limit],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchRecipients(controller.signal);
		return () => controller.abort();
	}, [fetchRecipients]);

	return {
		recipients,
		total,
		totalPages,
		loading,
		error,
		refetch: fetchRecipients,
	};
};
