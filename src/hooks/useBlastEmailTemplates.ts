/**
 * Blast Email Template Hooks
 *
 * Hooks for managing blast email templates (account-level, reusable for email blasts)
 */

import { useCallback, useEffect, useState } from "react";
import { type ApiError, fetcher } from "@/api";
import {
	toUiBlastEmailTemplate,
	toUiBlastEmailTemplates,
} from "@/api/transforms/blastEmailTemplate";
import type { ApiBlastEmailTemplate } from "@/api/types/blastEmailTemplate";
import type {
	BlastEmailTemplate,
	CreateBlastEmailTemplateInput,
	UpdateBlastEmailTemplateInput,
} from "@/types/blastEmailTemplate";
import { isAbortError, toApiError } from "@/utils";

// ============================================================================
// useGetBlastEmailTemplates - Fetch all blast email templates
// ============================================================================

export const useGetBlastEmailTemplates = () => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [templates, setTemplates] = useState<BlastEmailTemplate[]>([]);

	const fetchTemplates = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiBlastEmailTemplate[]>(
					`${import.meta.env.VITE_API_URL}/api/v1/blast-email-templates`,
					{
						method: "GET",
						signal,
					},
				);
				setTemplates(toUiBlastEmailTemplates(response || []));
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
				setTemplates([]);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchTemplates(controller.signal);
		return () => controller.abort();
	}, [fetchTemplates]);

	return {
		templates,
		loading,
		error,
		refetch: fetchTemplates,
	};
};

// ============================================================================
// useGetBlastEmailTemplate - Fetch a single blast email template
// ============================================================================

export const useGetBlastEmailTemplate = (templateId: string) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<ApiError | null>(null);
	const [template, setTemplate] = useState<BlastEmailTemplate | null>(null);

	const fetchTemplate = useCallback(
		async (signal?: AbortSignal): Promise<void> => {
			if (!templateId) {
				setTemplate(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiBlastEmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/blast-email-templates/${templateId}`,
					{ method: "GET", signal },
				);
				setTemplate(toUiBlastEmailTemplate(response));
			} catch (error: unknown) {
				if (isAbortError(error)) {
					return;
				}
				setError(toApiError(error));
			} finally {
				setLoading(false);
			}
		},
		[templateId],
	);

	useEffect(() => {
		const controller = new AbortController();
		fetchTemplate(controller.signal);
		return () => controller.abort();
	}, [fetchTemplate]);

	return {
		template,
		loading,
		error,
		refetch: fetchTemplate,
	};
};

// ============================================================================
// useCreateBlastEmailTemplate - Create a new blast email template
// ============================================================================

export const useCreateBlastEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<BlastEmailTemplate | null>(null);

	const createTemplate = useCallback(
		async (
			input: CreateBlastEmailTemplateInput,
		): Promise<BlastEmailTemplate | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiBlastEmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/blast-email-templates`,
					{
						method: "POST",
						body: JSON.stringify({
							name: input.name,
							subject: input.subject,
							html_body: input.htmlBody,
							blocks_json: input.blocksJson,
						}),
					},
				);
				const template = toUiBlastEmailTemplate(response);
				setData(template);
				return template;
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
		createTemplate,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useUpdateBlastEmailTemplate - Update an existing blast email template
// ============================================================================

export const useUpdateBlastEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [data, setData] = useState<BlastEmailTemplate | null>(null);

	const updateTemplate = useCallback(
		async (
			templateId: string,
			input: UpdateBlastEmailTemplateInput,
		): Promise<BlastEmailTemplate | null> => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetcher<ApiBlastEmailTemplate>(
					`${import.meta.env.VITE_API_URL}/api/v1/blast-email-templates/${templateId}`,
					{
						method: "PUT",
						body: JSON.stringify({
							name: input.name,
							subject: input.subject,
							html_body: input.htmlBody,
							blocks_json: input.blocksJson,
						}),
					},
				);
				const template = toUiBlastEmailTemplate(response);
				setData(template);
				return template;
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
		updateTemplate,
		loading,
		error,
		data,
	};
};

// ============================================================================
// useDeleteBlastEmailTemplate - Delete a blast email template
// ============================================================================

export const useDeleteBlastEmailTemplate = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);

	const deleteTemplate = useCallback(
		async (templateId: string): Promise<boolean> => {
			setLoading(true);
			setError(null);
			try {
				await fetcher<void>(
					`${import.meta.env.VITE_API_URL}/api/v1/blast-email-templates/${templateId}`,
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
		deleteTemplate,
		loading,
		error,
	};
};

// ============================================================================
// useSendBlastTestEmail - Send a test email for a blast template
// ============================================================================

export const useSendBlastTestEmail = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<ApiError | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const sendTestEmail = useCallback(
		async (
			templateId: string,
			recipientEmail: string,
			testData?: Record<string, string | number>,
		): Promise<boolean> => {
			setLoading(true);
			setError(null);
			setSuccess(false);
			try {
				await fetcher<void>(
					`${import.meta.env.VITE_API_URL}/api/v1/blast-email-templates/${templateId}/send-test`,
					{
						method: "POST",
						body: JSON.stringify({
							recipient_email: recipientEmail,
							test_data: testData,
						}),
					},
				);
				setSuccess(true);
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

	const reset = useCallback(() => {
		setSuccess(false);
		setError(null);
	}, []);

	return {
		sendTestEmail,
		loading,
		error,
		success,
		reset,
	};
};

// ============================================================================
// Re-export types for convenience
// ============================================================================

export type {
	BlastEmailTemplate,
	CreateBlastEmailTemplateInput,
	UpdateBlastEmailTemplateInput,
} from "@/types/blastEmailTemplate";
